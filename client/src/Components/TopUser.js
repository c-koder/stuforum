import like from "../resources/like-blue.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TopUser = ({ topUser }) => {
  return (
    <>
      <motion.span
        style={{ display: "flex", marginBottom: 20, marginTop: 20 }}
        whileHover={{
          x: -1,
        }}
      >
        <Link to={`/user/${topUser.name}`}>
          <h3 style={{ color: "var(--primary)", fontSize: 22 }}>
            {topUser.name}
          </h3>
        </Link>
        <span style={{ marginLeft: "auto", marginRight: 0, display: "flex" }}>
          <h3 style={{ color: "var(--secondary)", fontSize: 22 }}>
            {topUser.likes}
          </h3>
          <img
            style={{ marginLeft: 10, height: 25 }}
            className="icon"
            src={like}
          />
        </span>
      </motion.span>
    </>
  );
};

export default TopUser;
