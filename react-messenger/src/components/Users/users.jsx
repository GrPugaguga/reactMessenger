import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../providers/useAuth";
import styles from "./users.css";
import Dialog from "../Dialog/Dialog";
import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage";

const Users = ({ setCompanion, setAvatarUrl, ...props }) => {
  const { db, user, st } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [avatarList, setAvatarList] = useState([]);

  useEffect(() => {
    if (!user) return;
    const users = [];
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        if (doc.data().uid === user.uid) return;

        users.push({
          name: doc.data().name,
          uid: doc.data().uid,
          avatar: doc.data().avatar,
        });

        setUsersList(users);
      });
    };
    const getUsersAvatars = async () => {
      const listRef = ref(st, "images/");

      const { items } = await listAll(listRef);

      const images = [];
      for (const itemRef of items) {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        if (metadata.name.split(".")[0] === user.uid) {
          setAvatarUrl(url);
        } else {
          images.push({
            url,
            id: metadata.name.split(".")[0],
          });
        }
      }
      setAvatarList(images);
    };

    fetchUsers();
    getUsersAvatars();
  }, [user, db, st]);
  useEffect(() => {
    const findUserAvatar = () => {
      const users = Object.assign([], usersList);
      users.forEach((elem, i) => {
        avatarList.forEach((img) => {
          console.log(img.id);
          if (elem.uid === img.id) {
            console.log("ooooo");
            elem.url = img.url;
            console.log(elem);
            return;
          }
        });
      });
      setUsersList(users);
    };
    findUserAvatar();
  }, [avatarList]);

  return (
    <div className="usersList">
      <div className="findUser">Пользователи:</div>
      {usersList.map((e) => {
        if (user.uid === e.uid || e.uid === undefined) return "";
        console.log(e.url);
        return (
          <Dialog
            url={e.url}
            key={e.uid}
            className="anyUser"
            name={e.name}
            onClick={() => {
              setCompanion(e);
            }}
          />
        );
      })}
    </div>
  );
};

export default Users;
