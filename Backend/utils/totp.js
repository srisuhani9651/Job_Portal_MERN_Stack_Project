import crypto from "crypto";

// Generates 6-digit TOTP from server secret, user email, and 30-second time-step
export const generateTOTP = (email, timeOffsetSteps = 0) => {
  const timeStep = 30; // 30-second time step
  const counter = Math.floor(Date.now() / 1000 / timeStep) + timeOffsetSteps;
  const serverSecret = process.env.SECRET_KEY || "job_portal_totp_default_secret";

  // Derives a unique HMAC key combining the server secret and normalized email
  const userKey = crypto
    .createHmac("sha256", serverSecret)
    .update(email.toLowerCase().trim())
    .digest();

  // Converts counter to 8-byte big-endian buffer and hashes with HMAC-SHA256
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter));
  const hmac = crypto.createHmac("sha256", userKey).update(buffer).digest();

  // Dynamic truncation (RFC 4226 / RFC 6238) to produce 6-digit code
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binaryCode =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return (binaryCode % 1000000).toString().padStart(6, "0");
};

// Verifies OTP with timing-safe comparison and small clock-skew tolerance window
export const verifyTOTP = (email, userOtp) => {
  if (!userOtp || typeof userOtp !== "string" || userOtp.trim().length !== 6) {
    return false;
  }
  const cleanOtp = userOtp.trim();

  // Checks current step (0) and previous step (-1) to tolerate clock skew and network delay
  for (const offset of [0, -1]) {
    const expectedOtp = generateTOTP(email, offset);
    const userBuffer = Buffer.from(cleanOtp);
    const expectedBuffer = Buffer.from(expectedOtp);

    if (
      userBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(userBuffer, expectedBuffer)
    ) {
      return true;
    }
  }
  return false;
};

// In-memory rate limiting store to prevent brute-force OTP attempts
const attemptStore = new Map();

// Checks if an email is temporarily locked out due to excessive failed attempts
export const checkRateLimit = (email) => {
  const key = email.toLowerCase().trim();
  const record = attemptStore.get(key);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockUntil && record.lockUntil > now) {
    const remainingSeconds = Math.ceil((record.lockUntil - now) / 1000);
    return {
      allowed: false,
      message: `Too many failed attempts. Please wait ${remainingSeconds}s before trying again.`,
    };
  }

  // Reset expired record
  if (record.lockUntil && record.lockUntil <= now) {
    attemptStore.delete(key);
  }
  return { allowed: true };
};

// Records a failed OTP attempt and locks account for 5 minutes after 5 failures
export const recordFailedAttempt = (email) => {
  const key = email.toLowerCase().trim();
  const now = Date.now();
  const record = attemptStore.get(key) || { attempts: 0 };

  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= 5) {
    record.lockUntil = now + 5 * 60 * 1000; // 5-minute lockout
  }
  attemptStore.set(key, record);
};

// Clears failed attempt count after successful verification or password reset
export const resetRateLimit = (email) => {
  attemptStore.delete(email.toLowerCase().trim());
};
