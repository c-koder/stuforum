import { useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/glitch.css";

import useWindowDimensions from "../hooks/useWindowDimensions";
import { containerVariants } from "../constants/Anim";

const NotFound = () => {
  const { width } = useWindowDimensions();

  useEffect(() => {
    document.title = "Page not found";
  }, []);

  return (
    <motion.div
      className="container"
      style={{ height: "69vh" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="container-div">
        <h4>
          Oops! The page you visited was either not found or is
          <span className="glitch" data-text="glitched!">
            {" "}
            glitched!
          </span>
          <br />
        </h4>
      </div>
    </motion.div>
  );
};

export default NotFound;
