import { useEffect, useState, useContext } from "react";
import Posts from "../Components/posts/Posts";
import RightBar from "../Components/RightBar";
import LeftBarUser from "../Components/LeftBarUser";
import { motion } from "framer-motion";
import { AuthContext } from "../helpers/AuthContext";

const UserProfile = () => {
  const { authState } = useContext(AuthContext);
  const containerVariants = {
    hidden: {
      opacity: 0.1,
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      transition: { ease: "easeOut" },
    },
  };

  const [title, setTitle] = useState("User Profile");
  useEffect(() => {
    document.title = title;
  }, [title]);

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
          <LeftBarUser user={authState.name} />
        </div>
        <div className="container-div" style={{ width: "225%" }}>
          {/* <Posts posts={posts} singlePost={false} postedBy={"Lorem Ipsum"} /> */}
        </div>
        <div className="container-div">
          <RightBar activeTab={""} />
        </div>
      </motion.div>
    </>
  );
};

export default UserProfile;
