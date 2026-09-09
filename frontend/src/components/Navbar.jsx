import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "@api/authApi";
import { toast } from "react-toastify";
import {
  BookOpen,
  MessageSquare,
  Compass,
  TrendingUp,
  Search,
  PlusCircle,
  LogOut,
  User,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function Navbar({ onOpenNewThread, searchQuery = "", setSearchQuery = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn("Logout request failed:", e);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const isActive = (path) => {
    if (path === "/home" && (location.pathname === "/home" || location.pathname === "/")) {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b101b]/85 border-b border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between transition-all shadow-md shadow-black/20">
      {/* LEFT: LOGO & NAV */}
      <div className="flex items-center gap-6 lg:gap-8">
        <Link to="/home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
              Noveland
            </span>
            <span className="text-[10px] tracking-wider text-slate-400 font-medium uppercase -mt-1">
              Novel & Forum
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-300">
          <Link
            to="/home"
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              isActive("/home") && !location.pathname.startsWith("/forum")
                ? "bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30"
                : "hover:text-white hover:bg-slate-800/50 text-slate-400"
            }`}
          >
            <Compass className="w-4 h-4" /> Discover
          </Link>

          <Link
            to="/forum"
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              isActive("/forum")
                ? "bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/30"
                : "hover:text-white hover:bg-slate-800/50 text-slate-400"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Community Forum
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-1.5 py-0.2 rounded-full border border-indigo-500/30">
              Live
            </span>
          </Link>
        </nav>
      </div>

      {/* RIGHT: SEARCH, NEW THREAD & USER */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search */}
        <div className="relative hidden sm:block w-48 lg:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions & novels..."
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Start Discussion Button */}
        <button
          onClick={() => {
            if (onOpenNewThread) {
              onOpenNewThread();
            } else {
              navigate("/forum?action=new");
            }
          }}
          className="cursor-pointer px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 hover:scale-102"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Discussion</span>
          <span className="sm:hidden">Post</span>
        </button>

        {/* USER PROFILE OR AUTH BUTTONS */}
        {user ? (
          <div className="flex items-center gap-2.5 bg-slate-900/70 border border-slate-800 px-3 py-1 rounded-full">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
              {user.display_name ? user.display_name.charAt(0) : "U"}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold leading-none text-slate-200">
                {user.display_name || "Reader"}
              </span>
              <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 mt-0.5 font-medium">
                <CheckCircle2 className="w-2.5 h-2.5" /> Member
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-rose-400 transition-colors p-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-200 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
