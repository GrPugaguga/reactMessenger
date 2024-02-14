import React, { useEffect, useState } from "react";
import { useAuth } from "../../providers/useAuth";
import { signOut, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./Account.css";
import Setting from "../../icons/Setting";
import ChangeAvatar from "../../icons/ChangeAvatar";
import ChangeName from "../../icons/ChangeName";
import ChangePassword from "../../icons/ChangePassword";
import Enter from "../../icons/Enter";
import { updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";

const Account = ({
  name,
  uid,
  children,
  avatarUrl,
  setAvatarUrl,
  ...props
}) => {
  const { ga, user, db, st } = useAuth();
  const navigate = useNavigate();

  const [isStngOpen, setIsStngOpen] = useState(false);
  const [changeMethod, setChangeMethod] = useState("");
  const [changeValue, setChangeValue] = useState("");
  const [testImg, setTestImg] = useState("");

  function userSignOut() {
    if (!isStngOpen) return;
    signOut(ga)
      .then((e) => {
        navigate("/login");
        console.log(e);
      })
      .catch((e) => console.log(e));
  }
  async function changeUserName(name) {
    try {
      updateDoc(doc(db, "users", user.uid), {
        name: name,
        uid: user.uid,
      });
      console.log("Document written with ID: " + user.uid);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    return;
  }
  async function exportImg() {
    if (testImg === "") return;
    const storageRef = ref(st, "images/" + user.uid);
    const uploadTask = uploadBytesResumable(storageRef, testImg.file, {
      customMetadata: {
        id: user.uid,
      },
    });
    setAvatarUrl(testImg.url);
  }
  async function changeUserAvatar(value) {
    const files = Array.from(value);
    const reader = new FileReader();
    reader.onload = (e) => {
      setTestImg({
        name: files[0].name,
        size: files[0].size,
        url: reader.result,
        file: files[0],
      });
    };
    reader.readAsDataURL(files[0]);
    return;
  }
  useEffect(() => {
    exportImg();
  }, [testImg]);

  function setNewParams(param, newValue) {
    switch (param) {
      case "password":
        if (newValue.length < 7) return;
        updatePassword(user, newValue)
          .then(() => console.log("Ok!"))
          .then(() => userSignOut());
        break;
      case "name":
        changeUserName(newValue)
          .then(() =>
            updateProfile(user, {
              displayName: newValue,
            })
          )
          .then(() => {
            window.location.reload();
          });
        break;
      case "avatar":
        changeUserAvatar(newValue);
        break;
      default:
        break;
    }
    alert(param + ":" + newValue);
  }

  return (
    <div className="account">
      <button
        className="settingBtn accBtn abs"
        onClick={() => setIsStngOpen(!isStngOpen)}
      >
        <Setting
          className={isStngOpen ? "settingIcon rotation" : "settingIcon"}
        />{" "}
      </button>
      <div className="avatar">
        {!!avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            style={{
              width: "85px",
              height: "85px",
              overflow: "hidden",
              borderRadius: "50%",
            }}
          />
        ) : (
          ""
        )}
      </div>
      <div className="name">{name}</div>
      <div className="uid">id {uid?.slice(0, 8)}</div>
      <div className={isStngOpen ? "openSettings opacity " : "openSettings "}>
        <div
          className="settingWrapper"
          onClick={() => {
            if (!isStngOpen) return;
            changeMethod === "avatar"
              ? setChangeMethod(null)
              : setChangeMethod("avatar");
          }}
        >
          {" "}
          <ChangeAvatar className="icons settingIcon" />{" "}
          <span> Сменить аватар</span>
        </div>
        {changeMethod === "avatar" ? (
          <input
            type="file"
            onChange={(e) => setNewParams("avatar", e.target.files)}
          />
        ) : (
          ""
        )}

        <div
          className="settingWrapper"
          onClick={() => {
            if (!isStngOpen) return;

            changeMethod === "name"
              ? setChangeMethod(null)
              : setChangeMethod("name");
            setChangeValue("");
          }}
        >
          <ChangeName className="icons settingIcon" />
          <span> Сменить имя</span>
        </div>
        {changeMethod === "name" ? (
          <div className="chandeParamWrapper">
            <input
              className="changeParamInput"
              placeholder="Enter new username"
              value={changeValue}
              onChange={(e) => setChangeValue(e.target.value)}
            />
            <button
              onClick={() => setNewParams(changeMethod, changeValue)}
              className="changeParamButton"
            >
              <Enter className="changeParamIcon" />
            </button>
          </div>
        ) : (
          ""
        )}

        <div
          className="settingWrapper"
          onClick={() => {
            if (!isStngOpen) return;
            changeMethod === "password"
              ? setChangeMethod(null)
              : setChangeMethod("password");

            setChangeValue("");
          }}
        >
          <ChangePassword className="icons settingIcon " />
          <span> Сменить пароль</span>
        </div>
        {changeMethod === "password" ? (
          <div className="chandeParamWrapper">
            <input
              className="changeParamInput"
              placeholder="Enter a new password"
              value={changeValue}
              onChange={(e) => setChangeValue(e.target.value)}
            />
            <button
              onClick={() => setNewParams(changeMethod, changeValue)}
              className="changeParamButton"
            >
              <Enter className="changeParamIcon" />
            </button>
          </div>
        ) : (
          ""
        )}
        <button
          onClick={userSignOut}
          className="signOutBtn accBtn"
          style={!isStngOpen ? { cursor: "default" } : { cursor: "pointer" }}
        >
          Выход
        </button>
      </div>
    </div>
  );
};

export default Account;
