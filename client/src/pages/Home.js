import { useEffect, useState } from "react";
import Posts from "../Components/posts/Posts";
import RightBar from "../Components/RightBar";
import LeftBar from "../Components/LeftBar";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import usePosts from "../Components/dataHooks/usePosts";

const Home = () => {
  const { name } = useParams();

  const { response } = usePosts();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (response !== null) {
      setPosts(response);
    }
  }, [response]);

  const containerVariants = {
    hidden: {
      scale: 0.99,
    },
    visible: {
      scale: 1,
      transition: { duration: 0.15 },
    },
    exit: {
      transition: { ease: "easeIn" },
    },
  };

  const [title, setTitle] = useState("stuforum");
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={"container"}>
        <div className="container-div">
          <LeftBar />
        </div>
        <div className="container-div" style={{ width: "225%" }}>
          {name != null && (
            <div
              style={{
                display: "flex",
                marginBottom: 20,
              }}
            >
              <h3 style={{ color: "var(secondary)", marginTop: 8 }}>Tagged</h3>
              <a
                href={{
                  pathname: `/home/tagged/${name}`,
                }}
                style={{ marginLeft: 20 }}
                className="tag"
              >
                {name}
              </a>
            </div>
          )}

          <Posts posts={posts} singlePost={false} />
        </div>
        <div className="container-div">
          <RightBar activeTab={"home"} />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
