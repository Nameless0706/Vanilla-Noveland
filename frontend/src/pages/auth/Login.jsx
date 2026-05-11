import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import styles from "@pages/auth/Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@api/authApi";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      console.log(data);
      if (data) {
        toast.success("Login successfully");
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className={styles.container}>
      <div className={styles["login-form"]}>
        <h1 className="font-bold">Noveland</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles["input-box"]}>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <FontAwesomeIcon
              icon={faEnvelope}
              className={styles["input-icon"]}
              size="lg"
            />
          </div>

          <div className={styles["input-box"]}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <FontAwesomeIcon
              icon={faLock}
              className={styles["input-icon"]}
              size="lg"
            />
          </div>

          <div className={styles["remember-forgot"]}>
            <label>
              {" "}
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className={styles["login-btn"]}>
            Login
          </button>

          <div className={styles.register}>
            <p>
              Not yet a member? <Link to="/register">Register</Link>{" "}
            </p>
          </div>

          <div className={styles["divider"]}>
            <span>or</span>
          </div>

          <button
            type="button"
            className={styles["google-btn"]}
            onClick={handleGoogleLogin}
          >
            <FontAwesomeIcon icon={faGoogle} className="mr-2" /> Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
