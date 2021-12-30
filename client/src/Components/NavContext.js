import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NavContext = ({ show, onLogout }) => {
  return (
    <div>
      <div
        className={"context-content" + (show ? " shown" : "")}
        style={{
          minWidth: "160px",
          marginLeft: "88%",
          marginTop: "5%",
        }}
      >
        <ul
          style={{
            listStyleType: "none",
          }}
        >
          <div>
            <motion.button
              className="nullBtn"
              style={{
                width: "100%",
                margin: 0,
                padding: 0,
              }}
              whileHover={{
                x: -3,
              }}
            >
              <Link
                style={{
                  float: "right",
                  cursor: "pointer",
                  width: "100%",
                  margin: 0,
                  padding: 0,
                }}
                to={"/profile"}
              >
                <li style={{ color: "#b4b4b4", textAlign: "right" }}>
                  Profile
                </li>
              </Link>
            </motion.button>
            <hr style={{ width: "75%", marginLeft: 24, marginTop: -10 }} />
            <motion.button
              className="nullBtn"
              style={{ width: "100%", textAlign: "right" }}
              whileHover={{
                x: -3,
              }}
              onClick={onLogout}
            >
              {" "}
              <li style={{ color: "#b4b4b4" }}>Logout</li>
            </motion.button>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default NavContext;
