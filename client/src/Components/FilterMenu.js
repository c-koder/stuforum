import { motion } from "framer-motion";
import { useState } from "react";

const FilterMenu = ({ replies, posts, sortPosts, show }) => {
  const [active, setActive] = useState("getposts");

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          marginTop: 0,
          display: "flex",
          marginLeft: posts ? "15%" : "",
        }}
        className={"context-content" + (show ? " shown" : "")}
      >
        <motion.button
          className="nullBtn button"
          style={{ fontWeight: active == "getposts" && "bold" }}
          onClick={() => {
            sortPosts("getposts");
            setActive("getposts");
          }}
          whileHover={{
            y: 2,
          }}
        >
          Latest (Date)
        </motion.button>
        <div
          style={{
            borderLeft: "1px solid var(--secondary)",
            marginTop: "8px",
            borderRadius: 25,
            height: "30px",
          }}
        ></div>
        <motion.button
          className="nullBtn button"
          style={{
            fontWeight: active == "getascleadsposts" && "bold",
          }}
          onClick={() => {
            sortPosts("getascleadsposts");
            setActive("getascleadsposts");
          }}
          whileHover={{
            y: 2,
          }}
        >
          Leads (Low to High)
        </motion.button>
        <div
          style={{
            borderLeft: "1px solid var(--secondary)",
            marginTop: "8px",
            borderRadius: 25,
            height: "30px",
          }}
        ></div>
        <motion.button
          className="nullBtn button"
          style={{
            fontWeight: active == "getdescleadsposts" && "bold",
          }}
          onClick={() => {
            sortPosts("getdescleadsposts");
            setActive("getdescleadsposts");
          }}
          whileHover={{
            y: 2,
          }}
        >
          Leads (High to Low)
        </motion.button>
      </div>
    </div>
  );
};

export default FilterMenu;
