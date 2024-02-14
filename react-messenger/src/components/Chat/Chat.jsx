import React, { useEffect } from "react";
import styles from "./Chat.css";
import { useState } from "react";
import { useAuth } from "../../providers/useAuth";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import Message from "../Message/Message";
import SendMsg from "../../icons/SendMsg";

const Chat = ({ companion, ...props }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { db, user } = useAuth();

  const createDialogId = function (name1, name2) {
    const arr = [name1, name2];
    arr.sort();
    return `${arr[0]}${arr[1]}`;
  };

  useEffect(() => {
    if (!!!user) return;

    const unsub = onSnapshot(
      collection(
        db,
        "dialogs",
        `${createDialogId(user?.uid, companion?.uid)}`,
        "messages"
      ),
      (querySnapshot) => {
        const mArr = [];
        querySnapshot.forEach((doc) => {
          mArr.push(doc.data());
        });
        setMessages(
          mArr.sort((a, b) => {
            if (a.time > b.time) {
              return 1;
            } else {
              return -1;
            }
          })
        );
      }
    );
  }, [companion, db]);

  const sendMessage = async () => {
    if (!message && !companion) return;
    const time = new Date();
    try {
      addDoc(
        collection(
          db,
          "dialogs",
          `${createDialogId(user?.uid, companion?.uid)}`,
          "messages"
        ),
        {
          message: message,
          author: user.displayName,
          time: time.toTimeString().slice(0, 8),
        }
      );
      setMessage("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="chat">
      <div className="chatHeader">
        {!companion ? (
          <div className="start">Выберете собеседника</div>
        ) : (
          companion?.name
        )}
      </div>

      <div className="chatMessages">
        {!messages.length && !!companion ? (
          <div className="start">
            Напишите первое сообщение чтобы начать общение
          </div>
        ) : (
          ""
        )}
        {messages.map((msg, i) => (
          <Message
            key={i}
            messageTime={msg?.time}
            className={
              msg?.author === user.displayName
                ? "chatMessage rightMsg"
                : "chatMessage leftMsg"
            }
          >
            {msg?.message}
          </Message>
        ))}
      </div>

      <div className="createMessage">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chatInput"
          placeholder="Написать сообщение..."
        />
        <button onClick={() => sendMessage()} className="chatSendBtn">
          <SendMsg className="sendMsgIcon" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
