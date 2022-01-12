import axios from "axios";
import { useState, useEffect } from "react";

const useUser = (nick_name) => {
  const [userResponse, setUserResponse] = useState(null);
  const fetchData = () => {
    axios.post("http://localhost:3001/getuser", { nick_name: nick_name }).then((res) => {
      setUserResponse(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { userResponse };
};

export default useUser;
