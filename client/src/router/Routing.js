import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import io from "socket.io-client";
import { motion } from "framer-motion";

import { PORT } from "../constants/Port";
import LoginAndRegister from "../pages/LoginAndRegister";
import Home from "../pages/Home";
import SinglePost from "../pages/SinglePost";
import MyAnswers from "../pages/MyAnswers";
import MyQuestions from "../pages/MyQuestions";
import UserProfile from "../pages/UserProfile";
import Tags from "../pages/Tags";
import Navigation from "../Components/navigation/Navigation";
import ViewUser from "../pages/ViewUser";
import Footer from "../Components/Footer";

import sun from "../resources/sun.png";
import moon from "../resources/moon.png";
import NotFound from "../pages/NotFound";

import useWindowDimensions from "../hooks/useWindowDimensions";
import { AuthContext } from "../helpers/AuthContext";

const socket = io.connect(`http://localhost:3001`);

const Routing = () => {
  const { width } = useWindowDimensions();
  const [authState, setAuthState] = useState({
    nick_name: "",
    id: 0,
    status: null,
  });

  useEffect(() => {
    axios
      .get(`${PORT}auth`, {
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

  useEffect(() => {
    authState.id != 0 && socket.emit("registerId", authState.id);
  });

  const onLogout = () => {
    const time = moment().format("YYYY-MM-DD HH:mm:ss").toString();

    axios.post(`${PORT}user/logout`, {
      user_id: authState.id,
      time: time,
    });

    socket.emit("userLoggedOut", authState.id);

    localStorage.removeItem("accessToken");
    setAuthState({ ...authState, status: false });
  };

  const lightTheme = {
    "--secondary": "#b4b4b4",
    "--dark": "#444444",
    "--primary-light": "#e8ebfb",
    "--bg": "#f8f8f8",
    "--light": "#ffffff",
    "--light-white": "#ececec",
  };

  const darkTheme = {
    "--secondary": "#a4a4a4",
    "--dark": "#f0f0f0",
    "--primary-light": "#333333",
    "--bg": "#121212",
    "--light": "#202020",
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

  const [notifs, setNotifs] = useState([]);
  const [newNotification, setNewNotification] = useState();

  useEffect(() => {
    socket.on("receive_notification", (data) => {
      setNewNotification(data);
    });
  }, [socket]);

  useEffect(() => {
    if (newNotification != null) {
      toast(newNotification.user_from + " " + newNotification.description);
      !notifs.find((notif) => notif == newNotification) &&
        setNotifs([...notifs, newNotification]);
    }
  }, [newNotification]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        theme="dark"
        toastClassName="toast-style"
        draggable
        pauseOnHover
      />
      <Navigation
        isLogged={authState.status}
        onLogout={onLogout}
        newNotification={newNotification}
      />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              !authState.status ? (
                <LoginAndRegister />
              ) : (
                <Navigate to={"/home"} />
              )
            }
          />
          {authState.status !== null && (
            <>
              <Route
                path="/home"
                element={
                  authState.status ? (
                    <Home socket={socket} />
                  ) : (
                    <Navigate to={"/"} />
                  )
                }
              />

              <Route
                path="/myquestions"
                element={
                  authState.status ? (
                    <MyQuestions socket={socket} />
                  ) : (
                    <Navigate to={"/"} />
                  )
                }
              />

              <Route
                path="/myanswers"
                element={
                  authState.status ? (
                    <MyAnswers socket={socket} />
                  ) : (
                    <Navigate to={"/"} />
                  )
                }
              />

              <Route
                path="/post/:id"
                element={
                  authState.status ? (
                    <SinglePost socket={socket} />
                  ) : (
                    <Navigate to={"/"} />
                  )
                }
              />

              <Route
                path="/tagged/:name"
                element={
                  authState.status ? (
                    <Home socket={socket} />
                  ) : (
                    <Navigate to={"/"} />
                  )
                }
              />

              <Route
                path="/user/:name"
                element={
                  authState.status ? <ViewUser /> : <Navigate to={"/"} />
                }
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
        <Footer />
      </Router>
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
