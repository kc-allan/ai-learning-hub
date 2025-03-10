import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Brain,
  Code,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import Footer from "../../components/footer";
import Header from "../../components/header";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLogout } from "../state";
import PaymentPlanModal from "../../components/paymentPlanModal";

const CourseCard = ({ course, onClick }) => {
  const getLevelIcon = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return <Brain className="w-10 h-10" />;
      case "intermediate":
        return <Code className="w-10 h-10" />;
      case "advanced":
        return <BookOpen className="w-10 h-10" />;
      default:
        return <Brain className="w-10 h-10" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onClick(course)}
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {course.is_premium && (
          <span className="absolute top-2 right-2 px-2 py-1 text-sm font-medium bg-amber-500 text-white rounded-full">
            Premium
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`${
              course.is_premium ? "text-amber-500" : "text-blue-500"
            }`}
          >
            {getLevelIcon(course.level)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {course.description}
            </p>
            <div className="flex gap-2">
              <span
                className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getLevelColor(
                  course.level
                )}`}
              >
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </span>
              {/* <span className="inline-flex px-2 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                {course.total_modules || 0} Modules
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-48 bg-gray-200 animate-pulse" />
        <div className="p-6">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-4" />
        </div>
      </div>
    ))}
  </div>
);

const ModuleDetails = ({ module, isOpen, onToggle }) => {
  return (
    <div className="bg-gray-100 rounded-lg mb-2 overflow-hidden">
      <div
        className="p-3 flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span>{module.title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="text-gray-500" />
        ) : (
          <ChevronDown className="text-gray-500" />
        )}
      </div>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen
            ? "max-h-96 opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="p-4 bg-white border-t">
          <p className="text-gray-700 mb-4">{module.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Assignments</h4>
              <span className="text-blue-800 font-bold">
                {module.module_assignments.length || 0}
              </span>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Quizzes</h4>
              <span className="text-green-800 font-bold">
                {module.quizzes.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseModules, setCourseModules] = useState(null);
  const [openModuleIndex, setOpenModuleIndex] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const isPremium = useSelector((state) => state.user?.is_premium);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/courses");
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const userProgressResponse = await fetch(import.meta.env.VITE_API_URL + "/api/v1/user/progress", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        {
          userProgressResponse.status === 401 && dispatch(setLogout());
        }
        if (!userProgressResponse.ok) {
          const errorData = await userProgressResponse.json();
          throw new Error(errorData);
        }
        const data = await userProgressResponse.json();
        setUserProgress(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUserProgress();
  }, []);

  const fetchCourseModules = async (courseId) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/v1/course/${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch course modules");
      const data = await response.json();

      setCourseModules(data.modules);
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCourseModules(null);
    fetchCourseModules(course.id);
    setOpenModuleIndex(null);
  };

  const handleModuleToggle = (index) => {
    setOpenModuleIndex(openModuleIndex === index ? null : index);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "all"
        ? true
        : course.level.toLowerCase() === selectedLevel.toLowerCase();
    return matchesSearch && matchesLevel;
  });

  const enrolledCourses = userProgress?.map((course) => {
    return course.course_details.course_id;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Welcome back!</h1>
          <p className="mt-2 text-xl text-gray-600">
            Continue your journey in AI and Machine Learning
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full sm:w-[200px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <h3 className="font-semibold">Error</h3>
              <p>{error}. Please try refreshing the page.</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
              <h3 className="font-semibold">No Courses Found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={handleCourseClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedCourse && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-[600px] w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{selectedCourse.title}</h2>
            <p className="text-gray-600 mb-6">{selectedCourse.description}</p>

            <div className="mb-4">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold mb-2">Course Modules</h3>
                <span className="inline-flex px-2 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                  {courseModules ? courseModules.length : 0} Modules
                </span>
              </div>
              {courseModules ? (
                <ul className="space-y-2">
                  {courseModules.map((module, index) => (
                    <ModuleDetails
                      key={module.id}
                      module={module}
                      isOpen={openModuleIndex === index}
                      onToggle={() => handleModuleToggle(index)}
                    />
                  ))}
                </ul>
              ) : (
                <div className="bg-gray-100 p-3 rounded-lg text-center text-gray-600">
                  Loading modules...
                </div>
              )}
            </div>

            {(selectedCourse.is_premium && isPremium) ||
            !selectedCourse.is_premium ? (
              <>
                {enrolledCourses.includes(selectedCourse.id) ? (
                  <div>
                    <button
                      className="flex-1 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => {
                        navigate(`/course/${selectedCourse.id}`);
                      }}
                    >
                      View
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => {
                        navigate(`/course/${selectedCourse.id}`);
                      }}
                    >
                      Enroll Now
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                      onClick={() => setSelectedCourse(null)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full flex justify-center items-center">
                <PaymentPlanModal
                  text={"Upgrade to Premium to access this course"}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default HomePage;
