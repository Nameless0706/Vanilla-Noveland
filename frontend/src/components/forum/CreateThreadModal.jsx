import React, { useState, useEffect } from "react";
import { getNovels, searchExternalBooks, importExternalBook } from "@/api/novelApi";
import { createForumThread } from "@/api/forumApi";
import { toast } from "react-toastify";
import {
  X,
  Sparkles,
  Send,
  BookOpen,
  Tag,
  Layers,
  Search,
  Globe,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function CreateThreadModal({ isOpen, onClose, onSuccess, initialNovelId = null }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [selectedNovel, setSelectedNovel] = useState(initialNovelId || "");
  const [tagInput, setTagInput] = useState("");
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Online Book Search State
  const [showOnlineSearch, setShowOnlineSearch] = useState(false);
  const [onlineQuery, setOnlineQuery] = useState("");
  const [searchSource, setSearchSource] = useState("all");
  const [onlineResults, setOnlineResults] = useState([]);
  const [searchingOnline, setSearchingOnline] = useState(false);
  const [importingId, setImportingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadNovels();
      if (initialNovelId) {
        setSelectedNovel(initialNovelId);
        setCategory("Novel Discussion");
      }
    }
  }, [isOpen, initialNovelId]);

  const loadNovels = async () => {
    try {
      const res = await getNovels();
      if (res.data) {
        setNovels(res.data);
      }
    } catch (e) {
      console.error("Failed to load novels for thread creator", e);
    }
  };

  const handleOnlineSearch = async (sourceToUse = searchSource) => {
    if (!onlineQuery.trim()) return;

    setSearchingOnline(true);
    try {
      const res = await searchExternalBooks(onlineQuery.trim(), sourceToUse);
      if (res.data) {
        setOnlineResults(res.data);
      }
    } catch (err) {
      toast.error("Failed to search books online");
    } finally {
      setSearchingOnline(false);
    }
  };

  const handleImportAndSelect = async (book) => {
    setImportingId(book.externalId);
    try {
      const res = await importExternalBook(book);
      if (res.data) {
        const imported = res.data;
        // Add to local novels list if not already there
        setNovels((prev) => {
          if (prev.some((n) => n._id === imported._id)) return prev;
          return [imported, ...prev];
        });
        setSelectedNovel(imported._id);
        setShowOnlineSearch(false);
        setCategory("Novel Discussion");
        toast.success(`Linked "${imported.title}" to discussion!`);
      }
    } catch (err) {
      toast.error("Failed to import novel");
    } finally {
      setImportingId(null);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.warn("Please sign in to start a forum discussion");
      navigate("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("Please provide both a title and discussion content");
      return;
    }

    setLoading(true);
    try {
      const tags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        content: content.trim(),
        category,
        novel: selectedNovel || null,
        tags,
      };

      const res = await createForumThread(payload);
      toast.success("Discussion post published!");
      setTitle("");
      setContent("");
      setTagInput("");
      onClose();
      if (onSuccess) {
        onSuccess(res.data);
      }
    } catch (err) {
      console.error("Failed to create thread", err);
      toast.error(err.message || "Failed to create thread. Please log in.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "General",
    "Novel Discussion",
    "Theories",
    "Reviews",
    "Chapter Discussion",
    "Recommendations",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Start a New Discussion
              </h2>
              <p className="text-xs text-slate-400">
                Share your ideas, theories, or questions with the community
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* TITLE */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Discussion Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 1400: Thoughts on Roland's celestial apotheosis?"
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* CATEGORY & NOVEL ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Link to Novel
                </label>
                <button
                  type="button"
                  onClick={() => setShowOnlineSearch(!showOnlineSearch)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Globe className="w-3 h-3" />
                  {showOnlineSearch ? "Select Existing" : "Search Online Novels"}
                </button>
              </div>

              {!showOnlineSearch ? (
                <select
                  value={selectedNovel}
                  onChange={(e) => setSelectedNovel(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="" className="bg-slate-900 text-slate-400">
                    None (General Community Topic)
                  </option>
                  {novels.map((n) => (
                    <option key={n._id} value={n._id} className="bg-slate-900 text-white">
                      {n.title}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-2">
                  {/* SOURCE PICKER */}
                  <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                    {[
                      { id: "all", label: "All Sources" },
                      { id: "ranobedb", label: "RanobeDB (Light Novels)" },
                      { id: "openlibrary", label: "Open Library" },
                    ].map((src) => (
                      <button
                        key={src.id}
                        type="button"
                        onClick={() => {
                          setSearchSource(src.id);
                          if (onlineQuery.trim()) {
                            handleOnlineSearch(src.id);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          searchSource === src.id
                            ? src.id === "ranobedb"
                              ? "bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-500/20"
                              : "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {src.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={onlineQuery}
                      onChange={(e) => setOnlineQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleOnlineSearch();
                        }
                      }}
                      placeholder="Search light novels & books (e.g. Mushoku Tensei, Overlord)..."
                      className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleOnlineSearch()}
                      disabled={searchingOnline}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {searchingOnline ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ONLINE SEARCH RESULTS DRAWER */}
          {showOnlineSearch && onlineResults.length > 0 && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 max-h-52 overflow-y-auto space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-400">
                  Matches found online (Click to link to discussion):
                </span>
                <span className="text-[10px] text-slate-500">
                  {onlineResults.length} results
                </span>
              </div>
              {onlineResults.map((book) => (
                <div
                  key={book.externalId}
                  onClick={() => handleImportAndSelect(book)}
                  className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 cursor-pointer transition-all group"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-9 h-12 object-cover rounded shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate max-w-[240px]">
                        {book.title}
                      </h4>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-semibold flex-shrink-0 ${
                          book.source === "RanobeDB"
                            ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                            : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        }`}
                      >
                        {book.source}
                      </span>
                      {book.chapters > 0 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                          {book.chapters} {book.source === "RanobeDB" ? "Vols" : "Chs"}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      By {book.author}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={importingId === book.externalId}
                    className="text-[10px] px-2.5 py-1 rounded bg-blue-600/30 text-blue-300 font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0"
                  >
                    {importingId === book.externalId ? "Linking..." : "Link"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAGS */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-400" /> Tags (Comma-separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. Spoilers, Magic Systems, Review, TierList"
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Content / Body <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, questions, or analysis here..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed resize-y"
            />
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Markdown formatting supported
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  "Posting..."
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Publish Discussion
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateThreadModal;
