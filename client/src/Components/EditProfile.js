import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

import { PORT } from "../constants/Port";

const EditProfile = ({ user }) => {
  const { authState, setAuthState } = useContext(AuthContext);

  const [fullname, setFullname] = useState(user.full_name || "");
  const [nickname, setNickname] = useState(user.nick_name || "");
  const [email, setEmail] = useState(user.student_email || "");
  const [bio, setBio] = useState(user.description || "");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [disableUpdate, setDisableUpdate] = useState(true);

  useEffect(() => {
    if (
      fullname === user.full_name &&
      nickname === user.nick_name &&
      email === user.student_email &&
      (bio === user.description || bio === "")
    ) {
      setDisableUpdate(true);
    } else {
      setDisableUpdate(false);
    }
  }, [fullname, nickname, email, bio]);

  const submitQuestion = (e) => {
    e.preventDefault();
    if (fullname === "") {
      setError("Name is required");
    } else if (nickname === "") {
      setError("Nickname is required");
    } else if (email === "") {
      setError("Email is required");
    } else if (password === "") {
      setError("Password is required");
    } else {
      setDisableUpdate(true);
      axios
        .post(`${PORT}user/updateuser`, {
          id: user.id,
          fullname: fullname,
          nickname: nickname,
          email: email,
          bio: bio,
          password: password,
        })
        .then((response) => {
          if (response.data.message == "profile_updated") {
            setAuthState({ ...authState, nick_name: nickname });
            setError("Profile updated");
          } else {
            setError(response.data.message);
          }
          setDisableUpdate(false);
        })
        .catch((err) => {});
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="modal fade"
      id="editProfileModal"
      data-bs-keyboard="false"
      data-bs-backdrop="static"
      tabIndex="-1"
      aria-labelledby="editProfileModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
          style={{ borderRadius: 10, padding: "0px 10px" }}
        >
          <div className="modal-header">
            <h4>
              <strong>Edit Profile</strong>
            </h4>
            <button
              type="button"
              className="btn-close shadow-none"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                className="form-control shadow-none"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => {
                  setFullname(e.target.value);
                }}
              />
            </div>

            <div className="form-group my-3">
              <label htmlFor="nickName" className="form-label">
                Nickname
              </label>
              <input
                type="text"
                name="nickName"
                className="form-control shadow-none"
                placeholder="Update your nick name"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
              />
            </div>

            <div className="form-group my-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control shadow-none"
                placeholder="Update your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="form-group my-3">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <textarea
                className="form-control"
                style={{ resize: "none" }}
                name="bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
                rows="2"
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
            </div>

            <div className="hstack my-3">
              {error != "" ? (
                <p
                  className={`alert alert-${
                    error === "Profile updated" ? "success" : "danger"
                  } ms-auto`}
                >
                  {error}
                </p>
              ) : (
                <p className="ms-auto" />
              )}
              <span className="">
                <button
                  className="btn btn-block shadow-none"
                  disabled={disableUpdate}
                  onClick={submitQuestion}
                >
                  Update
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
