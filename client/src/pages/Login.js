import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { PORT } from "../constants/Port";
import { AuthContext } from "../helpers/AuthContext";

const Login = ({ socket }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  const [error, setError] = useState("");

  const login = (e) => {
    e.preventDefault();
    if (username === "" && password === "") {
      setError("Please fill all the fields");
    } else if (username === "") {
      setError("Student ID/Email is required");
    } else if (password === "") {
      setError("Password is required");
    } else {
      const time = moment().format("YYYY-MM-DD HH:mm:ss").toString();
      axios
        .post(`${PORT}user/login`, {
          username: username,
          password: password,
          time: time,
        })
        .then((response) => {
          if (response.data.message != null) {
            setError(response.data.message);
          } else {
            localStorage.setItem("accessToken", response.data.token);
            setAuthState({
              nick_name: response.data.nick_name,
              id: response.data.id,
              status: true,
            });
            navigate("/home");
          }
        })
        .catch((err) => console.log(err));
      setPassword("");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h3>Login</h3>
      <p>Find the answer to your question!</p>
      <form onSubmit={login}>
        <div className="form-group my-3">
          <label htmlFor="credential" className="form-label">
            Credential
          </label>
          <input
            type="text"
            name="credential"
            placeholder="Credential"
            className="form-control shadow-none"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
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
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button type="submit" className="btn btn-block shadow-sm">
          Login
        </button>
      </form>

      {error !== "" && <p className="alert alert-danger my-3">{error}</p>}
    </div>
  );
};

export default Login;
