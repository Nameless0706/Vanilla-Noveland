import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "@api/authApi";
import { toast } from "react-toastify";
import {
  BookOpen,
  Bookmark,
  TrendingUp,
  Search,
  Star,
  LogOut,
  User,
  Compass,
  Clock,
  CheckCircle2,
  Sparkles,
  Flame,
  Layers,
  ChevronRight,
} from "lucide-react";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
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
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const sampleNovels = [
    {
      id: 1,
      title: "Lord of the Cosmic Stars",
      author: "Cuttlefish",
      rating: 4.9,
      chapters: 1432,
      category: "Fantasy",
      tags: ["Mystery", "Cultivation", "Sci-Fi"],
      cover:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
      description:
        "In the depths of space, celestial power stirs. Follow Roland as he ascends the cosmic pathway.",
      views: "1.2M",
    },
    {
      id: 2,
      title: "Shadow Monarch: Genesis",
      author: "Chugong",
      rating: 4.8,
      chapters: 270,
      category: "Action",
      tags: ["Dungeon", "System", "Monsters"],
      cover:
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
      description:
        "When the gates opened, only one hunter awakened the sovereign authority of shadows.",
      views: "2.5M",
    },
    {
      id: 3,
      title: "The Alchemist's Odyssey",
      author: "Mingtian",
      rating: 4.7,
      chapters: 620,
      category: "Adventure",
      tags: ["Alchemy", "Magic", "Reincarnation"],
      cover:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
      description:
        "Reborn in a realm of forbidden magic, an alchemy prodigy crafts his own legendary destiny.",
      views: "890K",
    },
    {
      id: 4,
      title: "Chronicles of the Astral Sea",
      author: "Starlight",
      rating: 4.9,
      chapters: 890,
      category: "Sci-Fi",
      tags: ["Space Opera", "Mecha", "Strategy"],
      cover:
        "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80",
      description:
        "Fleet command battles against ancient cosmic entities across uncharted galaxies.",
      views: "640K",
    },
  ];

  const filteredNovels =
    activeTab === "all"
      ? sampleNovels
      : sampleNovels.filter(
          (novel) => novel.category.toLowerCase() === activeTab.toLowerCase(),
        );

  const displayNovels = filteredNovels.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/home" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
              Noveland
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link
              to="/home"
              className="text-blue-400 font-semibold flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" /> Discover
            </Link>
            <a
              href="#featured"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4" /> Trending
            </a>
            <a
              href="#library"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-4 h-4" /> Library
            </a>
            <a
              href="#genres"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" /> Genres
            </a>
          </nav>
        </div>

        {/* SEARCH & USER */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search novels, authors..."
              className="w-full bg-slate-800/70 border border-slate-700/60 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {user ? (
            <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-full">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                {user.display_name ? user.display_name.charAt(0) : "U"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold leading-none text-slate-200">
                  {user.display_name || "Reader"}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="ml-1 text-slate-400 hover:text-red-400 transition-colors p-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-200 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/30 border border-slate-800/80 p-8 md:p-12 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Infinite Stories Await
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Noveland
              </span>
              {user?.display_name ? `, ${user.display_name}` : ""}!
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
              Immerse yourself in thousands of web novels, light novels, and fan
              translations. Bookmark your progress, track updates, and read
              distraction-free.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#featured"
                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4" /> Start Reading
              </a>
              <button
                onClick={() => toast.info("Library bookmark sync is active!")}
                className="px-6 py-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4" /> My Bookmarks
              </button>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">12,400+</p>
              <p className="text-xs text-slate-400">Translated Novels</p>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Daily</p>
              <p className="text-xs text-slate-400">Chapter Releases</p>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">4.8 / 5</p>
              <p className="text-xs text-slate-400">Reader Rating</p>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">85K+</p>
              <p className="text-xs text-slate-400">Active Readers</p>
            </div>
          </div>
        </section>

        {/* GENRE / CATEGORY TABS */}
        <section id="featured" className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Flame className="w-6 h-6 text-amber-500" /> Featured & Trending
                Novels
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Handpicked popular stories trending across the community
              </p>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-1 rounded-xl overflow-x-auto">
              {["all", "Fantasy", "Action", "Adventure", "Sci-Fi"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                      activeTab.toLowerCase() === tab.toLowerCase()
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* NOVELS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayNovels.map((novel) => (
              <div
                key={novel.id}
                className="group bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col"
              >
                {/* COVER IMAGE */}
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  <img
                    src={novel.cover}
                    alt={novel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-md text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{" "}
                    {novel.rating}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-blue-600/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {novel.category}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                      {novel.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-2.5 font-medium">
                      By {novel.author}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {novel.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {novel.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-md font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>{novel.chapters} Chapters</span>
                    <button
                      onClick={() =>
                        toast.success(`Started reading ${novel.title}`)
                      }
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Read <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 px-6 text-center text-xs text-slate-500">
        <p className="mb-2">
          © 2026 Noveland. Built with Vite, React & Express.
        </p>
        <div className="flex justify-center gap-4 text-slate-400">
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Discord Community
          </a>
          <a href="#" className="hover:underline">
            Contact Support
          </a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
