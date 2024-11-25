import React, { useState } from "react";
import {
  BookOpen,
  Brain,
  Layout,
  User,
  LogOut,
  Play,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@mui/material";

import Header from "../../components/header";
import Footer from "../../components/footer";

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

const PricingCard = ({ title, price, features, featured = false }) => (
  <Card
    className={`group hover:shadow-lg transition-all duration-300 ${
      featured ? "border-2 border-blue-500" : ""
    }`}
  >
    <CardContent className="p-6">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-gray-600">/month</span>
      </div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <Brain className="h-4 w-4 mr-2 text-blue-500" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`w-full mt-6 px-4 py-2 rounded-lg font-medium transition-colors
          ${
            featured
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
      >
        Get Started
      </button>
    </CardContent>
  </Card>
);

const LandingPage = () => {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted email:", email);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
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

        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Flexible Learning Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose a plan that fits your learning journey and career goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Starter"
              price={9}
              features={[
                "Access to Basic Courses",
                "Community Forum",
                "Weekly Newsletter",
              ]}
            />
            <PricingCard
              title="Pro"
              price={29}
              features={[
                "All Starter Features",
                "Full Course Library",
                "Hands-on Projects",
                "Monthly Mentor Calls",
              ]}
              featured
            />
            <PricingCard
              title="Enterprise"
              price={99}
              features={[
                "All Pro Features",
                "Team Learning",
                "Custom Learning Paths",
                "Dedicated Support",
              ]}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
