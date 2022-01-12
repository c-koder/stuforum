import { useEffect, useState } from "react";
import RightBar from "../Components/RightBar";
import UserDetails from "../Components/UserDetails";
import { motion } from "framer-motion";
import { useParams } from "react-router";
import useUser from "../Components/dataHooks/useUser";

const ViewUser = () => {
  const { name } = useParams();

  const [user, setUser] = useState([]);
  const { userResponse } = useUser(name);

  useEffect(() => {
    if (userResponse !== null) {
      setUser(userResponse);
    }
  }, [userResponse]);

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
    document.title = name + " - stuforum";
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
          <UserDetails user={user} />
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

export default ViewUser;
