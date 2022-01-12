import LogReg from "./pages/LogReg";
import Home from "./pages/Home";
import SinglePost from "./pages/SinglePost";
import MyAnswers from "./pages/MyAnswers";
import MyQuestions from "./pages/MyQuestions";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import Tags from "./pages/Tags";
import Navbar from "./Components/Navbar";
import ViewUser from "./pages/ViewUser";
import { useState, useEffect } from "react";
import { AuthContext } from "./helpers/AuthContext";
import axios from "axios";
import sun from "./resources/sun.png";
import moon from "./resources/moon.png";
import { motion } from "framer-motion";
import NotFound from "./pages/NotFound";
import useWindowDimensions from "./Components/dataHooks/useWindowDimensions";

const Routing = () => {
  const { width } = useWindowDimensions();
  const [authState, setAuthState] = useState({
    nick_name: "",
    id: 0,
    status: null,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            nick_name: response.data.nick_name,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ ...authState, status: false });
  };

  const lightTheme = {
    "--secondary": "#b4b4b4",
    "--gray": "#444444",
    "--blue": "#e8ebfb",
    "--bg": "#f8f8f8",
    "--white": "#ffffff",
    "--light-white": "#ececec",
  };

  const darkTheme = {
    "--secondary": "#a4a4a4",
    "--gray": "#f0f0f0",
    "--blue": "#333333",
    "--bg": "#121212",
    "--white": "#202020",
    "--light-white": "#333333",
  };

  const [currentMode, setCurrentMode] = useState("light");
  const [isChecked, setIsChecked] = useState(false);
  const [img, setImg] = useState(sun);

  useEffect(() => {
    if (localStorage.getItem("mode") === "dark") {
      setCurrentMode("dark");
      setIsChecked(true);
    }
  }, []);

  useEffect(() => {
    const theme = currentMode === "light" ? lightTheme : darkTheme;
    currentMode === "light" ? setImg(moon) : setImg(sun);
    Object.keys(theme).forEach((key) => {
      const value = theme[key];
      document.documentElement.style.setProperty(key, value);
    });
  }, [currentMode]);

  const toggleTheme = () => {
    const newMode = currentMode === "light" ? "dark" : "light";
    setIsChecked(!isChecked);
    setCurrentMode(newMode);
    localStorage.setItem("mode", newMode);
    isChecked ? setImg(moon) : setImg(sun);
  };

  const rotateVariant = {
    rotate: { rotate: -10, transition: { duration: 0.2 } },
    stop: {
      rotate: 40,
    },
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Navbar isLogged={authState.status} onLogout={onLogout} />

      <Routes>
        <Route
          path="/"
          element={!authState.status ? <LogReg /> : <Navigate to={"/home"} />}
        />

        {authState.status !== null && (
          <>
            <Route
              path="/home"
              element={authState.status ? <Home /> : <Navigate to={"/"} />}
            />

            <Route
              path="/myquestions"
              element={
                authState.status ? <MyQuestions /> : <Navigate to={"/"} />
              }
            />

            <Route
              path="/myanswers"
              element={authState.status ? <MyAnswers /> : <Navigate to={"/"} />}
            />

            <Route
              path="/post/:id"
              element={
                authState.status ? <SinglePost /> : <Navigate to={"/"} />
              }
            />

            <Route
              path="/tagged/:name"
              element={authState.status ? <Home /> : <Navigate to={"/"} />}
            />

            <Route
              path="/myquestions"
              element={
                authState.status ? <MyQuestions /> : <Navigate to={"/"} />
              }
            />

            <Route
              path="/user/:name"
              element={authState.status ? <ViewUser /> : <Navigate to={"/"} />}
            />

            <Route
              path="/profile"
              element={
                authState.status ? <UserProfile /> : <Navigate to={"/"} />
              }
            />

            <Route
              path="/tags"
              element={authState.status ? <Tags /> : <Navigate to={"/"} />}
            />

            <Route path="*" element={<Navigate to={"/404"} />} />

            <Route path="/404" element={<NotFound />} />
          </>
        )}
      </Routes>
      {width > 900 && (
        <motion.button
          className="themeToggleBtn"
          onClick={toggleTheme}
          whileHover={{ y: -5 }}
        >
          <motion.img
            className="icon"
            style={{ height: "22px" }}
            src={img}
            variants={rotateVariant}
            animate={currentMode === "light" ? "rotate" : "stop"}
          />
        </motion.button>
      )}
    </AuthContext.Provider>
  );
};

export default Routing;
