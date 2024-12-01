import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { LogIn } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/header";
import Footer from "../../../components/footer";
import { setLogin, setCurrentUser } from "../../state";
import { useSelector } from "react-redux";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token)

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details);
      }

      const userData = await response.json();
      dispatch(setCurrentUser({user: userData}));
    } catch (err) {
      setError(err.message)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      const data = await response.json();
      const token = data.access;
      dispatch(setLogin({ token }));
      await fetchUserData(token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader
            title={
              <Typography
                variant="h5"
                className="flex items-center justify-center gap-2"
              >
                <LogIn className="w-6 h-6" />
                Login to AI Learning Hub
              </Typography>
            }
            subheader={
              <Typography
                variant="body2"
                color="textSecondary"
                className="text-center"
              >
                Welcome back! Please enter your credentials
              </Typography>
            }
          />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Typography
                  variant="body2"
                  color="error"
                  className="text-center"
                >
                  {error}
                </Typography>
              )}
              <div className="space-y-2">
                <TextField
                  id="username"
                  label="Username"
                  type="text"
                  placeholder="john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardActions className="flex flex-col space-y-2">
            <Typography
              variant="body2"
              color="textSecondary"
              className="text-center"
            >
              Don't have an account?{" "}
              <a
                href="/auth/register"
                color="primary"
                size="small"
                className="text-blue-600 hover:underline"
              >
                Sign up
              </a>
            </Typography>
          </CardActions>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
