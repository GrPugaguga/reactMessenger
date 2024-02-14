import React, { useEffect } from "react";
import { useState } from "react";
import styles from "./LogIn.css";
import ToLogIn from "./components/toLogIn";
import ToSignIn from "./components/toSignIn";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../providers/useAuth";

const LogIn = () => {
  const navigate = useNavigate();
  const [entryMethod, setEntryMethod] = useState(true);
  const { ga, user, db } = useAuth();
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState(""),
    [error, setError] = useState("");

  async function addUserToCoolect(res) {
    try {
      setDoc(doc(db, "users", res.user.uid), {
        avatar: "",
        name: name,
        uid: res.user.uid,
      });
      console.log("Document written with ID: ");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    return res;
  }

  function signUp(e) {
    createUserWithEmailAndPassword(ga, email, password)
      .then((res) => addUserToCoolect(res))
      .then((res) => {
        updateProfile(res.user, {
          displayName: name,
        });

        setEmail("");
        setPassword("");
        setName("");
        setEntryMethod(true);
        setError("");
      })
      .catch((e) => setError(e));
  }
  function signIn(e) {
    signInWithEmailAndPassword(ga, email, password)
      .then((user) => {
        setEmail("");
        setPassword("");
        setError("");
      })
      .catch((e) => setError(e));
  }
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  return (
    <>
      <div className={`form ${entryMethod ? "logIn" : "signIn"}`}>
        <div className={`changeEntryMethod ${entryMethod ? "left" : "right"}`}>
          {entryMethod ? (
            <ToSignIn setEntryMethod={setEntryMethod} />
          ) : (
            <ToLogIn setEntryMethod={setEntryMethod} />
          )}
        </div>
        <div className="entry">
          <h1 className="entryh1">
            {entryMethod ? "Sign In" : "Create Account"}
          </h1>
          <div className="registerBtn">
            <button className="registerMethods">1</button>
            <button className="registerMethods">2</button>
            <button className="registerMethods">3</button>
            <button className="registerMethods">4</button>
          </div>
          <span style={{ color: "gray" }}>
            or use your email {entryMethod ? "password" : "registration"}
          </span>
          <form style={{ display: "contents" }}>
            {entryMethod ? (
              ""
            ) : (
              <input
                className="entryInput"
                placeholder="name"
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              className="entryInput"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="entryInput"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {entryMethod ? (
              <span style={{ color: "gray" }}> Forgot Your Password?</span>
            ) : (
              ""
            )}

            <button
              className="entryBtn"
              onClick={(e) => {
                e.preventDefault();
                entryMethod ? signIn(e) : signUp(e);
              }}
            >
              {entryMethod ? "Sign In" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LogIn;
