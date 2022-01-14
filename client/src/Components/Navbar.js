import notifications from "../resources/notifications.png";
import avatar from "../resources/img_avatar.png";
import Notifications from "./Notifications";
import logo from "../logo.png";
import { useEffect, useRef, useState } from "react";
import NavContext from "./NavContext";
import { motion } from "framer-motion";
import useWindowDimensions from "./dataHooks/useWindowDimensions";
import MobileNav from "./MobileNav";

const Navbar = ({ isLogged, onLogout }) => {
  const { width } = useWindowDimensions();

  const [notificationCount, setNotificationCount] = useState(0);
  const [show, setShow] = useState(false);
  const [showContext, setShowContext] = useState(false);

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

  const [display, setDisplay] = useState("none");
  const showMenu = (e) => {
    e.preventDefault();
    display == "none" ? setDisplay("block") : setDisplay("none");
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
          <div className="topnav-centered">
            {width < 900 && (
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  right: -20,
                  marginTop: 12
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
            ></motion.input>
          </div>
          <div
            className="topnav-right"
            style={{ display: width < 900 && "none" }}
          >
            <div ref={notifRef}>
              <a
                href=""
                style={{ margin: "35px 0px 0px 0px" }}
                className="notification"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <button
                  className="nullBtn"
                  onClick={() => setShow((oldState) => !oldState)}
                >
                  <span>
                    <img className="icon" src={notifications} />
                  </span>
                  {notificationCount > 0 && (
                    <span
                      className="badge"
                      style={{ fontSize: 16, textAlign: "center" }}
                    >
                      {notificationCount}
                    </span>
                  )}
                </button>
              </a>
              <Notifications
                show={show}
                setNotificationCount={setNotificationCount}
                notificationCount={notificationCount}
              />
            </div>

            <a
              href=""
              style={{ margin: "-65px 60px 0px 110px" }}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <button
                ref={profileRef}
                className="nullBtn"
                style={{ cursor: "pointer" }}
                onClick={() => setShowContext((oldState) => !oldState)}
              >
                <img className="avatar" src={avatar} alt="Profile" />
              </button>
            </a>
          </div>

          <NavContext show={showContext} onLogout={onLogout} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
