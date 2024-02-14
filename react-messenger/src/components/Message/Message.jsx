import React from "react";
import styles from "./Message.css";
const Message = ({ messageTime, className, children, ...props }) => {
  return (
    <div className={className}>
      {children}
      <span className="messageTime">{messageTime.slice(0, 5)}</span>
    </div>
  );
};

export default Message;
