import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CreateThreadModal from "@/components/forum/CreateThreadModal";
import { getNovelById } from "@/api/novelApi";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  BookOpen,
  Star,
  Clock,
  Eye,
  MessageSquare,
  PlusCircle,
  Sparkles,
  Layers,
  ChevronRight,
  Flame,
  ThumbsUp,
} from "lucide-react";

function NovelDetailPage() {
  const { id } = useParams();
  const [novel, setNovel] = useState(null);
  const [activeTab, setActiveTab] = useState("discussions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNovel();
  }, [id]);

  const fetchNovel = async () => {
    setLoading(true);
    try {
      const res = await getNovelById(id);
      if (res.data) {
        setNovel(res.data);
      }
    } catch (e) {
      console.error("Failed to load novel", e);
      toast.error("Failed to load novel details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading novel profile...</p>
        </div>
      </div>
    );
  }

  if (!novel) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-6 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Novel Not Found</h2>
          <p className="text-xs text-slate-400">
            The novel you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/home"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar onOpenNewThread={() => setIsModalOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* BACK LINK */}
        <Link
          to="/home"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6 font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Discover
        </Link>

        {/* NOVEL HERO BANNER */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
            {/* COVER */}
            <div className="w-full sm:w-48 sm:h-64 h-60 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 flex-shrink-0 bg-slate-800">
              <img
                src={novel.cover}
                alt={novel.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* DETAILS */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {novel.category}
                </span>
                <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {novel.status || "Ongoing"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                {novel.title}
              </h1>
              <p className="text-sm font-semibold text-slate-300 mb-4">
                Written by <span className="text-blue-400">{novel.author}</span>
              </p>

              {/* STATS */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 mb-5 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{novel.rating || 4.8} / 5.0</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-200 font-semibold">
                    {novel.chapters || 0}
                  </span>{" "}
                  Chapters
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span>{novel.views || "10K"} Views</span>
                </div>
              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {novel.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs px-2.5 py-0.5 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Discuss this Novel
                </button>
                <Link
                  to={`/forum?novelId=${novel._id}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-indigo-400" /> View All Discussions
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TABS */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab("discussions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "discussions"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Forum Discussions (
            {novel.discussions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("synopsis")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "synopsis"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Synopsis & Info
          </button>
        </div>

        {/* TAB CONTENT: FORUM DISCUSSIONS */}
        {activeTab === "discussions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" /> Community Threads about{" "}
                {novel.title}
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Start New Thread
              </button>
            </div>

            {(!novel.discussions || novel.discussions.length === 0) ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">No discussions yet</h4>
                <p className="text-xs text-slate-400">
                  Be the first reader to write a review or discussion thread for this
                  novel!
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Start Discussion
                </button>
              </div>
            ) : (
              novel.discussions.map((thread) => (
                <Link
                  key={thread._id}
                  to={`/forum/thread/${thread._id}`}
                  className="block group bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-850 p-5 rounded-2xl transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {thread.category}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(thread.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-1.5">
                        {thread.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {thread.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5 text-blue-400" />
                        <span>{thread.upvoteCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{thread.replyCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* TAB CONTENT: SYNOPSIS */}
        {activeTab === "synopsis" && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-3">Synopsis</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {novel.description}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Author</span>
                <span className="text-white font-bold">{novel.author}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Status</span>
                <span className="text-emerald-400 font-bold">
                  {novel.status || "Ongoing"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Chapters</span>
                <span className="text-white font-bold">{novel.chapters}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Primary Category</span>
                <span className="text-blue-400 font-bold">{novel.category}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CREATE THREAD MODAL PRE-LINKED TO THIS NOVEL */}
      <CreateThreadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialNovelId={novel._id}
        onSuccess={(newThread) => {
          setNovel((prev) => ({
            ...prev,
            discussions: [newThread, ...(prev.discussions || [])],
          }));
        }}
      />
    </div>
  );
}

export default NovelDetailPage;
