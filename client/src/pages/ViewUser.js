import { useEffect, useState } from "react";
import RightBar from "../Components/RightBar";
import UserDetails from "../Components/UserDetails";
import { motion } from "framer-motion";
import { useParams } from "react-router";
import useUser from "../hooks/useUser";
import useWindowDimensions from "../hooks/useWindowDimensions";

const ViewUser = () => {
  const { width } = useWindowDimensions();
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
          <RightBar activeTab={""} />
        </div>
      </motion.div>
    </>
  );
};

export default ViewUser;
