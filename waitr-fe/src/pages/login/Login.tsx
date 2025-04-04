import "./login.scss";
import { useAuth } from "../../hooks/AuthProvider";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    auth?.logIn({ username, password }).then(() => {
      navigate({ to: "/dashboard" });
    });
  };

  return (
    <div className="container">
      <form
        className="middle-column-container"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className="input-label">
          <label htmlFor="username">Username:</label>
          <input
            className="input-txt"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-label">
          <label htmlFor="password">Password:</label>
          <input
            className="input-txt"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
