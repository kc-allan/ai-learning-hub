import { Layout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../src/state";


const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.token);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/');
  }
  return (
    <header className="sticky justify-center items-center mb-8 top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <a href="/" className="cursor-pointer flex items-center gap-2">
          <Layout className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-blue-500">
            AI Learning Hub
          </span>
        </a>
        <nav className="flex items-center gap-4">
          {isAuth ? (
            <>
            <a
                href="/dashboard"
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </a>
              <a
                href="/community"
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Community
              </a>
              <a
                href="/courses"
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Courses
              </a>
              <button
                onClick={() => handleLogout()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-red-600"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <a
                href="/auth/login"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Login
              </a>
              <a
                href="/auth/register"
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Courses
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
