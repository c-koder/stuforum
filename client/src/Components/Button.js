import PropTypes from "prop-types";

const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="btn" style={{margin: 0, width:"100%"}}>
      {text}
    </button>
  );
};

export default Button;
