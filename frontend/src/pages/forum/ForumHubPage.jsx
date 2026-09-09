import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CreateThreadModal from "@/components/forum/CreateThreadModal";
import { getForumThreads, toggleUpvoteThread } from "@/api/forumApi";
import { getNovels } from "@/api/novelApi";
import { toast } from "react-toastify";
import {
  MessageSquare,
  Flame,
  Clock,
  ThumbsUp,
  Pin,
  Tag,
  BookOpen,
  Filter,
  Eye,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

function ForumHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialNovel = searchParams.get("novelId") || "";

  const [threads, setThreads] = useState([]);
  const [novels, setNovels] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSort, setActiveSort] = useState("hot");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNovelId, setSelectedNovelId] = useState(initialNovel);
  const [isModalOpen, setIsModalOpen] = useState(
    searchParams.get("action") === "new"
  );
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", label: "All Topics" },
    { id: "Theories", label: "Theories & Lore" },
    { id: "Novel Discussion", label: "Novel Talk" },
    { id: "Chapter Discussion", label: "Chapter Spoilers" },
    { id: "Reviews", label: "Reviews & Ratings" },
    { id: "Recommendations", label: "Recommendations" },
    { id: "General", label: "General" },
  ];

  useEffect(() => {
    fetchThreads();
    fetchNovelsList();
  }, [activeCategory, activeSort, selectedNovelId]);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const params = {
        category: activeCategory !== "all" ? activeCategory : undefined,
        sort: activeSort,
        novelId: selectedNovelId || undefined,
        search: searchQuery || undefined,
      };
      const res = await getForumThreads(params);
      if (res.data) {
        setThreads(res.data);
      }
    } catch (e) {
      console.error("Failed to load threads", e);
      toast.error("Could not load discussions");
    } finally {
      setLoading(false);
    }
  };

  const fetchNovelsList = async () => {
    try {
      const res = await getNovels();
      if (res.data) {
        setNovels(res.data);
      }
    } catch (e) {
      console.error("Failed to load novels", e);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchThreads();
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
        setThreads((prev) =>
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
      toast.error(err.message || "Upvote failed");
    }
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case "Theories":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case "Chapter Discussion":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "Novel Discussion":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "Reviews":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "Recommendations":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      default:
        return "bg-slate-500/15 text-slate-300 border-slate-600/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* NAVBAR */}
      <Navbar
        onOpenNewThread={() => setIsModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* FORUM BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-slate-800/90 p-6 sm:p-10 mb-8 shadow-xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
                <MessageSquare className="w-3.5 h-3.5" /> Community Discussion Hub
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                Noveland Community Forum
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Debate plot twists, review translations, craft theories, and meet
                readers from around the globe.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer self-start md:self-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 hover:scale-102"
            >
              <PlusCircle className="w-4 h-4" /> Start Discussion
            </button>
          </div>
        </section>

        {/* FORUM LAYOUT: MAIN FEED + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: THREADS FEED (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* CATEGORIES HORIZONTAL BAR */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory.toLowerCase() === cat.id.toLowerCase()
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold"
                      : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* SORT & NOVEL FILTER CONTROLS */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
              {/* SORT BUTTONS */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveSort("hot")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeSort === "hot"
                      ? "bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" /> Hot
                </button>
                <button
                  onClick={() => setActiveSort("new")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeSort === "new"
                      ? "bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" /> Newest
                </button>
                <button
                  onClick={() => setActiveSort("top")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeSort === "top"
                      ? "bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Top
                </button>
              </div>

              {/* NOVEL SELECTOR FILTER */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:inline">Novel:</span>
                <select
                  value={selectedNovelId}
                  onChange={(e) => setSelectedNovelId(e.target.value)}
                  className="bg-slate-850 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer max-w-[200px] truncate"
                >
                  <option value="">All Novels</option>
                  {novels.map((n) => (
                    <option key={n._id} value={n._id}>
                      {n.title}
                    </option>
                  ))}
                </select>
                {selectedNovelId && (
                  <button
                    onClick={() => setSelectedNovelId("")}
                    className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* THREADS LIST */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400">Loading discussions...</p>
              </div>
            ) : threads.length === 0 ? (
              <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">No discussions found</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Be the first reader to start a thread in this category or novel!
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Start Discussion
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {threads.map((thread) => (
                  <div
                    key={thread._id}
                    className={`group bg-slate-900/70 border rounded-2xl p-4 sm:p-5 transition-all hover:border-slate-700 hover:bg-slate-850/80 ${
                      thread.isPinned
                        ? "border-blue-500/40 bg-gradient-to-r from-blue-950/20 to-slate-900/70"
                        : "border-slate-800/80"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* UPVOTE COLUMN */}
                      <button
                        onClick={(e) => handleUpvote(thread._id, e)}
                        className={`flex flex-col items-center justify-center min-w-[44px] sm:min-w-[48px] py-2 rounded-xl border transition-all cursor-pointer ${
                          thread.hasUpvoted
                            ? "bg-blue-600/20 border-blue-500 text-blue-400 font-bold"
                            : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-white"
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${thread.hasUpvoted ? "fill-blue-400" : ""}`} />
                        <span className="text-xs mt-1 font-semibold">
                          {thread.upvoteCount || 0}
                        </span>
                      </button>

                      {/* MAIN THREAD DETAILS */}
                      <div className="flex-1 min-w-0">
                        {/* TAGS & BADGES */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {thread.isPinned && (
                            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Pin className="w-2.5 h-2.5" /> PINNED
                            </span>
                          )}

                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                              thread.category
                            )}`}
                          >
                            {thread.category}
                          </span>

                          {thread.novel && (
                            <Link
                              to={`/novel/${thread.novel._id}`}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 hover:text-blue-300 hover:border-blue-500/30 border border-slate-700/60 flex items-center gap-1 transition-colors"
                            >
                              <BookOpen className="w-2.5 h-2.5 text-blue-400" />
                              <span className="truncate max-w-[130px]">
                                {thread.novel.title}
                              </span>
                            </Link>
                          )}
                        </div>

                        {/* TITLE */}
                        <Link to={`/forum/thread/${thread._id}`} className="block group-hover:text-blue-400 transition-colors">
                          <h3 className="text-base font-bold text-white leading-snug mb-1.5">
                            {thread.title}
                          </h3>
                        </Link>

                        {/* SNIPPET */}
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                          {thread.content}
                        </p>

                        {/* FOOTER META */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-800/60">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold uppercase">
                              {thread.author?.display_name?.charAt(0) || "U"}
                            </div>
                            <span className="text-slate-300 font-medium">
                              {thread.author?.display_name || "Reader"}
                            </span>
                            <span>•</span>
                            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div className="flex items-center gap-4 text-slate-400">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {thread.views || 0}
                            </span>
                            <Link
                              to={`/forum/thread/${thread._id}`}
                              className="flex items-center gap-1 text-slate-300 hover:text-blue-400 font-medium transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                              {thread.replyCount || 0} replies
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR (col-span-4) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* CTA CARD */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-900/30 via-slate-900 to-blue-900/20 border border-indigo-500/20 p-5 shadow-lg">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Have a Novel Theory?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Share your speculations about upcoming chapter drops, character
                developments, and power scaling.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full cursor-pointer py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Create Discussion
              </button>
            </div>

            {/* POPULAR NOVELS BEING DISCUSSED */}
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-amber-400" /> Discussed Novels
              </h3>
              <div className="space-y-3">
                {novels.slice(0, 4).map((novel) => (
                  <Link
                    key={novel._id}
                    to={`/novel/${novel._id}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition-colors group"
                  >
                    <img
                      src={novel.cover}
                      alt={novel.title}
                      className="w-10 h-14 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                        {novel.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">{novel.author}</p>
                      <span className="text-[10px] text-blue-400 font-medium">
                        {novel.category} • {novel.chapters} Chs
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* FORUM RULES & CODE */}
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 text-xs text-slate-400 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Forum Etiquette
              </h3>
              <ul className="space-y-2 list-disc list-inside text-slate-300">
                <li>Always mark spoilers for raw/unreleased chapters.</li>
                <li>Be respectful of different translation groups.</li>
                <li>Tag discussions with the corresponding novel.</li>
                <li>No hate speech or harassment.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* CREATE THREAD MODAL */}
      <CreateThreadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newThread) => {
          setThreads((prev) => [newThread, ...prev]);
        }}
      />
    </div>
  );
}

export default ForumHubPage;
