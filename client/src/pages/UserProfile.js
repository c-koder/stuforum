import { useEffect, useState, useContext } from "react";
import RightBar from "../Components/RightBar";
import LeftBarUser from "../Components/LeftBarUser";
import { motion } from "framer-motion";
import { AuthContext } from "../helpers/AuthContext";

const UserProfile = () => {
  const { authState } = useContext(AuthContext);
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
    document.title = "Profile";
  }, []);

  return (
    <>
      <motion.div
        className={"container"}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="container-div">
          <LeftBarUser/>
        </div>
        <div className="container-div" style={{ width: "225%" }}>
        </div>
        <div className="container-div">
          <RightBar activeTab={""} />
        </div>
      </motion.div>
    </>
  );
};

export default UserProfile;
