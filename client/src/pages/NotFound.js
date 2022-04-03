import { useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/glitch.css";

import useWindowDimensions from "../hooks/useWindowDimensions";

const NotFound = () => {
  const { width } = useWindowDimensions();
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
      <div className={"container"} style={{ padding: "40px 0px" }}>
        <div className="container-div" style={{ display: "flex" }}>
          <h2 style={{ marginLeft: 30, marginTop: 13 }}>
            Oops! The page you visited was either not found or is
            <span className="glitch" data-text="glitched!">
              {" "}
              glitched!
            </span>
            <br />
            <span style={{ fontSize: 14, float: width > 900 && "right" }}>
              (Most probably the former)
            </span>
          </h2>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;
