import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box,
  Chip,
  CircularProgress,
  DialogActions,
  Alert,
} from "@mui/material";
import { Check, Star, ErrorOutline } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../src/state";
import { useNavigate } from "react-router-dom";

const PaymentPlanModal = ({ text }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      if (isOpen) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/payment/plans/", {
            Authorization: `Bearer ${token}`,
          });

          if (response.status === 401) {
            return dispatch(setLogout());
          }

          if (!response.ok) {
            // Improved error handling to capture more detailed error information
            const errorData = await response.json();
            throw new Error(errorData.message);
          }

          const plansData = await response.json();
          setPlans(plansData);
        } catch (err) {
          console.error("Failed to fetch payment plans:", err);
          setError(err.message || "An unexpected error occurred");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPlans();
  }, [isOpen, token, dispatch]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleConfirm = async () => {
    if (selectedPlan) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/payment/checkout/", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan_id: selectedPlan.id }),
        });
        
        if (response.status === 401) {
          dispatch(setLogout());
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        const paymentLink = await response.json();
        window.location.href = paymentLink.url;
      } catch (err) {
        console.error("Checkout error:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          {
            token ? setIsOpen(true) : navigate("/auth/login");
          }
        }}
        startIcon={<Star />}
        color="primary"
        variant="default"
        sx={{
          backgroundColor: "gold",
          "&:hover": {
            opacity: "80%",
          },
          borderRadius: 100,
          px: 2,
          py: 1,
          fontWeight: "bold",
        }}
      >
        {text || "Upgrade"}
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          zIndex: 9999999
        }}
      >
        <DialogTitle>Select Your Payment Plan</DialogTitle>

        {/* Prominent Error Display at the Top */}
        {error && (
          <Box sx={{ px: 3, pt: 2 }}>
            <Alert
              severity="error"
              icon={<ErrorOutline />}
              sx={{ width: "100%", mb: 2 }}
            >
              <Typography variant="body1">{error}</Typography>
            </Alert>
          </Box>
        )}

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Choose the plan that best fits your needs and budget
          </DialogContentText>

          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={300}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {plans.map((plan) => (
                <Grid item xs={12} md={4} key={plan.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 3,
                      },
                      ...(selectedPlan?.id === plan.id && {
                        border: "2px solid",
                        borderColor: "primary.main",
                      }),
                      ...(plan.name.toLowerCase() === "gold" && {
                        borderColor: "warning.main",
                        backgroundColor: "warning.light",
                      }),
                    }}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {plan.name.toLowerCase() === "gold" && (
                      <Chip
                        label="Recommended"
                        color="warning"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 1,
                        }}
                      />
                    )}

                    <CardHeader
                      title={
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="h6">{plan.name}</Typography>
                          {selectedPlan?.id === plan.id && (
                            <Check color="primary" />
                          )}
                        </Box>
                      }
                    />

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h4" color="primary" gutterBottom>
                        ${plan.price}
                        <Typography
                          component="span"
                          color="textSecondary"
                          variant="body2"
                        >
                          /{plan.duration}
                        </Typography>
                      </Typography>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        paragraph
                        sx={{ minHeight: 60 }}
                      >
                        {plan.features}
                      </Typography>

                      <Box display="flex" alignItems="center">
                        <Check
                          fontSize="small"
                          color="success"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2">
                          {plan.duration.charAt(0).toUpperCase() +
                            plan.duration.slice(1)}{" "}
                          Access
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setIsOpen(false)}
            color="secondary"
            variant="outlined"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            variant="contained"
            disabled={!selectedPlan || isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Selection"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentPlanModal;
