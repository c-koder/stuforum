import { useContext } from "react";
import moment from "moment";
import { motion } from "framer-motion";

import { AuthContext } from "../../helpers/AuthContext";

const MiniPost = ({ post }) => {
  const { authState } = useContext(AuthContext);
  const postedTime = moment(post.posted_time).local().fromNow();

  return (
    <div className="miniPostsContainer">
      <motion.a
        style={{ all: "unset" }}
        href={`/post/${post.id}`}
        whileHover={{ cursor: "pointer" }}
      >
        <h6>{post.question}</h6>
      </motion.a>

      <div className="hstack">
        <span style={{ marginRight: 15 }}>
          <h6 style={{ color: "var(--secondary)" }}>
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
          </h6>
        </span>
        <span style={{ display: "flex" }}>
          <i
            class="bi bi-clock-fill"
            style={{
              fontSize: 18,
              marginTop: 2,
              marginRight: 5,
              color: "var(--secondary)",
            }}
          ></i>
          <h6
            style={{
              color: "var(--secondary)",
            }}
          >
            {postedTime}
          </h6>
        </span>
      </div>
    </div>
  );
};

export default MiniPost;
