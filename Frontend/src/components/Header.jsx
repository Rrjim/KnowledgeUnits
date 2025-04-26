import React, { useState, useEffect, useRef } from "react";
import { deepPurple } from "@mui/material/colors";
import LI from "./../reusable/DropdownItems";
import userData from "./../datasets/user";
import mainMenuData from "./../datasets/mainMenu";
import IconDropdown from "../reusable/IconDropdown";
import AppsIcon from '@mui/icons-material/Apps';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';

import "./../styles/Static.css"; 

const Header = ({ authStatus, currentUser, handleLogout, loginLocation }) => {
  const [greetingMessage, setGreetingMessage] = useState(""); 
  const prevAuthStatus = useRef(authStatus.authenticated); 

  function createDropdownList(array) {
    const emailUsername = currentUser?.email.split('@')[0] || "guest";
    const id = currentUser?.id;
  
    const linkMap = {
      [emailUsername]: `/my-statistics/${emailUsername}/${id}`,
      "Find Users": "/github-search",
      "Favorite Repos": `/my-favorite-repos/${emailUsername}`,
      "Standalone Files": `/my-standalone-files/${emailUsername}`,
      "Collections": `/my-collections/${emailUsername}`,
    };
  
    return (
      <LI
        key={array.option}
        itemStyle={{ "&:hover": { backgroundColor: "rgba(238, 238, 238, 0.2)" }, borderRadius: "10px", display:"block" }}
        itemTextStyle={{ color: "rgba(255, 255, 255, 0.7)", padding: "5px" }}
        itemText={array.option}
        link={linkMap[array.option] || array.link} 
        icon={array.icon}
        handleClick={array.option === "Logout" ? handleLogout : undefined}
      />
    );
  }
  

  const userDropdownData = [
    { option: currentUser?.email.split('@')[0] || "Guest", link: "#" }, 
    ...userData, 
  ];

  useEffect(() => {
    if (!prevAuthStatus.current && authStatus.authenticated) {
      const greeting = `Howdy ${currentUser?.email.split('@')[0] || "User"}`;
      setGreetingMessage(greeting);
      setTimeout(() => {
        setGreetingMessage(""); 
      }, 3000);
    }

    prevAuthStatus.current = authStatus.authenticated;

  }, [authStatus.authenticated, currentUser]);

  return (
    <header
      className="header"
      style={!authStatus.authenticated ? { flexDirection: "column" } : { flexDirection: "row" }}
    >
      {authStatus.authenticated && (
        <IconDropdown
          avatarColor={deepPurple[500]}
          getData={mainMenuData}
          createData={createDropdownList}
          width={"250px"}
          borderRad={"4px"}
          icon={<AppsIcon />}
          left={""}
        />
      )}

      {!authStatus.authenticated && (
        <h1>{loginLocation ? "Sign in using either your credentials or Google" : "Sign up or sign in with Google"}</h1>
      )}

      {authStatus.authenticated && greetingMessage && (
        <h1>{greetingMessage}</h1>
      )}

      {authStatus.authenticated && (
        <IconDropdown
          avatarColor={deepPurple[500]}
          getData={userDropdownData}
          createData={createDropdownList}
          width={"200px"}
          borderRad={"4px"}
          left={"-400%"}
          icon={<PersonSharpIcon />}

        />
      )}
    </header>
  );
};

export default Header;
