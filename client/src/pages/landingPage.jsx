import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Brain,
  Layout,
  User,
  LogOut,
  Play,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setLogout } from "../state";

import Header from "../../components/header";
import Footer from "../../components/footer";
import PaymentPlanModal from "../../components/paymentPlanModal";

const FeatureCard = ({ icon, title, description }) => (
  <Card className="group hover:shadow-lg transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="text-blue-500">{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PricingCard = ({
  title,
  price,
  features,
  duration,
  featured = false,
}) => (
  <Card
    className={`group hover:shadow-lg transition-all duration-300 ${
      featured ? "border-2 border-blue-500" : ""
    }`}
  >
    <CardContent className="p-6">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-gray-600">/{duration}</span>
      </div>
      <div>{features}</div>
      {/* <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <Brain className="h-4 w-4 mr-2 text-blue-500" />
            {feature}
          </li>
        ))}
      </ul> */}
      <div className="py-2">
        <PaymentPlanModal text={"Get Started"} />
      </div>
    </CardContent>
  </Card>
);

const LandingPage = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/api/v1/payment/plans"
        );

        if (response.status === 401) {
          return disptach(setLogout());
        }
        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }
        const data = await response.json();

        setPlans(data || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Master AI & Machine Learning
              <br />
              <span className="text-blue-500">
                Powered by Intelligent Learning Paths
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Transform your career with cutting-edge AI education. Personalized
              learning tracks, hands-on projects, and expert-led courses.
            </p>
            <a
              href="/auth/register"
              className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Get Started
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose AI Learning Hub?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Elevate your AI skills with our comprehensive, adaptive learning
              ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen size={48} />}
              title="Comprehensive Curriculum"
              description="From beginner to advanced, curated courses covering AI, ML, and Data Science."
            />
            <FeatureCard
              icon={<Play size={48} />}
              title="Hands-on Learning"
              description="Interactive coding labs, real-world projects, and practical assignments."
            />
            <FeatureCard
              icon={<TrendingUp size={48} />}
              title="Adaptive Learning Paths"
              description="Personalized recommendations based on your skills, goals, and progress."
            />
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Flexible Learning Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose a plan that fits your learning journey and career goals.
            </p>
          </div>
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
                  <PricingCard
                    title={plan.name}
                    price={plan.price}
                    duration={plan.duration}
                    features={plan.features}
                    featured={plan.isFeatured}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
