import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import Navbar from "./Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student"); // Default role
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      setError("Please fill in all the fields.");
      return;
    }

    try {
      if (role !== "Admin" && role !== "Student") {
        setError("Invalid role selected.");
        return;
      }

      // Check if the credentials match the admin's credentials
      if (email === "admin@admin.com" && password === "admin" && role === "Admin") {
        // If credentials match for Admin, allow login and navigate to admin dashboard
        localStorage.setItem("token", "admin-token"); // You can assign a token here, or leave as mock
        localStorage.setItem("email", email);
        localStorage.setItem("role", "Admin");

        setUser({
          name: "Admin",
          email: email,
          role: "Admin",
        });

        navigate("/admin-dashboard");
        return; 
      }

      // For Student login, proceed with normal backend authentication
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),  // Send role to backend
      });

      if (response.ok) {
        const data = await response.json();

        if (!data.token) {
          setError("Invalid email or password.");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);

        const userDetailsResponse = await fetch(
          `http://localhost:8080/api/users/details?email=${email}`
        );

        if (userDetailsResponse.ok) {
          const ud = await userDetailsResponse.json();

          if (!ud || !ud.username) {
            setError("User not found.");
            return;
          }

          localStorage.setItem("name", ud["username"]);
          localStorage.setItem("id", ud["id"]);
          localStorage.setItem("role", role);  

          setUser({
            name: ud["username"],
            email: email,
            id: ud["id"],
            role,
          });

          // Redirect based on role
          if (email === "admin@admin.com" && password === "admin") {
            navigate("/admin-dashboard");
          } else if(role === "Student") {
            navigate("/courses");
          }
        } else {
          setError("An error occurred while fetching user details.");
        }
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred during login.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth">
        <div className="container">
          <h3>Welcome!</h3>
          <br />
          <h2>Login</h2>
          <br />
          <form autoComplete="off" className="form-group" onSubmit={login}>
            <label htmlFor="email">Email Id :</label>
            <input
              type="email"
              className="form-control"
              style={{ width: "100%", marginRight: "50px" }}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <br />
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              className="form-control"
              style={{ width: "100%" }}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <br />
            <br />
            
            <br />
            <div className="btn1">
              <button type="submit" className="btn btn-success btn-md mybtn">
                LOGIN
              </button>
            </div>
          </form>
          {error && <span className="error-msg">{error}</span>}
          <br />
          <span>
            Don't have an account? Register
            <Link to="/register"> Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
