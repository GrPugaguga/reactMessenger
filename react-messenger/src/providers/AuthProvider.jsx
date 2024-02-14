import { createContext, useState, useEffect, useMemo } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDL_tEdEkU0XOLoUBf9vkvQbk57UEzzT00",
    authDomain: "reactmessenger-74956.firebaseapp.com",
    projectId: "reactmessenger-74956",
    storageBucket: "reactmessenger-74956.appspot.com",
    messagingSenderId: "222602158803",
    appId: "1:222602158803:web:96755106ce75368e3e6a26",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const ga = getAuth(app);
  const db = getFirestore(app);
  const st = getStorage();

  useEffect(() => {
    const listen = onAuthStateChanged(
      ga,
      (authUser) => {
        if (authUser) {
          setUser(authUser);
        } else {
          setUser(null);
        }
      },
      []
    );
    return () => listen();
  }, []);

  const values = useMemo(
    () => ({
      user,
      setUser,
      ga,
      db,
      st,
    }),
    [user, ga, db, st]
  );

  return (
    <AuthContext.Provider value={{ user, setUser, ga, db, st }}>
      {children}
    </AuthContext.Provider>
  );
};
