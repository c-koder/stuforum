import time from "../../resources/time.png";
import { useState, useContext } from "react";
import { AuthContext } from "../../helpers/AuthContext";
import moment from "moment";
import { motion } from "framer-motion";

const MiniPost = ({ post }) => {
  const { authState } = useContext(AuthContext);

  const [postedTime, setPostedTime] = useState(
    moment(post.posted_time).local().fromNow()
  );

  return (
    <div className="miniPostsContainer">
      <motion.a
        style={{ all: "unset" }}
        href={`/post/${post.id}`}
        whileHover={{ cursor: "pointer" }}
      >
        <h3>{post.question}</h3>
      </motion.a>

      <div style={{ display: "flex" }}>
        <span style={{ marginTop: -6, marginRight: 5 }}>
          <h4 style={{color: "var(--secondary)",}}>
            u/
            <motion.a
              style={{ all: "unset" }}
              whileHover={{ cursor: "pointer" }}
              href={
                authState.nick_name == post.nick_name
                  ? "/profile"
                  : `/user/${post.nick_name}`
              }
            >
              {post.nick_name}
            </motion.a>
          </h4>
        </span>
        <span style={{ display: "flex", marginRight: 5 }}>
          <img className="navIcon" src={time} />
          <h4
            style={{
              color: "var(--secondary)",
              marginTop: -1,
            }}
          >
            {postedTime}
          </h4>
        </span>
      </div>
    </div>
  );
};

export default MiniPost;
