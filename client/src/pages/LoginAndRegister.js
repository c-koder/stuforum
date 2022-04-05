import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { motion } from "framer-motion";

import Login from "./Login";
import { PORT } from "../constants/Port";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { validEmail, validPassword, validStudentID } from "../constants/Regex";
import PasswordStrengthMeter from "../utils/PasswordStrengthMeter";

const LoginAndRegister = () => {
  const { width } = useWindowDimensions();

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
        .post(`${PORT}user/register`, {
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

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="container"
      style={{ height: "69vh" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={width > 992 && "centered"}>
        <div className="row justify-content-center">
          <div className={`col${width < 992 ? "-md-auto" : ""}`}>
            <Login />
          </div>
          {width > 992 ? (
            <div
              className="vr"
              style={{ color: "var(--dark)", padding: 1, margin: "0px 10px" }}
            />
          ) : (
            <hr />
          )}

          <div className={`col${width < 992 ? "-md-auto" : ""}`}>
            <div>
              <h3>Register</h3>
              <p>Not a user yet? Sign up now!</p>
            </div>

            <div className="form-group my-3">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="form-control shadow-none"
                value={fullName}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/[^A-Za-z ]/gi, "");
                  setFullName(value);
                }}
              />
            </div>

            <div className="form-group my-3">
              <label htmlFor="std_id" className="form-label">
                Student ID
              </label>
              <input
                type="text"
                name="std_id"
                placeholder="Student ID (XXABCXXXX)"
                className="form-control shadow-none"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                }}
              />
            </div>

            <div className="form-group my-3">
              <label htmlFor="nickname" className="form-label">
                Nickname
              </label>
              <input
                type="text"
                name="nickname"
                placeholder="Nickname"
                className="form-control shadow-none"
                value={nickName}
                onChange={(e) => {
                  setNickName(e.target.value);
                }}
              />
            </div>
            {width > 992 && (
              <div>
                <button
                  type="button"
                  className="btn btn-block shadow-sm"
                  onClick={register}
                >
                  Register
                </button>
                {error !== "" && (
                  <p
                    className={`alert alert-${
                      error === "Registration Successful" ? "success" : "danger"
                    } my-3`}
                  >
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className={`col${width < 992 ? "-md-auto" : ""}`}>
            {width > 992 && (
              <div style={{ visibility: "hidden" }}>
                <h3>Register</h3>
                <p>Not a user yet? Sign up now!</p>
              </div>
            )}

            <div className="form-group my-3">
              <label htmlFor="email" className="form-label">
                Student Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Student Email"
                className="form-control shadow-none"
                value={studentEmail}
                onChange={(e) => {
                  setStudentEmail(e.target.value);
                }}
              />
            </div>

            <div className="form-group my-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control shadow-none"
                style={{ borderRadius: "5px 5px 0px 0px" }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                className="form-control shadow-none"
                onFocus={() => setFocused((oldState) => !oldState)}
                disabled={password === ""}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>

            {width < 992 && (
              <div>
                <button
                  type="button"
                  className="btn btn-block shadow-sm my-3"
                  onClick={register}
                >
                  Register
                </button>
                <p className={`alert alert-success my-3`}>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginAndRegister;
