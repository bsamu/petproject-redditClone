import { React, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../providers/auth";

const Callback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const pathVariables = useParams();

  useEffect(() => {
    const loginWithCode = async () => {
      const params = new URLSearchParams(window.location.search);
      console.log(params);
      const code = params.get("code");
      console.log(code);
      if (code) {
        await login(code, pathVariables.provider);
      }
      navigate("/profile");
    };
    loginWithCode();
    // eslint-disable-next-line
  }, []);

  return <div>Callback</div>;
};

export default Callback;
