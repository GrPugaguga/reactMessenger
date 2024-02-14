import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import LogIn from "./pages/LogIn/LogIn";
import { useAuth } from "./providers/useAuth";

function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route path="" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
