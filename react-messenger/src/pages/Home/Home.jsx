import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/useAuth";
import Account from "../../components/Account/Account";
import styles from "./Home.css";
import Users from "../../components/Users/users";
import Chat from "../../components/Chat/Chat";

//ToDo
// Переделать диалоги
// Вставить время в сообщения
// Разобраться с ласт сообщением в диалогах и его временем
// Вставить иконки
// Переделать вход
// Создать настройки

const Home = () => {
  const [authUser, setAuthUser] = useState(null);
  const [companion, setCompanion] = useState();
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate();
  const { ga, user } = useAuth();
  useEffect(() => {
    const listen = onAuthStateChanged(
      ga,
      (user) => {
        if (user) {
          setAuthUser(user);
        } else {
          setAuthUser(null);
          navigate("/login");
        }
      },
      []
    );
    return () => listen();
  });

  return (
    <div className="home">
      <Account
        name={authUser?.displayName}
        uid={authUser?.uid}
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
      />
      <div className="chatWrapper">
        <Users setCompanion={setCompanion} setAvatarUrl={setAvatarUrl} />
        <Chat companion={companion} />
      </div>
    </div>
  );
};

export default Home;
