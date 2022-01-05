import notifications from "../resources/notifications.png";
import avatar from "../resources/img_avatar.png";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";
import logo from "../logo.png";
import { useEffect, useRef, useState } from "react";
import NavContext from "./NavContext";

const Navbar = ({ isLogged, onLogout }) => {
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

  return (
    <div className="topnav">
      <Link style={{ margin: "30px 60px", cursor: "pointer" }} to={"/home"}>
        <img style={{ height: "25px" }} src={logo} />
      </Link>
      {isLogged && (
        <div>
          <div className="topnav-centered">
            <input
              className="searchInput"
              type="text"
              placeholder="Search"
            ></input>
          </div>
          <div className="topnav-right">
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
                    <span className="badge">{notificationCount}</span>
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
