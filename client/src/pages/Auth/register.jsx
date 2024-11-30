import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { UserPlus } from "lucide-react";

import Header from "../../../components/header";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(process.env.API_URL + "/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed.");
      }

      const data = await response.json();
      setSuccess(true);
      navigate("/auth/login");
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
                <UserPlus className="w-6 h-6" />
                Create Account
              </Typography>
            }
            subheader={
              <Typography
                variant="body2"
                color="textSecondary"
                className="text-center"
              >
                Join the AI Learning Hub community
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
              {success && (
                <Typography
                  variant="body2"
                  color="primary"
                  className="text-center"
                >
                  Registration successful! Please log in.
                </Typography>
              )}
              <div className="flex justify-between gap-4">
                <TextField
                  id="first_name"
                  label="First Name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  fullWidth
                  required
                  disabled={loading}
                />
                <TextField
                  id="last_name"
                  label="Last Name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  fullWidth
                  required
                  disabled={loading}
                />
              </div>
              <TextField
                id="username"
                label="Username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                fullWidth
                required
                disabled={loading}
              />
              <TextField
                id="signup-email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                fullWidth
                required
                disabled={loading}
              />
              <TextField
                id="signup-password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                fullWidth
                required
                disabled={loading}
              />
              <TextField
                id="confirm-password"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                fullWidth
                required
                disabled={loading}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardActions className="flex flex-col items-center">
            <Typography variant="body2" color="textSecondary">
              Already have an account?{" "}
              <a
                href="/auth/login"
                size="small"
                color="primary"
                className="text-blue-600 hover:underline"
              >
                Login
              </a>
            </Typography>
          </CardActions>
        </Card>
      </div>
    </>
  );
};

export default RegistrationPage;
