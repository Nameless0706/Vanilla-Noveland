import React, { useEffect, useState } from "react";

import InputFieldset from "@components/common/InputField.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "@api/authApi.js";
import { toast } from "react-toastify";

function VerifyOtp() {
  const [otpState, setOtpState] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const inputRef = React.useRef([]);

  // Only user from register can access this verify link

  // useEffect(() => {
  //   if (!location.state?.from) {
  //     navigate("/login");
  //   }
  // });

  const handleInput = (e, index) => {
    let value = e.target.value;

    // remove non-digit characters
    value = value.replace(/\D/g, "");

    // keep only 1 character
    value = value.slice(0, 1);

    // force update input value
    e.target.value = value;

    // update state to trigger re-render
    const otp = inputRef.current.map((input) => input?.value || "").join("");
    setOtpState(otp);

    if (value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join("");
      const data = await verifyOtp(email, otp);
      console.log(data);
      if (data) {
        toast.success("You have been verified, directing to home");
      }
    } catch (error) {
      console.error(error);
      toast.error("Verify failed, please check your otp again");
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");

    // keep only digits & max 6
    const digits = paste.replace(/\D/g, "").slice(0, 6);

    digits.split("").forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });

    setOtpState(digits);

    // focus next empty input or last one
    const nextIndex = digits.length >= 6 ? 5 : digits.length;
    inputRef.current[nextIndex]?.focus();
  };

  const isOtpValid = otpState.length === 6;

  return (
    <div className="flex justify-center items-center bg-[url('/src/assets/astronaut-nord.png')] bg-cover min-h-screen text-white font-ligh overflow-hidden">
      <div className="w-[450px] -mt-4 backdrop-blur-[5px] rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.2)] px-10 py-5">
        <h1 className="font-medium text-center text-4xl mb-4">Verify OTP</h1>
        <p className="font-medium text-center text-[1.1rem]">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit}>
          <div className="h-20 mt-5">
            <div className="flex justify-between" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength="1"
                    key={index}
                    className="w-13 h-14 text-center rounded-md bg-slate-800 text-2xl"
                    ref={(e) => (inputRef.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  /> //the same for onChange
                ))}
            </div>
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
