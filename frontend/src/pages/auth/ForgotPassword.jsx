import React from "react";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import InputFieldset from "@components/common/InputField.jsx";
import { Link } from "react-router-dom";
import { forgotPassword } from "@api/authApi.js";
import { toast } from "react-toastify";
import { useFormValidation } from "@hooks/useFormValidation.js";

function ForgotPassword() {
  const { formValues, formErrors, touched, handleChange, handleBlur } =
    useFormValidation({
      email: "",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await forgotPassword(formValues.email);
      console.log(data);
      if (data) {
        toast.success("OTP has been sent to your mail");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const isFormValid =
    Object.values(formErrors).every((err) => !err) &&
    Object.values(formValues).every((val) => val.trim() !== "");

  return (
    <div className="flex justify-center items-center bg-[url('/src/assets/astronaut-nord.png')] bg-cover min-h-screen text-white overflow-hidden">
      <div className="w-[450px] -mt-4 backdrop-blur-[5px] rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.2)] px-10 py-5">
        <h1 className="font-medium text-center text-3xl">Forgot Password</h1>

        <form onSubmit={handleSubmit}>
          <InputFieldset
            name="email"
            type="email"
            helperText="Email must contains a single @"
            value={formValues.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={formErrors.email}
            touched={touched.email}
            icon={faEnvelope}
            label="Email"
            placeholder="example@gmail.com"
            isLast={true}
          />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full mt-2 font-medium rounded-4xl p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.2)]
                        ${
                          isFormValid
                            ? "bg-[#262c3c] hover:shadow-[0_0_10px_rgba(0,0,0,0.4)] cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed opacity-70"
                        }`}
            >
              Register
            </button>
          </div>

          <div className="flex justify-center mt-4 text-sm">
            <p>
              <Link to="/login" className="hover:underline font-medium">
                Back to login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ForgotPassword;
