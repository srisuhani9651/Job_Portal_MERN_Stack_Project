import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import {
  LogOut,
  User2,
  Menu,
  X,
  Briefcase,
  Home as HomeIcon,
  Compass,
  Sparkles,
  ChevronRight,
  Shield,
  GraduationCap,
  Building2,
} from "lucide-react";
import { USER_API } from "@/utils/constant";
import { setUser } from "@/Redux/authSlice";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API}/logout`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message || "Logged out successfully");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Failed to log out");
    }
  };

  const isRecruiter = user && (user?.role === "Recruiter" || user?.role?.toLowerCase() === "recruiter");

  const studentLinks = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Browse", path: "/browse", icon: Compass },
  ];

  const recruiterLinks = [
    { name: "Companies", path: "/admin/companies", icon: Building2 },
    { name: "Jobs", path: "/admin/jobs", icon: Briefcase },
  ];

  const navLinks = isRecruiter ? recruiterLinks : studentLinks;

  const userName = user?.fullName || user?.fullname || "";

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "U";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-purple-100/60 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <Link to={isRecruiter ? "/admin/companies" : "/"} className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6A38C2] via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-all duration-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
              Job<span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">Sphere</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive =
                  link.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.path);
                const IconComponent = link.icon;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        isActive
                          ? "bg-purple-50/90 text-[#6A38C2] font-semibold border border-purple-100 shadow-xs"
                          : "text-gray-600 hover:text-[#6A38C2] hover:bg-purple-50/50"
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? "text-[#6A38C2]" : "text-gray-400"}`} />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="h-6 w-[1px] bg-gray-200/80 mx-1" />

            {/* User Auth Buttons or Popover */}
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50/60 hover:text-[#6A38C2] rounded-full px-5 py-2 text-sm font-semibold transition-all cursor-pointer"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-[#6A38C2] via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 rounded-full px-6 py-2 text-sm transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="cursor-pointer ring-2 ring-purple-500/30 hover:ring-purple-500/70 p-0.5 rounded-full transition-all focus:outline-none">
                    <Avatar className="h-10 w-10 border border-white">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={userName || "User Avatar"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-100 to-indigo-100 text-[#6A38C2] font-bold">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 rounded-2xl shadow-xl border border-purple-100/70 bg-white overflow-hidden" align="end">
                  {/* User Profile Card Header */}
                  <div className="p-4 bg-gradient-to-br from-purple-50/80 via-white to-purple-50/30 border-b border-purple-100/60">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt={userName || "User"}
                        />
                        <AvatarFallback className="bg-purple-100 text-[#6A38C2] font-bold text-lg">
                          {getInitials(userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-gray-900 truncate text-base">
                            {userName || "User Name"}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user?.email || "No email provided"}
                        </p>
                        {user?.role && (
                          <Badge variant="secondary" className="mt-2 text-[11px] px-2.5 py-0.5 bg-purple-100/80 text-[#6A38C2] font-medium border-purple-200/60 flex items-center gap-1 w-fit">
                            {user.role === "Recruiter" ? <Shield className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                            <span>{user.role}</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="p-2 space-y-1">
                    {!isRecruiter && (
                      <Link
                        to="/profile"
                        className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50/80 hover:text-[#6A38C2] rounded-xl transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-purple-100/60 text-[#6A38C2]">
                            <User2 className="w-4 h-4" />
                          </div>
                          <span>View Profile</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#6A38C2] transition-colors" />
                      </Link>
                    )}

                    <button
                      onClick={logoutHandler}
                      className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer w-full text-left group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-red-100/60 text-red-600">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span>Logout</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-red-300 group-hover:text-red-600 transition-colors" />
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              !isRecruiter ? (
                <Link to="/profile" className="mr-1">
                  <Avatar className="h-8 w-8 border border-purple-200">
                    <AvatarImage src={user?.profile?.profilePhoto} alt={userName} />
                    <AvatarFallback className="bg-purple-100 text-[#6A38C2] text-xs font-bold">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <div className="mr-1">
                  <Avatar className="h-8 w-8 border border-purple-200">
                    <AvatarImage src={user?.profile?.profilePhoto} alt={userName} />
                    <AvatarFallback className="bg-purple-100 text-[#6A38C2] text-xs font-bold">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-[#6A38C2] hover:bg-purple-50/80 rounded-xl"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-purple-100 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <ul className="flex flex-col space-y-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.path);
              const IconComponent = link.icon;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-purple-50 text-[#6A38C2] font-semibold border border-purple-100/60"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2]"
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isActive ? "text-[#6A38C2]" : "text-gray-400"}`} />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="pt-3 border-t border-purple-100/60">
            {!user ? (
              <div className="flex flex-col gap-2.5 pt-1">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center text-gray-700 border-gray-200 rounded-xl py-5 font-semibold">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full justify-center bg-gradient-to-r from-[#6A38C2] via-purple-600 to-indigo-600 text-white rounded-xl py-5 font-semibold shadow-md shadow-purple-500/20">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-gradient-to-br from-purple-50 to-indigo-50/40 rounded-xl border border-purple-100/60">
                  <Avatar className="h-10 w-10 border border-white">
                    <AvatarImage src={user?.profile?.profilePhoto} alt={userName} />
                    <AvatarFallback className="bg-purple-100 text-[#6A38C2] font-bold">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-sm text-gray-900 truncate">
                      {userName || "User"}
                    </h5>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || (user?.role ? `Role: ${user?.role}` : "")}
                    </p>
                  </div>
                  {user?.role && (
                    <Badge variant="secondary" className="text-[10px] bg-purple-100 text-[#6A38C2] border-purple-200">
                      {user.role}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  {!isRecruiter && (
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-xl transition-colors"
                    >
                      <User2 className="w-4 h-4 text-[#6A38C2]" />
                      <span>View Profile</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logoutHandler();
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

