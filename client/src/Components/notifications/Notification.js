import moment from "moment";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import avatar from "../../resources/img_avatar.png";

const Notification = ({ notification, changeViewed, onDelete }) => {
  const [time, setTime] = useState(moment(notification.time).local().fromNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment(notification.time).local().fromNow());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="hstack notification-item"
      style={{
        background: notification.viewed == 0 && "rgba(61, 90, 241, 0.05)",
      }}
    >
      <img
        src={avatar}
        alt="Profile Pic"
        style={{ borderRadius: "50%", height: "50px" }}
      />
      <i
        class={
          notification.type === "LK"
            ? "bi bi-hand-thumbs-up-fill"
            : notification.type === "CM"
            ? "bi bi-chat-left-fill"
            : "bi bi-arrow-up-circle-fill"
        }
        style={{
          fontSize: 18,
          color: "var(--primary)",
          background: "var(--light)",
          width: 30,
          height: 30,
          paddingLeft: 5,
          paddingTop: 2,
          borderRadius: 25,
          marginLeft: -15,
          marginTop: 26,
          marginRight: 10,
        }}
      ></i>
      <div className="col">
        <div style={{ maxWidth: 250 }}>
          <span
            style={{ cursor: "pointer", float: "right", marginRight: -20 }}
            onClick={() => {
              onDelete(notification.id);
            }}
          >
            <i
              class="bi bi-x-circle-fill"
              style={{ color: "var(--dark)", fontSize: 20 }}
            ></i>
          </span>
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>
            <motion.a
              style={{ all: "unset" }}
              href={`/user/${notification.user_from}`}
              whileHover={{ cursor: "pointer" }}
            >
              {notification.user_from}
            </motion.a>
          </span>{" "}
          <span
            onClick={() => {
              changeViewed(notification.id);
            }}
          >
            <motion.a
              style={{ all: "unset" }}
              href={`/post/${notification.post_id}`}
              whileHover={{ cursor: "pointer" }}
            >
              {notification.description}{" "}
            </motion.a>
          </span>
        </div>
        <div style={{ float: "left", color: "var(--secondary)", fontSize: 13 }}>
          {time}
        </div>
      </div>
    </div>
  );
};

export default Notification;
