import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import InputFieldset from "@components/common/InputField.jsx";
import { useFormValidation } from "@hooks/useFormValidation.js";
import { resetPassword } from "@api/authApi.js";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { formValues, formErrors, touched, handleChange, handleBlur } =
    useFormValidation({
      password: "",
      confirmPassword: "",
    });

  const inputs = [
    {
      id: 1,
      name: "password",
      type: "password",
      label: "New Password",
      placeholder: "************",
      togglePassword: true,
    },
    {
      id: 2,
      name: "confirmPassword",
      type: "password",
      label: "Confirm Password",
      placeholder: "************",
      togglePassword: true,
      icon: faLock,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token. Please request a new link.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await resetPassword(token, formValues.password);
      if (data) {
        toast.success(
          data.message || "Password reset successfully! Redirecting to login...",
        );
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "Failed to reset password. The link may have expired.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    Boolean(token) &&
    Object.values(formErrors).every((err) => !err) &&
    Object.values(formValues).every((val) => val.trim() !== "");

  return (
    <div className="flex justify-center items-center bg-[url('@assets/astronaut-nord.png')] bg-cover min-h-screen text-white font-light overflow-hidden">
      <div className="w-[450px] -mt-4 backdrop-blur-[10px] rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.2)] px-10 py-6">
        <h1 className="font-medium text-center text-3xl">Reset Password</h1>
        <p className="text-center text-sm text-gray-300 mt-2 mb-4">
          Enter your new password below.
        </p>

        {!token ? (
          <div className="text-center py-4">
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-4 rounded-xl mb-4">
              Missing or invalid reset token. Please request a new password reset link.
            </div>
            <Link
              to="/forgot-password"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-6 py-2.5 rounded-full transition-all"
            >
              Request New Link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {inputs.map((input, index) => (
              <InputFieldset
                key={input.id}
                {...input}
                value={formValues[input.name] || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formErrors[input.name]}
                touched={touched[input.name]}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                isLast={index === inputs.length - 1}
              />
            ))}

            <div className="flex justify-center mt-3">
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full font-medium rounded-4xl p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.2)]
                          ${
                            isFormValid && !isLoading
                              ? "bg-[#262c3c] hover:shadow-[0_0_10px_rgba(0,0,0,0.4)] cursor-pointer"
                              : "bg-gray-400 cursor-not-allowed opacity-70"
                          }`}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>

            <div className="flex justify-center mt-4 text-sm">
              <p>
                Remember your password?{" "}
                <Link to="/login" className="hover:underline font-semibold text-gray-300">
                  Back to login
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;

