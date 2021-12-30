import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Login = () => {
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
      Axios.post("http://localhost:3001/login", {
        username: username,
        password: password,
      }).then((response) => {
        if (response.data.err) {
          setError("Error : SFX0001");
        } else if (response.data.message === "user_not_found")
          setError("Account not found");
        else if (response.data.message === "wrong_password")
          setError("Invalid username/password");
        else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            name: response.data.name,
            id: response.data.id,
            status: true,
            join_date: response.data.join_date,
            description: response.data.description,
            likes: response.data.likes,
          });
          navigate("/home");
        }
      });
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
        <div className="form-control">
          <label>Username</label>
          <input
            type="text"
            placeholder="Email or Student ID"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
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

        <button
          type="submit"
          style={{ marginLeft: 5 }}
          className="btn btn-block"
        >
          Login
        </button>
      </form>

      <div id="error" className={error !== "" ? "error active" : "error"}>
        {error}
      </div>
    </div>
  );
};

export default Login;
