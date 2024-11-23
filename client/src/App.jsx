import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import LandingPage from "./pages/landingPage";
import LoginPage from "./pages/Auth/login";
import RegistrationPage from "./pages/Auth/register";
import HomePage from "./pages/homePage";
import Dashboard from "./pages/Dashboard";
import CourseDetailPage from "./pages/CourseDetail";

import { NotFoundPage } from "./pages/Errors";

function App() {
  const isAuth = Boolean(useSelector((state) => state.token))
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegistrationPage />} />
          <Route path="/courses" element={isAuth ? <HomePage /> : <LoginPage /> } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course/:courseId" element={isAuth ?  <CourseDetailPage /> : <LoginPage /> } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
