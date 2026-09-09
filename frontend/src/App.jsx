import "@/App.css";
import HomePage from "@/pages/HomePage";
import ForumHubPage from "@/pages/forum/ForumHubPage";
import ThreadDetailPage from "@/pages/forum/ThreadDetailPage";
import NovelDetailPage from "@/pages/novels/NovelDetailPage";
import { Navigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthRoutes from "@/routes/AuthRoutes";
import "react-toastify/dist/ReactToastify.css";
import "@/config/axios";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forum" element={<ForumHubPage />} />
        <Route path="/forum/thread/:id" element={<ThreadDetailPage />} />
        <Route path="/novel/:id" element={<NovelDetailPage />} />
        <Route path="/*" element={<AuthRoutes />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        hideProgressBar={false}
      />
    </>
  );
}

export default App;
