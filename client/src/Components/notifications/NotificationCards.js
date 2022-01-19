import React from "react";
import NotificationCard from "./NotificationCard";
import "../../styles/notification.css";
import { AnimatePresence } from "framer-motion";

const NotificationCards = ({ notifs, onDelete, decayNotif }) => {
  return (
    <AnimatePresence>
      <div className="notifCardArea">
        {notifs.map((notif) => {
          return (
            <NotificationCard
              key={notif.id}
              notif={notif}
              onDelete={onDelete}
              decayNotif={decayNotif}
            />
          );
        })}
      </div>
    </AnimatePresence>
  );
};

export default NotificationCards;
