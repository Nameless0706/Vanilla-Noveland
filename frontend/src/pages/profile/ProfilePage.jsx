import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  getProfile,
  updateProfile,
  changePassword,
  getMyThreads,
  getMyComments,
  getPublicProfile,
  getUserThreads,
} from "@/api/profileApi";
import { toast } from "react-toastify";
import {
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Mail,
  Edit3,
  Lock,
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Layers,
  Clock,
  ArrowLeft,
  Camera,
  Check,
  Flame,
} from "lucide-react";

const PRESET_AVATARS = [
  {
    id: "1",
    label: "Astral Scholar",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "2",
    label: "Shadow Hunter",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "3",
    label: "Celestial Mage",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "4",
    label: "Cosmic Knight",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "5",
    label: "Alchemist Prodigy",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "6",
    label: "Sword Saint",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "7",
    label: "Mystic Sage",
    url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "8",
    label: "Starlight Wanderer",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
  },
];

function ProfilePage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Logged-in user cached in localStorage
  const [currentUser, setCurrentUser] = useState(null);

  // Profile data being viewed
  const [profileUser, setProfileUser] = useState(null);
  const [stats, setStats] = useState({
    threadsCount: 0,
    commentsCount: 0,
    upvotesReceived: 0,
  });

  // Active tab: 'activity', 'edit', 'security'
  const activeTab = searchParams.get("tab") || "activity";
  const [activitySubTab, setActivitySubTab] = useState("threads"); // 'threads' | 'comments'

  // Activity list data
  const [userThreads, setUserThreads] = useState([]);
  const [userComments, setUserComments] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Edit form state
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [about, setAbout] = useState("");
  const [customAvatarInput, setCustomAvatarInput] = useState("");

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Determine if viewing own profile
  const isOwnProfile =
    !id ||
    (currentUser &&
      (currentUser._id === id || currentUser.id === id));

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        setCurrentUser(parsed);
      } catch (err) {
        console.error("Failed to parse local user", err);
      }
    }
  }, []);

  // Fetch profile and activity
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      if (isOwnProfile) {
        // Fetch private profile
        const res = await getProfile();
        if (res.success && res.data) {
          const user = res.data.user;
          setProfileUser(user);
          setStats(res.data.stats || {});
          setDisplayName(user.display_name || "");
          setAvatar(user.avatar || "");
          setCustomAvatarInput(user.avatar || "");
          setAbout(user.about || "");

          // Update local storage with fresh user details
          localStorage.setItem("user", JSON.stringify(user));
        }

        // Fetch my threads & comments
        const [threadsRes, commentsRes] = await Promise.allSettled([
          getMyThreads(),
          getMyComments(),
        ]);
        if (threadsRes.status === "fulfilled" && threadsRes.value?.success) {
          setUserThreads(threadsRes.value.data || []);
        }
        if (commentsRes.status === "fulfilled" && commentsRes.value?.success) {
          setUserComments(commentsRes.value.data || []);
        }
      } else {
        // Fetch public profile by id
        const res = await getPublicProfile(id);
        if (res.success && res.data) {
          setProfileUser(res.data.user);
          setStats(res.data.stats || {});
        }

        const threadsRes = await getUserThreads(id);
        if (threadsRes.success) {
          setUserThreads(threadsRes.data || []);
        }
      }
    } catch (error) {
      console.error("Failed to load profile", error);
      toast.error(error.message || "Failed to load profile details");
      if (isOwnProfile && error.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id, currentUser?._id]);

  // Handler for Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      return toast.error("Display name cannot be empty");
    }
    if (displayName.trim().length < 2 || displayName.trim().length > 30) {
      return toast.error("Display name must be between 2 and 30 characters");
    }

    setIsUpdating(true);
    try {
      const res = await updateProfile({
        display_name: displayName.trim(),
        avatar: avatar.trim() || null,
        about: about.trim(),
      });

      if (res.success) {
        toast.success("Profile updated successfully!");
        setProfileUser(res.data.user);
        setStats(res.data.stats);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Dispatch window event so Navbar updates instantly
        window.dispatchEvent(new Event("userProfileUpdated"));

        // Switch to overview/activity tab
        setSearchParams({ tab: "activity" });
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler for Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      return toast.error("Please enter your current password");
    }
    if (!newPassword || newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters long");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSearchParams({ tab: "activity" });
      }
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTabChange = (newTab) => {
    setSearchParams({ tab: newTab });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <Shield className="w-3 h-3 text-rose-400" /> Admin
          </span>
        );
      case "moderator":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <Shield className="w-3 h-3 text-indigo-400" /> Moderator
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Member
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading member profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            The profile you are looking for does not exist or may have been removed.
          </p>
          <Link
            to="/forum"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all"
          >
            Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-blue-600/30 selection:text-blue-200">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TOP NAVIGATION BREADCRUMB */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/forum"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Community
          </Link>

          {!isOwnProfile && (
            <span className="text-xs text-slate-400 font-medium">
              Public Profile View
            </span>
          )}
        </div>

        {/* HERO BANNER & PROFILE CARD */}
        <div className="relative rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-xl mb-8">
          {/* Decorative Cosmic Banner Header */}
          <div className="h-44 sm:h-52 bg-gradient-to-r from-blue-950 via-indigo-900/60 to-purple-950/70 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-4 right-6 flex items-center gap-2">
              {getRoleBadge(profileUser.role)}
              {profileUser.is_verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  <CheckCircle2 className="w-3 h-3 text-blue-400" /> Verified
                </span>
              )}
            </div>
          </div>

          {/* Profile Details Container */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              {/* Avatar & Identifiers */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
                {/* Avatar with Ring */}
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-400 shadow-xl shadow-blue-500/20">
                    {profileUser.avatar ? (
                      <img
                        src={profileUser.avatar}
                        alt={profileUser.display_name}
                        className="w-full h-full object-cover rounded-xl bg-slate-900"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-3xl font-black text-white uppercase ${
                        profileUser.avatar ? "hidden" : "flex"
                      }`}
                    >
                      {profileUser.display_name?.charAt(0) || "U"}
                    </div>
                  </div>

                  {/* Edit avatar trigger when own profile */}
                  {isOwnProfile && (
                    <button
                      onClick={() => handleTabChange("edit")}
                      title="Change Avatar"
                      className="cursor-pointer absolute bottom-2 right-2 p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Name, Email, Registration date */}
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                    {profileUser.display_name}
                  </h1>

                  {profileUser.email && isOwnProfile && (
                    <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1 font-mono">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {profileUser.email}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Joined {formatDate(profileUser.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Profile Owner */}
              {isOwnProfile && (
                <div className="flex items-center justify-center sm:justify-end gap-2.5">
                  <button
                    onClick={() => handleTabChange("edit")}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === "edit"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>

                  <button
                    onClick={() => handleTabChange("security")}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === "security"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700"
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" /> Security
                  </button>
                </div>
              )}
            </div>

            {/* BIO / ABOUT */}
            <div className="mt-4 pt-4 border-t border-slate-800/60">
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {profileUser.about?.trim() ? (
                  profileUser.about
                ) : (
                  <span className="text-slate-500 italic">
                    {isOwnProfile
                      ? "No bio yet. Click 'Edit Profile' to introduce yourself to fellow readers and authors!"
                      : "This reader has not written a bio yet."}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* METRIC STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/40 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between hover:border-blue-500/30 transition-all group">
            <div>
              <span className="text-xs font-medium text-slate-400">
                Discussions Created
              </span>
              <p className="text-2xl font-black text-white mt-1">
                {stats.threadsCount || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between hover:border-indigo-500/30 transition-all group">
            <div>
              <span className="text-xs font-medium text-slate-400">
                Comments Contributed
              </span>
              <p className="text-2xl font-black text-white mt-1">
                {stats.commentsCount || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between hover:border-emerald-500/30 transition-all group">
            <div>
              <span className="text-xs font-medium text-slate-400">
                Total Upvotes Earned
              </span>
              <p className="text-2xl font-black text-white mt-1">
                {stats.upvotesReceived || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <ThumbsUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 mb-6 pb-2">
          <button
            onClick={() => handleTabChange("activity")}
            className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === "activity"
                ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Layers className="w-4 h-4" /> Activity & Posts
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {stats.threadsCount || 0}
            </span>
          </button>

          {isOwnProfile && (
            <>
              <button
                onClick={() => handleTabChange("edit")}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "edit"
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>

              <button
                onClick={() => handleTabChange("security")}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "security"
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <Lock className="w-4 h-4" /> Account Security
              </button>
            </>
          )}
        </div>

        {/* TAB 1: ACTIVITY CONTENT */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            {/* Sub-tabs for threads and comments */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivitySubTab("threads")}
                className={`cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  activitySubTab === "threads"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Threads Started ({userThreads.length})
              </button>

              {isOwnProfile && (
                <button
                  onClick={() => setActivitySubTab("comments")}
                  className={`cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    activitySubTab === "comments"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Comments ({userComments.length})
                </button>
              )}
            </div>

            {/* THREADS LIST */}
            {activitySubTab === "threads" && (
              <div>
                {userThreads.length === 0 ? (
                  <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-10 text-center">
                    <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-white mb-1">
                      No forum discussions started yet
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                      {isOwnProfile
                        ? "Join the conversation! Start a discussion about your favorite novel, theory, or chapter."
                        : "This user has not started any discussions yet."}
                    </p>
                    {isOwnProfile && (
                      <Link
                        to="/forum?action=new"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/25"
                      >
                        Start First Discussion
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userThreads.map((thread) => (
                      <div
                        key={thread._id}
                        className="bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30">
                              {thread.category || "General"}
                            </span>
                            {thread.novel && (
                              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                <BookOpen className="w-3 h-3 text-indigo-400" />
                                {thread.novel.title}
                              </span>
                            )}
                            <span className="text-xs text-slate-500">
                              {formatDate(thread.createdAt)}
                            </span>
                          </div>

                          <Link
                            to={`/forum/thread/${thread._id}`}
                            className="text-base font-bold text-slate-100 hover:text-blue-400 transition-colors line-clamp-1 group-hover:translate-x-0.5 transform duration-150 inline-block"
                          >
                            {thread.title}
                          </Link>

                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                            {thread.content}
                          </p>

                          {thread.tags && thread.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {thread.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Thread Stats & Action */}
                        <div className="flex items-center gap-4 sm:border-l sm:border-slate-800/80 sm:pl-5 self-end sm:self-center">
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                              {thread.upvoteCount || thread.upvotes?.length || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
                              {thread.replyCount || 0}
                            </span>
                          </div>

                          <Link
                            to={`/forum/thread/${thread._id}`}
                            className="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-400 transition-all"
                            title="View Discussion"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COMMENTS LIST (Owner only) */}
            {activitySubTab === "comments" && isOwnProfile && (
              <div>
                {userComments.length === 0 ? (
                  <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-10 text-center">
                    <MessageCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-white mb-1">
                      No comments made yet
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                      Engage with other members' theories and chapter thoughts in the forum.
                    </p>
                    <Link
                      to="/forum"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all"
                    >
                      Browse Forum
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userComments.map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 sm:p-5"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="flex items-center gap-1">
                            Replied on:{" "}
                            <span className="text-slate-300 font-medium">
                              {comment.thread?.title || "Forum Discussion"}
                            </span>
                          </span>
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 leading-relaxed mb-3">
                          "{comment.content}"
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3 text-emerald-400" />
                            {comment.likeCount || 0} Likes
                          </span>

                          {comment.thread?._id && (
                            <Link
                              to={`/forum/thread/${comment.thread._id}`}
                              className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                            >
                              Go to Discussion <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EDIT PROFILE (Owner Only) */}
        {activeTab === "edit" && isOwnProfile && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-400" /> Edit Profile Information
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Customize how other readers and authors see you across the Noveland platform.
            </p>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={30}
                  required
                  placeholder="Your nickname or pen name"
                  className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Between 2 and 30 characters.
                </span>
              </div>

              {/* Bio / About */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Bio & Interests
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {about.length}/500
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  maxLength={500}
                  placeholder="Share what novels you enjoy reading, authors you follow, or topics you like discussing..."
                  className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all leading-relaxed resize-y"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Choose Avatar
                </label>

                {/* Preset Avatar Gallery */}
                <div className="mb-4">
                  <span className="text-xs text-slate-400 block mb-3">
                    Select from themed member portraits:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {PRESET_AVATARS.map((preset) => {
                      const isSelected = avatar === preset.url;
                      return (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => {
                            setAvatar(preset.url);
                            setCustomAvatarInput(preset.url);
                          }}
                          className={`cursor-pointer group relative rounded-xl p-0.5 transition-all overflow-hidden aspect-square ${
                            isSelected
                              ? "ring-2 ring-blue-500 scale-105"
                              : "hover:scale-105 border border-slate-800"
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center rounded-lg">
                              <Check className="w-4 h-4 text-white stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Avatar URL input */}
                <div>
                  <span className="text-xs text-slate-400 block mb-1.5">
                    Or provide a custom image URL:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customAvatarInput}
                      onChange={(e) => {
                        setCustomAvatarInput(e.target.value);
                        setAvatar(e.target.value);
                      }}
                      placeholder="https://example.com/my-avatar.jpg"
                      className="flex-1 bg-slate-950/70 border border-slate-700/70 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setAvatar("")}
                      className="cursor-pointer px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Live Avatar Preview */}
                <div className="mt-4 flex items-center gap-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white uppercase ${
                        avatar ? "hidden" : "flex"
                      }`}
                    >
                      {displayName?.charAt(0) || "U"}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Live Avatar Preview
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {avatar
                        ? "Using chosen image portrait"
                        : "Using default styled monogram initial"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleTabChange("activity")}
                  className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="cursor-pointer px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ACCOUNT SECURITY (Owner Only) */}
        {activeTab === "security" && isOwnProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" /> Change Password
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Ensure your account is secure with a strong and unique password.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="Enter your existing password"
                      className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      required
                      placeholder="At least 6 characters"
                      className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      required
                      placeholder="Repeat your new password"
                      className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <span className="text-[11px] text-rose-400 mt-1 block">
                      Passwords do not match.
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={isChangingPassword || !currentPassword || !newPassword}
                    className="cursor-pointer px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60 flex items-center gap-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Recommendations Card */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl h-fit space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Account Tips
              </h3>
              <ul className="text-xs text-slate-400 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  Use a minimum of 8 characters with a mix of letters, numbers, and symbols.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  Avoid using obvious passwords or reusing passwords from other websites.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  Never share your verification code or account credentials with anyone.
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
