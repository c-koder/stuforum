import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { validEmail, validPassword, validStudentID } from "../constants/Regex";
import PasswordStrengthMeter from "../utils/PasswordStrengthMeter";
import Login from "../Components/Login";
import { motion } from "framer-motion";

const LoginAndRegister = () => {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [nickName, setNickName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [focused, setFocused] = useState(false);

  onkeydown = (e) => {
    if (
      e.key === "Enter" &&
      (fullName !== "" ||
        studentId !== "" ||
        studentEmail !== "" ||
        password !== "" ||
        confirmPassword !== "")
    ) {
      register();
    }
  };
  const register = () => {
    const joinDate = moment().format("YYYY-MM-DD HH:mm:ss").toString();
    if (
      fullName === "" &&
      nickName === "" &&
      studentId === "" &&
      studentEmail === "" &&
      password === "" &&
      confirmPassword === ""
    ) {
      setError("Please fill all the fields");
    } else if (fullName === "") {
      setError("Full name is required");
    } else if (studentId === "") {
      setError("Student ID is required");
    } else if (!validStudentID.test(studentId)) {
      setError("Invalid Student ID format (Ex: 12ABC1234)");
    } else if (nickName === "") {
      setError("Nickname is required");
    } else if (studentEmail === "") {
      setError("Student Email is required");
    } else if (!validEmail.test(studentEmail)) {
      setError("Invalid Student Email format");
    } else if (password === "") {
      setError("Password is required");
    } else if (!validPassword.test(password)) {
      setError("Please set a secure enough password");
    } else if (confirmPassword === "") {
      setError("Confirm Password is required");
    } else if (confirmPassword !== password) {
      setError("Passwords don't match");
    } else {
      axios
        .post("http://localhost:3001/user/register", {
          full_name: fullName,
          nick_name: nickName,
          student_id: studentId,
          student_email: studentEmail,
          password: password,
          join_date: joinDate,
        })
        .then((response) => {
          if (response.data.message != null) {
            setError(response.data.message);
          } else {
            setError("Registration Successful");

            setFullName("");
            setNickName("");
            setStudentId("");
            setStudentEmail("");
            setPassword("");
            setConfirmPassword("");
          }
        });

      setPassword("");
      setConfirmPassword("");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const errorStyling = () => {
    if (error != "") {
      if (error === "Registration Successful") {
        return "error success";
      } else {
        return "error active";
      }
    } else {
      return "error";
    }
  };

  const containerVariants = {
    hidden: {
      scale: 0.96,
    },
    visible: {
      scale: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      transition: { ease: "easeIn" },
    },
  };

  return (
    <motion.div
      className="center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ position: "relative" }}
    >
      <div
        className={"container"}
        style={{
          margin: "0",
          width: "60%",
          padding: "0",
        }}
      >
        <div
          className="container-div"
          style={{
            width: "25%",
            margin: 0,
            padding: 0,
            marginRight: 80,
          }}
        >
          <Login />
        </div>

        <div
          style={{
            borderLeft: "2px solid",
            borderColor: "var(--secondary)",
            borderRadius: 25,
            height: "410px",
            marginLeft: 25,
          }}
        ></div>

        <div
          className="container-div"
          style={{
            width: "25%",
            marginRight: 80,
          }}
        >
          <h3>Register</h3>
          <p>Not a user yet? Sign up now!</p>

          <div className="form-control">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => {
                let value = e.target.value;
                value = value.replace(/[^A-Za-z ]/gi, "");
                setFullName(value);
              }}
            />
          </div>
          <div className="form-control">
            <label>Student ID</label>
            <input
              type="text"
              placeholder="Student ID (XXABCXXXX)"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
              }}
            />
          </div>
          <input
            type="button"
            style={{ marginLeft: 5 }}
            value="Register"
            className="btn btn-block"
            onClick={register}
          />
          <div
            id="error"
            className={errorStyling()}
            style={{
              marginLeft: 5,
            }}
          >
            {error}
          </div>
        </div>
        <div className="container-div" style={{ width: "25%", marginTop: 52 }}>
          <div className="form-control">
            <label>Nickname</label>
            <input
              type="text"
              placeholder="Nickname"
              value={nickName}
              onChange={(e) => {
                setNickName(e.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label>Student Email</label>
            <input
              type="text"
              placeholder="Student Email"
              value={studentEmail}
              onChange={(e) => {
                setStudentEmail(e.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <PasswordStrengthMeter password={password} />
          <div className="form-control">
            <label>Confirm Password</label>
            <input
              type="password"
              onFocus={() => setFocused((oldState) => !oldState)}
              placeholder="Confirm Password"
              disabled={password === ""}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginAndRegister;
