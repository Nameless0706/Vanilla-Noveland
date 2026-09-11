import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  getForumThreadById,
  toggleUpvoteThread,
  getThreadComments,
  createThreadComment,
  toggleLikeComment,
} from "@/api/forumApi";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Eye,
  Share2,
  BookOpen,
  Send,
  Sparkles,
  Heart,
  Star,
  CornerDownRight,
} from "lucide-react";

function ThreadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchThreadData();
  }, [id]);

  const fetchThreadData = async () => {
    setLoading(true);
    try {
      const [threadRes, commentsRes] = await Promise.all([
        getForumThreadById(id),
        getThreadComments(id),
      ]);
      if (threadRes.data) setThread(threadRes.data);
      if (commentsRes.data) setComments(commentsRes.data);
    } catch (e) {
      console.error("Failed to load thread detail", e);
      toast.error("Failed to load thread");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.warn("Please sign in to upvote");
      return;
    }

    try {
      const res = await toggleUpvoteThread(id);
      if (res.data) {
        setThread((prev) => ({
          ...prev,
          hasUpvoted: res.data.hasUpvoted,
          upvoteCount: res.data.upvoteCount,
        }));
      }
    } catch (err) {
      toast.error(err.message || "Failed to upvote");
    }
  };

  const handleLikeComment = async (commentId) => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.warn("Please sign in to like comments");
      return;
    }

    try {
      const res = await toggleLikeComment(commentId);
      if (res.data) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  hasLiked: res.data.hasLiked,
                  likeCount: res.data.likeCount,
                }
              : c
          )
        );
      }
    } catch (err) {
      toast.error(err.message || "Failed to like comment");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    if (!user) {
      toast.warn("Please sign in to reply");
      navigate("/login");
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await createThreadComment(id, {
        content: newComment.trim(),
        parentComment: replyingTo ? replyingTo._id : null,
      });

      if (res.data) {
        setComments((prev) => [...prev, res.data]);
        setNewComment("");
        setReplyingTo(null);
        setThread((prev) => ({
          ...prev,
          replyCount: (prev.replyCount || 0) + 1,
        }));
        toast.success("Reply added!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info("Thread link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-6 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Thread Not Found</h2>
          <p className="text-xs text-slate-400">
            This discussion thread may have been moved or removed.
          </p>
          <Link
            to="/forum"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* BACK LINK */}
        <Link
          to="/forum"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6 font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Discussions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAIN THREAD & COMMENTS (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* THREAD CARD */}
            <article className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              {/* TOP TAGS & METADATA */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {thread.category}
                </span>

                {thread.novel && (
                  <Link
                    to={`/novel/${thread.novel._id}`}
                    className="bg-slate-800 border border-slate-700 hover:border-blue-500/40 text-slate-200 hover:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3 h-3 text-blue-400" />
                    {thread.novel.title}
                  </Link>
                )}

                {thread.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-800/60 text-slate-400 text-[11px] px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* TITLE */}
              <h1 className="text-xl sm:text-3xl font-black text-white leading-snug tracking-tight mb-4">
                {thread.title}
              </h1>

              {/* AUTHOR HEADER */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800 text-xs text-slate-400">
                <Link
                  to={thread.author?._id ? `/profile/${thread.author._id}` : "#"}
                  className="flex items-center gap-3 hover:opacity-85 transition-opacity"
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-md">
                    {thread.author?.avatar ? (
                      <img
                        src={thread.author.avatar}
                        alt={thread.author.display_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    ) : null}
                    <span className={thread.author?.avatar ? "hidden" : "block"}>
                      {thread.author?.display_name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm leading-none hover:text-blue-400 transition-colors">
                      {thread.author?.display_name || "Community Member"}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Posted on {new Date(thread.createdAt).toLocaleString()}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-3 text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {thread.views || 0} views
                  </span>
                </div>
              </div>

              {/* CONTENT BODY */}
              <div className="text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line mb-8">
                {thread.content}
              </div>

              {/* ACTION BAR */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUpvote}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      thread.hasUpvoted
                        ? "bg-blue-600/20 border-blue-500 text-blue-400"
                        : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${thread.hasUpvoted ? "fill-blue-400" : ""}`} />
                    <span>Upvote ({thread.upvoteCount || 0})</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="cursor-pointer px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>

                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  {comments.length} Comments
                </span>
              </div>
            </article>

            {/* COMMENTS SECTION */}
            <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" /> Discussion Replies ({comments.length})
              </h3>

              {/* REPLY FORM */}
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                {replyingTo && (
                  <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs text-indigo-300">
                    <span className="flex items-center gap-1.5">
                      <CornerDownRight className="w-3.5 h-3.5" /> Replying to{" "}
                      <strong>{replyingTo.author?.display_name || "User"}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="text-indigo-400 hover:text-white text-[11px] underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <div className="relative">
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Join the discussion... Share your perspective or reply to points raised."
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed resize-y"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="cursor-pointer px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? "Posting..." : "Post Reply"}
                  </button>
                </div>
              </form>

              {/* COMMENTS LIST */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                {comments.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-6">
                    No replies yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <Link
                          to={comment.author?._id ? `/profile/${comment.author._id}` : "#"}
                          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
                        >
                          <div className="w-7 h-7 rounded-lg overflow-hidden bg-indigo-600/80 flex items-center justify-center text-xs font-bold text-white uppercase">
                            {comment.author?.avatar ? (
                              <img
                                src={comment.author.avatar}
                                alt={comment.author.display_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "block";
                                }}
                              />
                            ) : null}
                            <span className={comment.author?.avatar ? "hidden" : "block"}>
                              {comment.author?.display_name?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-200 hover:text-blue-400 transition-colors">
                              {comment.author?.display_name || "Reader"}
                            </span>
                            <span className="text-[10px] text-slate-500 ml-2">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>

                        {/* LIKE & REPLY ACTIONS */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleLikeComment(comment._id)}
                            className={`flex items-center gap-1 text-xs cursor-pointer transition-colors ${
                              comment.hasLiked
                                ? "text-rose-400 font-semibold"
                                : "text-slate-400 hover:text-rose-400"
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${comment.hasLiked ? "fill-rose-400" : ""}`} />
                            <span>{comment.likeCount || 0}</span>
                          </button>

                          <button
                            onClick={() => {
                              setReplyingTo(comment);
                              window.scrollTo({ behavior: "smooth", top: 400 });
                            }}
                            className="text-xs text-slate-400 hover:text-blue-400 cursor-pointer font-medium"
                          >
                            Reply
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-9">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* SIDEBAR: NOVEL CONTEXT & STATS (col-span-4) */}
          <aside className="lg:col-span-4 space-y-6">
            {thread.novel && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-3 block">
                  Discussed Novel
                </span>

                <div className="flex gap-4 mb-4">
                  <img
                    src={thread.novel.cover}
                    alt={thread.novel.title}
                    className="w-20 h-28 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white leading-snug mb-1">
                      {thread.novel.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-2">
                      By {thread.novel.author}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{thread.novel.rating || 4.8} / 5.0</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {thread.novel.description}
                </p>

                <Link
                  to={`/novel/${thread.novel._id}`}
                  className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" /> View Novel Page
                </Link>
              </div>
            )}

            {/* COMMUNITY CARD */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Noveland Guidelines
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Keep the conversation insightful and friendly. When revealing major
                twists or chapter endings, remember to warn readers upfront!
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ThreadDetailPage;
