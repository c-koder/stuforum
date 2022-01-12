import { useEffect, useState, useContext } from "react";
import RightBar from "../Components/RightBar";
import UserDetails from "../Components/UserDetails";
import { motion } from "framer-motion";
import { AuthContext } from "../helpers/AuthContext";
import useUser from "../Components/dataHooks/useUser";

const UserProfile = () => {
  const { authState } = useContext(AuthContext);

  const [user, setUser] = useState([])
  const { userResponse } = useUser(authState.nick_name);
  

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
          <UserDetails user={user}/>
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
