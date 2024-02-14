import React from "react";
import styles from "./style.css";

const toLogIn = ({ setEntryMethod, ...props }) => {
  return (
    <div className="changeWrapper">
      <h1 className="changeh1"> Welcome Back!</h1>
      <span className="changeSpan">
        Enter your personal details to use all of site features
      </span>
      <button className="changeButton" onClick={() => setEntryMethod(true)}>
        Sign In
      </button>
    </div>
  );
};

export default toLogIn;
