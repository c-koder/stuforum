import close from "../../resources/close.png";
import avatar from "../../resources/img_avatar.png";
import liked from "../../resources/round/liked.png";
import upVoted from "../../resources/round/upvoted.png";
import commented from "../../resources/round/commented.png";
import moment from "moment";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Notification = ({ notification, changeViewed, onDelete }) => {
  const [time, setTime] = useState(moment(notification.time).local().fromNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment(notification.time).local().fromNow());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="notification-item">
        <img
          src={avatar}
          alt="Profile Poc"
          style={{ borderRadius: "50%", height: "50px" }}
        />
        <img
          className="icon"
          src={
            notification.type === "LK"
              ? liked
              : notification.type === "CM"
              ? commented
              : upVoted
          }
          style={{
            height: "25px",
            marginLeft: -10,
            marginTop: 26,
            marginRight: 10,
          }}
        />
        <div>
          <div style={{ display: "flex" }}>
            <span style={{ float: "left", width: "260px" }}>
              <h4>
                <span style={{ color: "var(--primary)" }}>
                  <motion.a
                    style={{ all: "unset" }}
                    href={`/user/${notification.user_from}`}
                    whileHover={{ cursor: "pointer" }}
                    onClick={() => {
                      changeViewed(notification.id);
                    }}
                  >
                    {notification.user_from}
                  </motion.a>
                </span>{" "}
                <motion.a
                  style={{ all: "unset" }}
                  href={`/post/${notification.post_id}`}
                  whileHover={{ cursor: "pointer" }}
                >
                  {notification.description}{" "}
                </motion.a>
              </h4>
            </span>
            <span
              style={{ cursor: "pointer", float: "right", marginLeft: 5 }}
              onClick={() => {
                onDelete(notification.id);
              }}
            >
              <img className="icon" src={close} style={{ height: "20px" }} />
            </span>
          </div>
          <h5 style={{ float: "left", color: "var(--secondary)" }}>{time}</h5>
          {notification.viewed == 0 && (
            <h6>
              <pre
                style={{
                  color: "var(--primary)",
                  fontSize: 26,
                  marginTop: -10,
                }}
              >
                {" "}
                ●
              </pre>
            </h6>
          )}
        </div>
      </div>
      <hr style={{ opacity: 0.3 }} />
    </>
  );
};

export default Notification;
