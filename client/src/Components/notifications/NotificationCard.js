import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import close from "../../resources/close.png";

const NotificationCard = ({ notif, onDelete, decayNotif }) => {
  const containerVariants = {
    hidden: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.5 },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      transition: { ease: "easeIn" },
    },
  };

  const [remove, setRemove] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      decayNotif();
      setRemove(true);
    }, 5000);
  }, [notif]);

  const handleRemove = () => {
    setRemove(true);
    setTimeout(() => onDelete(notif.id), 1000);
  };

  return (
    <AnimatePresence>
      <motion.div
        style={{
          backgroundColor: "var(--primary)",
          borderLeft: "10px solid #1835c5",
          borderRadius: 5,
          minHeight: 80,
          width: "350px",
          marginTop: "20px",
          padding: 10,
        }}
        variants={containerVariants}
        initial="hidden"
        animate={remove ? "hidden" : "visible"}
        exit="exit"
      >
        <div>
          <span
            style={{
              cursor: "pointer",
              float: "right",
            }}
            onClick={handleRemove}
          >
            <img className="icon" src={close} style={{ height: "20px" }} />
          </span>
          <h4 style={{ color: "var(--bg)" }}>You have a new notification!</h4>
          <p style={{ color: "var(--bg)" }}>
            {notif.user_from} {notif.description}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCard;
