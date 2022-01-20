import notifications from "../../resources/notifications.png";
import avatar from "../../resources/img_avatar.png";
import Notifications from "../notifications/Notifications";
import "../../styles/navigation.css";
import { useEffect, useRef, useState } from "react";
import NavContext from "./NavContext";
import { AnimatePresence, motion } from "framer-motion";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import MobileNav from "./MobileNav";
import MiniPosts from "../posts/MiniPosts";
import useMiniPosts from "../../hooks/useMiniPosts";
import axios from "axios";

const Navbar = ({ isLogged, onLogout, newNotification }) => {
  const { width } = useWindowDimensions();

  const [notificationCount, setNotificationCount] = useState(0);
  const [show, setShow] = useState(false);
  const [showContext, setShowContext] = useState(false);

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

  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShow(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifRef]);

  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowContext(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  const searchRef = useRef(null);

  onkeydown = (e) => {
    if (e.key === "Enter" && searchText != "") {
      axios
        .post("http://localhost:3001/post/searchpost", { arg: searchText })
        .then((res) => {
          setMiniPosts(res.data);
        });
    }
  };

  const [remove, setRemove] = useState(false);
  const [showRecentPostsColumn, setShowRecentPostsColumn] = useState(false);

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
  const showMenu = (e) => {
    e.preventDefault();
    display == "none" ? setDisplay("block") : setDisplay("none");
  };

  useEffect(() => {
    let title = "stuforum";
    notificationCount != 0 && (title = ` (${notificationCount}) stuforum`);
    document.title = title;
  }, [notificationCount]);

  const scrollableTarget = "scrollableTarget";

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
    <div className="topnav">
      {width < 900 && <MobileNav onLogout={onLogout} display={display} />}
      <a
        style={{
          margin: "20px 0px 30px 60px",
          marginBottom: width < 900 ? 70 : 35,
          cursor: "pointer",
        }}
        href={"/home"}
      >
        {width > 900 && (
          <h3
            style={{
              color: "var(--primary)",
              letterSpacing: 2,
              fontSize: 26,
            }}
          >
            stu<span style={{ color: "var(--gray)" }}>forum</span>
          </h3>
        )}
      </a>

      {isLogged && (
        <div>
          <div ref={searchRef} className="topnav-centered">
            {width < 900 && (
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  right: -20,
                  marginTop: 12,
                }}
              >
                <motion.a
                  href=""
                  className="icon"
                  onClick={showMenu}
                  whileHover={{ cursor: "pointer" }}
                >
                  <i
                    className="fa fa-bars"
                    style={{ fontSize: 24, color: "var(--secondary)" }}
                  ></i>
                </motion.a>
              </div>
            )}
            <motion.input
              className="searchInput"
              type="text"
              placeholder="Search"
              style={{ width: width < 900 && "50%" }}
              whileFocus={{ width: width < 900 ? "55%" : "44%" }}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              onFocus={() => setShowRecentPostsColumn((oldState) => !oldState)}
            ></motion.input>
            {showRecentPostsColumn && (
              <AnimatePresence>
                <motion.div
                  id={scrollableTarget}
                  variants={containerVariants}
                  initial="hidden"
                  animate={remove ? "hidden" : "visible"}
                  exit="exit"
                  className="postsContainer"
                  style={{
                    position: "absolute",
                    width: "44%",
                    transform: "translate(-50%, 0%)",
                    top: "110px",
                    overflow: "auto",
                    left: "50%",
                    minHeight: "220px",
                    borderRadius: "5px",
                    zIndex: 997,
                  }}
                >
                  {!loading && (
                    <MiniPosts
                      miniPosts={miniPosts}
                      searchText={searchText}
                      scrollableTarget={scrollableTarget}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <div
            className="topnav-right"
            style={{ display: width < 900 && "none" }}
          >
            <div ref={notifRef}>
              <Notifications
                show={show}
                setNotificationCount={setNotificationCount}
                notificationCount={notificationCount}
                newNotification={newNotification}
              />
              <motion.a
                href=""
                style={{ margin: "35px 0px 0px 0px", cursor: "pointer" }}
                className="notification"
                onClick={(e) => {
                  e.preventDefault();
                  setShow((oldState) => !oldState);
                }}
              >
                <span>
                  <img className="icon" src={notifications} />
                </span>
                {notificationCount > 0 && (
                  <span
                    className="badge"
                    style={{ fontSize: 14, textAlign: "center" }}
                  >
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </motion.a>
            </div>
            <div style={{ margin: "27px 70px 0px 120px" }}>
              <button
                ref={profileRef}
                className="nullBtn"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => setShowContext((oldState) => !oldState)}
              >
                <img className="avatar" src={avatar} alt="Profile" />
                <NavContext show={showContext} onLogout={onLogout} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
