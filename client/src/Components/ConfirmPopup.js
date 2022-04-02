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

  const onClick = () => {
    if (props.post != null) {
      props.onDelete(props.post.id);
    } else if (props.reply != null) {
      props.onDelete(props.reply.id, props.reply.parent_id);
    }
  };

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
            style={{ width: "20%", height: "26%", top: "22%" }}
          >
            <div style={{ display: "block" }}>
              <h2>Confirm Delete?</h2>
              <h3 style={{ margin: "10px 0 10px 0" }}>
                It will be{" "}
                <span style={{ color: "var(--warning)" }}>permanently</span>{" "}
                removed.
              </h3>
              <h4
                style={{ margin: "10px 0 10px 0", color: "var(--secondary)" }}
              >
                (This action can't be undone.)
              </h4>
              <div style={{ display: "flex", width: "35%" }}>
                <button
                  className="btn btn-block"
                  style={{ marginRight: 20 }}
                  onClick={onClick}
                >
                  Proceed
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
