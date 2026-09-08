import { useState } from "react";

export const useFormValidation = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});


  const patterns = {
    display_name: /^[\p{L} ]{1,16}$/u, // Vietnamese supported
    password:
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/,
  };

  // single-field validation only
  const validate = (name, value, values, type) => {
    // Email
    if (type === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Invalid email format";
      }
    }

    // pattern validation
    if (patterns[name] && !patterns[name].test(value)) {
      switch (name) {
        case "display_name":
          return "Display name should be 1-16 characters and not contain special characters.";

        case "password":
          return "Password must be 8-20 chars, include letter, number, special character";

        default:
          return "Invalid value";
      }
    }

    return null;
  };


  const handleChange = (e) => {
    const { name, value, type } = e.target;

    const updated = { ...formValues, [name]: value };
    setFormValues(updated);

    setFormErrors((prev) => {
      const newErrors = { ...prev };

      // validate current field
      newErrors[name] = validate(name, value, updated, type);

      // cross-field validation ONLY for password pair
      if (name === "password" || name === "confirmPassword") {
        if (
          updated.password &&
          updated.confirmPassword &&
          updated.password !== updated.confirmPassword
        ) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          newErrors.confirmPassword = null;
        }
      }

      return newErrors;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  return {
    formValues,
    formErrors,
    touched,
    handleChange,
    handleBlur,
  };
};
