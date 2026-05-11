import "@/App.css";
import HomePage from "@/pages/HomePage";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthRoutes from "@/routes/authRoutes";
import "react-toastify/dist/ReactToastify.css";
import "@/config/axios";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/*" element={<AuthRoutes />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
