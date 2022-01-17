import { motion } from "framer-motion";

const NavContext = ({ show, onLogout }) => {
  return (
    <div
      className={"context-content" + (show ? " shown" : "")}
      style={{
        minWidth: "120px",
        marginLeft: "-70px",
      }}
    >
      <ul
        style={{
          listStyleType: "none",
        }}
      >
        <a
          href={`/profile`}
          style={{
            float: "right",
            cursor: "pointer",
            width: "100%",
            margin: 0,
            padding: 0,
          }}
        >
          <motion.li
            style={{
              color: "var(--gray)",
              textAlign: "right",
              marginBottom: -5,
            }}
            whileHover={{
              x: -3,
            }}
          >
            Profile
          </motion.li>
        </a>
        <hr
          style={{
            width: "83%",
            margin: "0 auto",
            borderColor: "var(--secondary)",
          }}
        />
        <motion.li
          whileHover={{
            x: -3,
          }}
          onClick={onLogout}
          style={{ color: "var(--gray)" }}
        >
          Logout
        </motion.li>
      </ul>
    </div>
  );
};

export default NavContext;
