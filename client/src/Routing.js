import LogReg from "./pages/LogReg";
import Home from "./pages/Home";
import SinglePost from "./pages/SinglePost";
import MyAnswers from "./pages/MyAnswers";
import MyQuestions from "./pages/MyQuestions";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import Tags from "./pages/Tags";
import Navbar from "./Components/Navbar";
import ViewUser from "./pages/ViewUser";
import { useState, useEffect } from "react";
import { AuthContext } from "./helpers/AuthContext";
import axios from "axios";

const Routing = () => {
  const [authState, setAuthState] = useState({
    name: "",
    id: 0,
    status: null,
    join_date: "",
    description: "",
    likes: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            name: response.data.name,
            id: response.data.id,
            status: true,
            join_date: response.data.join_date,
            description: response.data.description,
            likes: response.data.likes,
          });
        }
      });
  }, []);

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ ...authState, status: false });
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <Navbar isLogged={authState.status} onLogout={onLogout} />

        <Routes>
          <Route
            exact
            path="/"
            element={!authState.status ? <LogReg /> : <Navigate to={"/home"} />}
          />

          <Route
            path="/home"
            element={authState.status ? <Home /> : <Navigate to={"/"} />}
          />

          {authState.status !== null && (
            <>
              <Route
                path="/myquestions"
                element={
                  authState.status ? <MyQuestions /> : <Navigate to={"/"} />
                }
              />

              <Route
                path="/myanswers"
                element={
                  authState.status ? <MyAnswers /> : <Navigate to={"/"} />
                }
              />

              <Route
                path="/post/:id"
                element={
                  authState.status ? <SinglePost /> : <Navigate to={"/"} />
                }
              />

              <Route
                path="/home/tagged/:name"
                element={authState.status ? <Home /> : <Navigate to={"/"} />}
              />

              <Route
                path="/myquestions"
                element={
                  authState.status ? <MyQuestions /> : <Navigate to={"/"} />
                }
              />

              <Route
                path="/user/:name"
                element={
                  authState.status ? <ViewUser /> : <Navigate to={"/"} />
                }
              />

              <Route
                path="/profile"
                element={
                  authState.status ? <UserProfile /> : <Navigate to={"/"} />
                }
              />

              <Route
                path="/tags"
                element={authState.status ? <Tags /> : <Navigate to={"/"} />}
              />
            </>
          )}
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default Routing;
