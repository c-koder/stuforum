import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

const ConfirmPopup = (props) => {
  const { setConfirmationPopup } = props;
  const { confirmationPopup } = props;

  const containerVariants = {
    hidden: {
      scale: 1.05,
      opacity: 0.1,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      transition: { ease: "easeIn" },
    },
  };

  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setConfirmationPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div className="overlay">
      <AnimatePresence>
        {confirmationPopup && (
          <motion.div
            ref={ref}
            className="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ width: "20%", height: "27%", top: "25%" }}
          >
            <div style={{ display: "block" }}>
              <h2>Confirm Delete?</h2>
              <h3 style={{ margin: "10px 0 10px 0" }}>
                It will be <span style={{ color: "#ff304f" }}>permanently</span>{" "}
                removed.
              </h3>
              <h4 style={{ margin: "10px 0 10px 0", color: "#b4b4b4" }}>
                (This action can't be undone.)
              </h4>
              <div style={{ display: "flex", width: "35%" }}>
                <button
                  className="btn btn-block"
                  style={{ marginRight: 20 }}
                  onClick={() =>
                    props.post != null
                      ? props.onDelete(props.post.id)
                      : props.reply != null && props.onDelete(props.reply.id)
                  }
                >
                  Okay
                </button>
                <button
                  className="btn btn-block"
                  onClick={() => setConfirmationPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfirmPopup;
