import multer from "multer"

const storage = multer.memoryStorage()
export const singleUpload = multer({storage}).single("file")
//now ye singleUpload wha wha apply kr do route me jha jha file chahiye, it is kind of middleware