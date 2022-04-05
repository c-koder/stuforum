import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router";

import RightBar from "../Components/RightBar";
import UserDetails from "../Components/UserDetails";
import useUser from "../hooks/useUser";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { containerVariants } from "../constants/Anim";

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

  useEffect(() => {
    document.title = name + " - stuforum";
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
      <div className="row">
        <div className={width > 992 ? "col-3" : "col"}>
          <UserDetails user={user} />
        </div>
        <div
          className="col"
          style={{ width: "225%", display: width < 900 && "none" }}
        ></div>
        <div className="col-3" style={{ display: width < 900 && "none" }}>
          <RightBar activeTab={""} />
        </div>
      </div>
    </motion.div>
  );
};

export default ViewUser;
