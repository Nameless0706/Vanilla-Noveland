import React, { useRef, useState, useEffect } from "react";

const OtpInput = ({ length = 6, onChange, disabled = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputsRef = useRef([]);

  // Auto-focus the first input on mount
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow digit inputs
    if (!/^\d*$/.test(value)) return;

    // Extract only the last typed character
    const char = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    const otpString = newOtp.join("");
    if (onChange) {
      onChange(otpString);
    }

    // Auto-focus the next input if a digit was entered
    if (char !== "" && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index] !== "") {
        // Clear the current active box if it has a value
        newOtp[index] = "";
        setOtp(newOtp);
        if (onChange) {
          onChange(newOtp.join(""));
        }
      } else if (index > 0) {
        // If current box is already empty, clear the previous box and focus it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        if (onChange) {
          onChange(newOtp.join(""));
        }
        inputsRef.current[index - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");

    // Extract only the first "length" number of digits
    const cleanDigits = pasteData.replace(/\D/g, "").slice(0, length);
    if (!cleanDigits) return;

    const newOtp = [...otp];
    for (let i = 0; i < length; i++) {
      if (i < cleanDigits.length) {
        newOtp[i] = cleanDigits[i];
      }
    }
    setOtp(newOtp);

    const otpString = newOtp.join("");
    if (onChange) {
      onChange(otpString);
    }

    // Focus on the last filled input or the last input overall
    const focusIndex = Math.min(cleanDigits.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          ref={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-14 text-center text-2xl font-bold bg-slate-800/80 border border-slate-700/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-white transition-all duration-200 outline-none hover:bg-slate-800/90 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      ))}
    </div>
  );
};

export default OtpInput;