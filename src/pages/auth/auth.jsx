import React, { useState } from "react";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth">
      <div className="auth-card">
        <h2>{isLogin ? "Sign in" : "Create account"}</h2>
        <p className="subtitle">
          {isLogin
            ? "Use your account to continue"
            : "Create an account to get started"}
        </p>

        {!isLogin && (
          <input type="text" placeholder="Full name" />
        )}

        <input type="email" placeholder="Email address" />
        <input type="password" placeholder="Password" />

        <button className="primary-btn">
          {isLogin ? "Sign in" : "Sign up"}
        </button>

        <p className="toggle">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Sign up" : " Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
