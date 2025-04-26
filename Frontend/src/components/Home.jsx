import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Home.css";

const Home = ({ authStatus }) => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <i className="fas fa-key home-icon"></i>
        <h1 className="home-title">Discover the JS Developer's Secrets</h1>
        <p className="home-description">{authStatus.message}</p>
        <hr className="hr-divider" />
        <div className="button-container">
          {!authStatus.authenticated ? (
            <>
              <button onClick={() => navigate("/register")} className="button button-register">
                Register
              </button>
              <button onClick={() => navigate("/login")} className="button button-login">
                Login
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/github-search")} className="button button-login">
              Back to the App
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
