import { Routes, Route } from "react-router-dom";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import ForgotPassword from "@pages/auth/ForgotPassword";
import VerifyOtp from "@pages/auth/VerifyOtp";
import ResetPassword from "@pages/auth/ResetPassword";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="verify" element={<VerifyOtp />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default AuthRoutes;
