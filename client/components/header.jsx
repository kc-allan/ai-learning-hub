import { Layout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
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
            </>
          ) : (
            <>
              <a
                href="/auth/login"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Login
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
