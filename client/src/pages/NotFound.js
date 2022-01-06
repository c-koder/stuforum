import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import back from "../resources/backArrow.png";
import "../glitch.css";

const NotFound = () => {
  let navigate = useNavigate();
  const containerVariants = {
    hidden: {
      scale: 0.96,
    },
    visible: {
      scale: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      transition: { ease: "easeIn" },
    },
  };

  useEffect(() => {
    document.title = "Page not found";
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={"container"}>
        <div className="container-div" style={{ display: "flex" }}>
          <motion.div
            className="container-div"
            style={{ width: "0%" }}
            whileHover={{
              x: -5,
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/home");
              }}
              className="btn"
              style={{
                marginTop: 0,
                backgroundColor: "var(--white)",
                padding: "5px 15px 10px 15px",
                borderRadius: 10,
              }}
            >
              <img
                className="icon"
                style={{
                  height: "22px",
                  marginTop: 10,
                }}
                src={back}
              />
            </button>
          </motion.div>
          <h2 style={{ marginLeft: 30, marginTop: 13 }}>
            Oops! The page you visited was either not found or is
            <span className="glitch" data-text="glitched!">
              {" "}
              glitched!
            </span>
            <br />
            <span style={{ fontSize: 14, float: "right" }}>
              (Most probably the former)
            </span>
          </h2>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;
