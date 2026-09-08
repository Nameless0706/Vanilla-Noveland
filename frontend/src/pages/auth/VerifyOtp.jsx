import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, sendVerifyOtp } from "@api/authApi.js";
import { toast } from "react-toastify";
import OtpInput from "@components/common/OtpInput.jsx";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(!location.state?.email);
  const [otpState, setOtpState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (otpState.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }

    setIsLoading(true);
    try {
      const data = await verifyOtp(email.trim(), otpState);
      console.log("Verify response:", data);
      if (data) {
        toast.success(
          data.message || "Email verified successfully! Redirecting to home...",
        );

        if (data.data?.userData) {
          localStorage.setItem("user", JSON.stringify(data.data.userData));
        }

        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.message ||
          "Verification failed. Please check your OTP and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address first");
      return;
    }

    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      const res = await sendVerifyOtp(email.trim());
      toast.success(
        res.message || "A new verification code has been sent to your email!",
      );
      setResendCooldown(60);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  const isOtpValid = otpState.length === 6 && Boolean(email.trim());

  return (
    <div className="flex justify-center items-center bg-[url('@assets/astronaut-nord.png')] bg-cover min-h-screen text-white font-light overflow-hidden">
      <div className="w-[450px] -mt-4 backdrop-blur-[10px] rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.2)] px-10 py-6">
        <h1 className="font-medium text-center text-3xl mb-2">Verify OTP</h1>
        <p className="text-center text-sm text-gray-300 mb-4">
          Enter the 6-digit code sent to
        </p>

        {/* Email badge / input */}
        <div className="mb-4 text-center">
          {isEditingEmail ? (
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full bg-black/30 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setIsEditingEmail(false)}
                className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-xl"
              >
                Set
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm font-medium">
              <span>{email || "No email specified"}</span>
              <button
                type="button"
                onClick={() => setIsEditingEmail(true)}
                className="text-xs text-blue-400 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="h-20 mt-3 flex justify-center">
            <OtpInput length={6} onChange={setOtpState} />
          </div>

          <div className="flex justify-center mt-2">
            <button
              type="submit"
              disabled={!isOtpValid || isLoading}
              className={`w-full font-medium rounded-4xl p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.2)]
                        ${
                          isOtpValid && !isLoading
                            ? "bg-[#262c3c] hover:shadow-[0_0_10px_rgba(0,0,0,0.4)] cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed opacity-70"
                        }`}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </button>
          </div>

          {/* Resend OTP Section */}
          <div className="text-center mt-4 text-sm text-gray-300">
            {resendCooldown > 0 ? (
              <p>
                Resend code in{" "}
                <span className="font-semibold text-blue-400">
                  {resendCooldown}s
                </span>
              </p>
            ) : (
              <p>
                Didn't receive code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-blue-400 hover:underline font-semibold cursor-pointer"
                >
                  {isResending ? "Sending..." : "Resend OTP"}
                </button>
              </p>
            )}
          </div>

          <div className="flex justify-center mt-4 text-sm">
            <p>
              <Link
                to="/login"
                className="hover:underline font-semibold text-gray-300"
              >
                Back to login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
