import { useEffect, useState, useContext } from "react";
import RightBar from "../Components/RightBar";
import UserDetails from "../Components/UserDetails";
import { motion } from "framer-motion";
import { AuthContext } from "../helpers/AuthContext";
import useUser from "../Components/dataHooks/useUser";
import useWindowDimensions from "../Components/dataHooks/useWindowDimensions";

const UserProfile = () => {
  const { width } = useWindowDimensions();
  const { authState } = useContext(AuthContext);

  const [user, setUser] = useState([]);
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
        <div
          className="container-div"
          style={{
            margin: width < 900 && "-80px 0px 0px 0px",
            marginTop: width < 900 ? "-40px" : 0,
          }}
        >
          <UserDetails user={user} />
        </div>
        <div
          className="container-div"
          style={{ width: "225%", display: width < 900 && "none" }}
        ></div>
        <div
          className="container-div"
          style={{ display: width < 900 && "none" }}
        >
          <RightBar activeTab={"profile"} />
        </div>
      </motion.div>
    </>
  );
};

export default UserProfile;
