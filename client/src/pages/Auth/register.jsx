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

  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "first_name":
      case "last_name":
        if (value.trim().length < 3) {
          error = "Must be at least 3 characters.";
        } else if (!/^[a-zA-Z]+$/.test(value.trim())) {
          error = "Only letters are allowed.";
        }
        break;
      case "username":
        if (value.trim().length < 4) error = "Must be at least 4 characters.";
        break;
      case "email":
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          error = "Invalid email format.";
        break;
      case "password":
        if (
          !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
        ) {
          error =
            "Password must be at least 8 characters, with one uppercase, one number, and one special character.";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password)
          error = "Passwords do not match.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setFormData({ ...formData, [field]: value });

    const fieldError = validateField(field, value);
    setFormErrors({ ...formErrors, [field]: fieldError });
  };

  const isFormValid = () => {
    return Object.values(formErrors).every((error) => !error) &&
      Object.values(formData).every((value) => value.trim() !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError("Please fix the errors in the form.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/v1/auth/register",
        {
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
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed.");
      }

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
                  label="First Name"
                  value={formData.first_name}
                  onChange={handleChange("first_name")}
                  error={!!formErrors.first_name}
                  helperText={formErrors.first_name}
                  fullWidth
                  required
                  disabled={loading}
                />
                <TextField
                  label="Last Name"
                  value={formData.last_name}
                  onChange={handleChange("last_name")}
                  error={!!formErrors.last_name}
                  helperText={formErrors.last_name}
                  fullWidth
                  required
                  disabled={loading}
                />
              </div>
              <TextField
                label="Username"
                value={formData.username}
                onChange={handleChange("username")}
                error={!!formErrors.username}
                helperText={formErrors.username}
                fullWidth
                required
                disabled={loading}
              />
              <TextField
                label="Email"
                value={formData.email}
                onChange={handleChange("email")}
                error={!!formErrors.email}
                helperText={formErrors.email}
                fullWidth
                required
                disabled={loading}
              />
              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                error={!!formErrors.password}
                helperText={formErrors.password}
                fullWidth
                required
                disabled={loading}
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                fullWidth
                required
                disabled={loading}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading || !isFormValid()}
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
