import { motion } from "framer-motion";
import { useState } from "react";

const FilterMenu = ({ replies, sortData, posts, show }) => {
  const [active, setActive] = useState("");
  const [toggleDateSort, setToggleDateSort] = useState("asc");
  const [toggleLikesSort, setToggleLikesSort] = useState("asc");
  const [toggleLeadsSort, setToggleLeadsSort] = useState("asc");

  const dates = () => {
    setActive("date");
    if (toggleDateSort == "asc") {
      setToggleDateSort("desc");
      sortData("dateasc");
    } else {
      setToggleDateSort("asc");
      sortData("datedesc");
    }
  };

  const likesLeads = () => {
    setActive("likesLeads");
    if (replies != null) {
      if (toggleLikesSort == "asc") {
        setToggleLikesSort("desc");
        sortData("likesdesc");
      } else {
        setToggleLikesSort("asc");
        sortData("likesasc");
      }
    } else {
      if (toggleLeadsSort == "asc") {
        setToggleLeadsSort("desc");
        sortData("leadsdesc");
      } else {
        setToggleLeadsSort("asc");
        sortData("leadsasc");
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          marginTop: 0,
          display: "flex",
          marginLeft: 120,
        }}
        className={"context-content" + (show ? " shown" : "")}
      >
        <motion.button
          className="nullBtn button"
          style={{ fontWeight: active == "date" && "bold" }}
          onClick={dates}
          whileHover={{
            y: 2,
          }}
        >
          Date
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
            fontWeight: active == "likesLeads" && "bold",
          }}
          onClick={likesLeads}
          whileHover={{
            y: 2,
          }}
        >
          {replies != null ? "Likes " : "Leads "}
        </motion.button>
      </div>
    </div>
  );
};

export default FilterMenu;
