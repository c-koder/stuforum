import axios from "axios";
import { useState, useEffect } from "react";

const useUser = (nick_name) => {
  const [userResponse, setUserResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("https://stuforum.herokuapp.com/api/user/getuser", {
        nick_name: nick_name,
      })
      .then((res) => {
        setUserResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { userResponse };
};

export default useUser;
