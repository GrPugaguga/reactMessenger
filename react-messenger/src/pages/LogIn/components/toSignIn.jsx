import React from "react";
import styles from "./style.css";

const toSignIn = ({ setEntryMethod, ...props }) => {
  return (
    <div className="changeWrapper">
      <h1 className="changeh1"> Hello, Friend</h1>
      <span className="changeSpan">
        Register with your personal details to use all of site features
      </span>
      <button className="changeButton" onClick={() => setEntryMethod(false)}>
        Sign Up
      </button>
    </div>
  );
};

export default toSignIn;
