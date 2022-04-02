import avatar from "../../resources/img_avatar.png";
import Notifications from "../notifications/Notifications";
import { useEffect, useRef, useState } from "react";
import NavContext from "./NavContext";
import { AnimatePresence, motion } from "framer-motion";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import MobileNav from "./MobileNav";
import MiniPosts from "../posts/MiniPosts";
import useMiniPosts from "../../hooks/useMiniPosts";
import axios from "axios";
import { PORT } from "../../constants/Port";

const Navigation = ({ isLogged, onLogout, newNotification }) => {
  const { width } = useWindowDimensions();

  const [notificationCount, setNotificationCount] = useState(0);

  const [searchText, setSearchText] = useState("");

  const [miniPosts, setMiniPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { response } = useMiniPosts(4);

  useEffect(() => {
    if (response !== null) {
      setMiniPosts(response);
    }
    setLoading(false);
  }, [response]);

  const searchRef = useRef(null);

  onkeydown = (e) => {
    if (e.key === "Enter" && searchText != "") {
      axios
        .post(`${PORT}post/searchpost`, {
          arg: searchText,
        })
        .then((res) => {
          setMiniPosts(res.data);
        });
    }
  };

  const [remove, setRemove] = useState(false);
  const [showSearchResults, setShowRecentPostsColumn] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setRemove(true);
        setTimeout(() => {
          setShowRecentPostsColumn(false);
          setRemove(false);
        }, 200);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const [display, setDisplay] = useState("none");

  useEffect(() => {
    let title = "stuforum";
    notificationCount != 0 && (title = ` (${notificationCount}) stuforum`);
    document.title = title;
  }, [notificationCount]);

  const containerVariants = {
    hidden: {
      width: "40%",
      height: 0,
      opacity: 0,
      transition: { duration: 0.02, delay: 0 },
    },
    visible: {
      width: width < 900 ? "54%" : "44%",
      height: 100,
      opacity: 1,
      transition: { duration: 0.02, delay: 0 },
    },
    exit: {
      transition: { ease: "easeIn" },
    },
  };

  return (
    <nav className="navbar navbar-light navbar-expand-lg py-4 fixed-top justify-content-center">
      <div className="container">
        <div className="navbar-brand d-flex w-50 me-auto">
          <a href="/">
            <h3
              style={{
                color: "var(--primary)",
                letterSpacing: 2,
                fontSize: 26,
              }}
            >
              stu<span style={{ color: "var(--dark)" }}>forum</span>
            </h3>
          </a>
        </div>
        {isLogged && (
          <button
            className="navbar-toggler shadow-none"
            style={{ border: "none", fontSize: 24 }}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar"
          >
            <i className="bi bi-list"></i>
          </button>
        )}
        {isLogged && (
          <div className="navbar-collapse collapse w-100" id="navbar">
            <ul className="navbar-nav w-100 justify-content-center">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    style={{ background: "var(--light)" }}
                    id="basic-addon1"
                  >
                    <i className="bi bi-search"></i>
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control shadow-none"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  onFocus={() =>
                    setShowRecentPostsColumn((oldState) => !oldState)
                  }
                />
              </div>
              {showSearchResults && (
                <AnimatePresence>
                  <motion.div
                    id="searchTarget"
                    ref={searchRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={remove ? "hidden" : "visible"}
                    exit="exit"
                    className="posts-container"
                    style={{
                      position: "absolute",
                      transform: "translate(-50%, 0%)",
                      top: "100px",
                      overflow: "auto",
                      left: "50%",
                      minHeight: "300px",
                      borderRadius: "5px",
                      zIndex: 1,
                      boxShadow: "0px 50px 50px rgba(0, 0, 0, 0.07)",
                    }}
                  >
                    {!loading && (
                      <MiniPosts
                        miniPosts={miniPosts}
                        searchText={searchText}
                        scrollableTarget={"searchTarget"}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </ul>
            {width > 992 && (
              <ul className="nav navbar-nav ms-auto w-100 justify-content-end">
                <li className="nav-item mt-2">
                  <div className="dropdown">
                    <a
                      role="button"
                      id="notifications-menu"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i
                        className="bi bi-bell-fill"
                        style={{ fontSize: 24 }}
                      ></i>
                    </a>
                    <Notifications
                      setNotificationCount={setNotificationCount}
                      notificationCount={notificationCount}
                      newNotification={newNotification}
                    />
                  </div>
                </li>
                <li className="nav-item" style={{ marginLeft: 40 }}>
                  <div className="dropdown">
                    <a
                      role="button"
                      id="nav-context"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img className="avatar" src={avatar} alt="Profile" />
                    </a>
                    <NavContext onLogout={onLogout} />
                  </div>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
      {width < 900 && <MobileNav onLogout={onLogout} display={display} />}
    </nav>
  );
};

export default Navigation;
