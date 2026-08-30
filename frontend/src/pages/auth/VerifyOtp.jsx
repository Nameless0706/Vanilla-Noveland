import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "@api/authApi.js";
import { toast } from "react-toastify";
import OtpInput from "@components/common/OtpInput.jsx";

function VerifyOtp() {
  const [otpState, setOtpState] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  // Only user from register can access this verify link
  // useEffect(() => {
  //   if (!location.state?.from) {
  //     navigate("/login");
  //   }
  // });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await verifyOtp(email, otpState);
      console.log(data);
      if (data) {
        toast.success("You have been verified, directing to home");
      }
    } catch (error) {
      console.error(error);
      toast.error("Verify failed, please check your otp again");
    }
  };

  const isOtpValid = otpState.length === 6;

  return (
    <div className="flex justify-center items-center bg-[url('/src/assets/astronaut-nord.png')] bg-cover min-h-screen text-white font-light overflow-hidden">
      <div className="w-[450px] -mt-4 backdrop-blur-[5px] rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.2)] px-10 py-5">
        <h1 className="font-medium text-center text-4xl mb-4">Verify OTP</h1>
        <p className="font-medium text-center text-[1.1rem]">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit}>
          <div className="h-20 mt-5">
            <OtpInput length={6} onChange={setOtpState} />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isOtpValid}
              className={`w-full mt-2 font-medium rounded-4xl p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.2)]
                        ${
                          isOtpValid
                            ? "bg-[#262c3c] hover:shadow-[0_0_10px_rgba(0,0,0,0.4)] cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed opacity-70"
                        }`}
            >
              Register
            </button>
          </div>

          <div className="flex justify-center mt-4 text-sm">
            <p>
              <Link to="/login" className="hover:underline font-semibold">
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

