import React, { useState } from "react";
import "./../styles/AuthForm.css"; 
import InputForm from "../reusable/InputForm";
import ErrorDiv from "../reusable/ErrorDiv";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import KeyIcon from '@mui/icons-material/Key';
import googlePathIcon from "../datasets/pathIcon";
import ButtonSvg from '../reusable/ButtonSvg';
import ButtonWithIcon from '../reusable/ButtonWithIcon';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from "react-router-dom";

const AuthForm = ({ isLogin, setIsLogin, handleAuth, authStatus }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((prevValue) => ({
      ...prevValue,
      [name]: value
    }));
  }

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    await handleAuth(credentials.email, credentials.password, credentials.confirm, isLogin, setErrorMessage);
  };

  if (authStatus.authenticated) {
    return (
      <div className="container mt-5">
        <button className="btn btn-dark" onClick={() => navigate("/github-search")}>
          Go back to Github Search
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">    
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body">
              <form className="form" onSubmit={handleSubmit}>
                {errorMessage && <ErrorDiv message={errorMessage} style={{ color: "red" }} />}
                <InputForm label="Email" startIcon={<PermIdentityIcon />} name="email" type="email" value={credentials.email} handleChange={handleChange} />
                <InputForm label="Password" startIcon={<KeyIcon />} name="password" type="password" value={credentials.password} handleChange={handleChange} />
                {!isLogin && <InputForm label="Confirm Password" startIcon={<KeyIcon />} name="confirm" type="password" value={credentials.confirm} handleChange={handleChange} />}
                <button type="submit" className="btn btn-dark">
                  {isLogin ? "Login" : "Register"}
                </button>
              </form>

            </div>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <ButtonSvg link={"http://localhost:3000/auth/google"} iClassName={"fab fa-google"} buttonText={"Sign In with Google"} svgCLass={"svg-google"} width={"100"} height={"100"} pathIcon={googlePathIcon} />
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <ButtonWithIcon onClick={() => setIsLogin(!isLogin)} avatarBorderStyle={"10%"} icon={<ExitToAppIcon />} buttonText={isLogin ? "To Register" : "To Login"} buttonWidth={"200px"} btnClass={"auth-btn"}/>
       
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
