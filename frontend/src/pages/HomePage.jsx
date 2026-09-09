import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CreateThreadModal from "@/components/forum/CreateThreadModal";
import { getNovels } from "@/api/novelApi";
import { getForumThreads, toggleUpvoteThread } from "@/api/forumApi";
import { toast } from "react-toastify";
import {
  BookOpen,
  Bookmark,
  TrendingUp,
  Star,
  User,
  Compass,
  Clock,
  Sparkles,
  Flame,
  Layers,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  PlusCircle,
  Eye,
} from "lucide-react";

function HomePage() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [novels, setNovels] = useState([]);
  const [forumThreads, setForumThreads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fallbackNovels = [
    {
      _id: "1",
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
      _id: "2",
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
      _id: "3",
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
      _id: "4",
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [novelRes, threadRes] = await Promise.allSettled([
        getNovels(),
        getForumThreads({ sort: "hot" }),
      ]);

      if (novelRes.status === "fulfilled" && novelRes.value?.data?.length > 0) {
        setNovels(novelRes.value.data);
      } else {
        setNovels(fallbackNovels);
      }

      if (threadRes.status === "fulfilled" && threadRes.value?.data) {
        setForumThreads(threadRes.value.data.slice(0, 4));
      }
    } catch (e) {
      console.error("Error loading home page data", e);
      setNovels(fallbackNovels);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (threadId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.warn("Please sign in to upvote");
      return;
    }

    try {
      const res = await toggleUpvoteThread(threadId);
      if (res.data) {
        setForumThreads((prev) =>
          prev.map((t) =>
            t._id === threadId
              ? {
                  ...t,
                  hasUpvoted: res.data.hasUpvoted,
                  upvoteCount: res.data.upvoteCount,
                }
              : t
          )
        );
      }
    } catch (err) {
      toast.error(err.message || "Failed to upvote");
    }
  };

  const filteredNovels =
    activeTab === "all"
      ? novels
      : novels.filter(
          (novel) => novel.category.toLowerCase() === activeTab.toLowerCase()
        );

  const displayNovels = filteredNovels.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* NAVBAR */}
      <Navbar
        onOpenNewThread={() => setIsModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-slate-800/80 p-6 sm:p-12 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Read, Review & Discuss Together
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-4">
              Where Novel Readers{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Unite & Discuss
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              Immerse yourself in translated web novels, share chapter theories,
              discover fresh recommendations, and engage in thoughtful discussions
              with an active community of fans.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/forum"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Enter Community Forum
              </Link>
              <a
                href="#featured"
                className="px-6 py-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Browse Novels
              </a>
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
              <p className="text-base sm:text-lg font-bold text-white">12,400+</p>
              <p className="text-[11px] text-slate-400">Novels Indexed</p>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-white">45,800+</p>
              <p className="text-[11px] text-slate-400">Forum Discussions</p>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-white">4.9 / 5</p>
              <p className="text-[11px] text-slate-400">Community Score</p>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-white">85K+</p>
              <p className="text-[11px] text-slate-400">Active Readers</p>
            </div>
          </div>
        </section>

        {/* FORUM HIGHLIGHTS: LATEST COMMUNITY DISCUSSIONS */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Flame className="w-6 h-6 text-amber-500" /> Hot Forum Discussions
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Join the hottest debates and theories happening right now
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-400" /> New Thread
              </button>
              <Link
                to="/forum"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1"
              >
                View Forum <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* FORUM CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forumThreads.map((thread) => (
              <div
                key={thread._id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 hover:bg-slate-850/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {thread.category}
                    </span>
                    {thread.novel && (
                      <span className="text-[11px] text-blue-400 font-semibold truncate max-w-[150px]">
                        {thread.novel.title}
                      </span>
                    )}
                  </div>

                  <Link to={`/forum/thread/${thread._id}`}>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
                      {thread.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {thread.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold uppercase">
                      {thread.author?.display_name?.charAt(0) || "U"}
                    </div>
                    <span className="text-slate-300 font-medium truncate max-w-[100px]">
                      {thread.author?.display_name || "Reader"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleUpvote(thread._id, e)}
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${
                        thread.hasUpvoted ? "text-blue-400 font-bold" : "hover:text-white"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${thread.hasUpvoted ? "fill-blue-400" : ""}`} />
                      <span>{thread.upvoteCount || 0}</span>
                    </button>
                    <Link
                      to={`/forum/thread/${thread._id}`}
                      className="flex items-center gap-1 text-slate-300 hover:text-blue-400 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{thread.replyCount || 0}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED NOVELS */}
        <section id="featured" className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-400" /> Featured Novels
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Explore novels with active discussions and high reader ratings
              </p>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-1 rounded-xl overflow-x-auto">
              {["all", "Fantasy", "Action", "Adventure", "Sci-Fi", "Cultivation", "Romance"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                      activeTab.toLowerCase() === tab.toLowerCase()
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          {/* NOVELS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayNovels.map((novel) => (
              <div
                key={novel._id}
                className="group bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col"
              >
                {/* COVER IMAGE */}
                <Link to={`/novel/${novel._id}`} className="relative h-48 overflow-hidden bg-slate-800 block">
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
                </Link>

                {/* CONTENT */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/novel/${novel._id}`}>
                      <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                        {novel.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-400 mb-2 font-medium">
                      By {novel.author}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {novel.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {novel.tags?.map((tag) => (
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
                    <Link
                      to={`/novel/${novel._id}`}
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Discuss & Read <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* CREATE THREAD MODAL */}
      <CreateThreadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newThread) => {
          setForumThreads((prev) => [newThread, ...prev]);
        }}
      />

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 px-6 text-center text-xs text-slate-500">
        <p className="mb-2">
          © 2026 Noveland. The Web Novel & Discussion Community Platform.
        </p>
        <div className="flex justify-center gap-4 text-slate-400">
          <Link to="/home" className="hover:underline">
            Home
          </Link>
          <Link to="/forum" className="hover:underline">
            Forum
          </Link>
          <a href="#" className="hover:underline">
            Guidelines
          </a>
          <a href="#" className="hover:underline">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
