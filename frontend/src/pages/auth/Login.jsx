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
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(email, password, rememberMe);
      console.log(data);
      if (data) {
        if (data.data?.userData) {
          localStorage.setItem("user", JSON.stringify(data.data.userData));
        }
        toast.success("Login successfully");
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
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
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />{" "}
              Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles["login-btn"]}
          >
            {isLoading ? "Logging in..." : "Login"}
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
            <FontAwesomeIcon icon={faGoogle} className="mr-2" /> Continue with
            Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
