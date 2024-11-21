import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useSelector } from "react-redux"


import LoginPage from "./pages/Auth/login";
import RegistrationPage from "./pages/Auth/register";

function App() {

  return (
    <div className="app">
      <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<LoginPage/>} />
            <Route path="/auth/register" element={<RegistrationPage/>} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
