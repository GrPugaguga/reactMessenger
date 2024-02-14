import React, { useEffect, useState } from "react";
import styles from "./Dialog.css";
const Dialog = ({ name, lastMsg, className, onClick, url, ...props }) => {
  console.log(url);
  return (
    <div className={className} onClick={onClick}>
      <div className="dialogAvatar">
        <img
          src={url ? url : ""}
          alt=""
          style={{
            width: "49px",
            height: "49px",
            overflow: "hidden",
            borderRadius: "50%",
          }}
        />
      </div>
      <div>
        <div className="dialogName">{name}</div>
        <div className="dialogLastMsg">
          {!!lastMsg ? lastMsg?.message : "Тут должно быть последнее сообщение"}
        </div>
        <div className="dialogLastTime"></div>
      </div>
    </div>
  );
};

export default Dialog;
