import "./login.scss";
import { useAuth } from "../../hooks/AuthProvider";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    auth.logIn({ username, password });
    console.log("Login");
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
