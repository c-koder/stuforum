import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";

import { AuthContext } from "../helpers/AuthContext";
import useUser from "../hooks/useUser";
import useWindowDimensions from "../hooks/useWindowDimensions";
import RightBar from "../Components/RightBar";
import UserDetails from "../Components/UserDetails";
import { containerVariants } from "../constants/Anim";
import EditProfile from "../Components/EditProfile";

const UserProfile = () => {
  const { width } = useWindowDimensions();
  const { authState } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const { userResponse } = useUser(authState.nick_name);

  useEffect(() => {
    if (userResponse !== null) {
      setUser(userResponse);
    }
  }, [userResponse]);

  useEffect(() => {
    document.title = "Profile";
  }, []);

  return (
    user !== null && (
      <motion.div
        className="container"
        style={{ height: "69vh" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <EditProfile user={user} />
        <div className="row">
          <div className={width > 992 ? "col-3" : "col"}>
            <UserDetails user={user} />
          </div>
          <div className="col" style={{ display: width < 992 && "none" }} />
          <div className="col-3" style={{ display: width < 992 && "none" }}>
            <RightBar activeTab={"profile"} />
          </div>
        </div>
      </motion.div>
    )
  );
};

export default UserProfile;
