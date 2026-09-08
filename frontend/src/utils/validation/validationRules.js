export const VALIDATION_RULES = {
  display_name: {
    pattern: /^[A-Za-z0-9 ]{5,16}$/,
    message: "Display name must be 5–16 chars, letters/numbers/spaces only",
  },
  email: {
    type: "email",
    message: "Invalid email format",
  },
  password: {
    pattern:
      /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    message:
      "Password must be 8–20 chars, include letter, number & special char",
  },
};
