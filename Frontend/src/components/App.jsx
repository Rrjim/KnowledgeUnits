import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./Home";
import AuthForm from "./AuthForm";
import GithubSearch from "./GithubSearch";
import GithubRepoContent from "./GithubRepoContent";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { UserDTO } from "../dtos/user.dto";
import FavoriteUserRepos from "./FavoriteUserRepos";
import StandaloneFiles from "./StandaloneFiles";
import MyCollection from "./MyCollections";
import ResetOnNavigation from "./ResetOnNavigation";
import UserStatistics from "./UserStatistics";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle login/register

  const updateUserSession = (userData) => {
    if (userData) {
      const user = new UserDTO(userData, userData.authenticated);
      setCurrentUser(user);
      sessionStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      setCurrentUser(null);
      sessionStorage.removeItem("currentUser");
    }
  };

  const checkAuthStatus = async () => {
    if (justLoggedOut) return;
    try {
      const res = await axios.get("http://localhost:3000/auth/user", { withCredentials: true });

      if (res.status === 401 || !res.data?.authenticated) {
        updateUserSession(null);
        navigate("/portal"); // Redirect to portal if not authenticated
        return;
      }

      updateUserSession(res.data);
    } catch (error) {
      updateUserSession(null);
      navigate("/portal"); // Redirect to portal if there's an error
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const handleAuth = async (email, password, confirm, isLogin, setErrorMessage) => {
    try {
      const endpoint = isLogin ? "http://localhost:3000/auth/login" : "http://localhost:3000/auth/register";
      const res = await axios.post(endpoint, { email, password, confirm }, { withCredentials: true });

      if (res.data.authenticated) {
        updateUserSession(res.data);
        navigate("/github-search");
      } else {
        setErrorMessage(res.data.message || "Invalid credentials or user already exists.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || (isLogin ? "Check your credentials!" : "This email already exists!"));
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/auth/logout", { withCredentials: true });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      updateUserSession(null);
      setJustLoggedOut(true);
      navigate("/portal");
    }
  };

  const authStatus = currentUser
    ? { authenticated: currentUser.authenticated, message: "Authenticated" }
    : { authenticated: false, message: "Not authenticated" };

  return (
    <div>
      <ResetOnNavigation/>
      <Header authStatus={authStatus} loginLocation={isLogin} currentUser={currentUser} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home authStatus={authStatus} />} />
        <Route path="/portal" element={<AuthForm authStatus={authStatus} isLogin={isLogin} setIsLogin={setIsLogin} handleAuth={handleAuth} />} />
        <Route path="/github-search" element={<GithubSearch authStatus={authStatus} currentUser={currentUser} />} />
        <Route path="/github-search/:username" element={<GithubSearch authStatus={authStatus} currentUser={currentUser} />} />
        <Route path="/github-search/:username/:repoName/:repoId" element={<GithubRepoContent authStatus={authStatus} currentUser={currentUser} />} />
        <Route path="/my-favorite-repos/:user" element={<FavoriteUserRepos authStatus={authStatus} currentUser={currentUser} />} />
        <Route path="/my-standalone-files/:user" element={<StandaloneFiles authStatus={authStatus} currentUser={currentUser} />} />
        <Route path="/my-collections/:user" element={<MyCollection authStatus={authStatus} currentUser={currentUser} />} />
        <Route path="/my-statistics/:user/:id" element={<UserStatistics authStatus={authStatus} currentUser={currentUser}/>} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
