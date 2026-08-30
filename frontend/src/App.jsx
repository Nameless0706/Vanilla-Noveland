import "@/App.css";
import HomePage from "@/pages/HomePage";
import { Navigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthRoutes from "@/routes/authRoutes";
import "react-toastify/dist/ReactToastify.css";
import "@/config/axios";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/*" element={<AuthRoutes />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
