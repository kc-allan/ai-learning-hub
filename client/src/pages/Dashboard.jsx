import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import Header from "../../components/header";
import { setLogout } from "../state";
import { Home, BookOpen, Activity, Award, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const learningPaths = [
  {
    id: 1,
    title: "Machine Learning Fundamentals",
    progress: 65,
    modules: 4,
    icon: <Zap className="text-blue-500" />,
  },
  {
    id: 2,
    title: "Deep Learning Specialization",
    progress: 35,
    modules: 6,
    icon: <TrendingUp className="text-green-500" />,
  },
];

const recentCourses = [
  {
    id: 1,
    title: "Python for Data Science",
    progress: 75,
    lastAccessed: "2 hours ago",
  },
  {
    id: 2,
    title: "Neural Networks Basics",
    progress: 45,
    lastAccessed: "Yesterday",
  },
];

const Dashboard = () => {
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("overview");
  const [userProgress, setUserProgress] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  }

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const response = await fetch(`/api/v1/user/progress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          return dispatch(setLogout());
        }
        if (!response.ok) throw new Error("Failed to fetch user progress");
        const data = await response.json();
        setUserProgress(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchUserProgress();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <Header />
      <div className="container mx-auto max-w-7xl">
        {/* Top Section: Profile and Enrolled Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile and Quick Stats */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <img
                src="/api/placeholder/100/100"
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-bold">
                  {user?.first_name || user?.last_name
                    ? toTitleCase(`${user?.first_name} ${user?.last_name}`)
                    : user?.username || "Learner"}
                </h2>
                <p className="text-gray-500">AI & Machine Learning Track</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Profile Completion</span>
                <span className="font-bold">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <Award className="mx-auto text-yellow-500 w-6 h-6" />
                <span className="text-sm block mt-1">12 Badges</span>
              </div>
              <div>
                <BookOpen className="mx-auto text-green-500 w-6 h-6" />
                <span className="text-sm block mt-1">
                  {userProgress?.length || 0}{" "}
                  {userProgress?.length === 1 ? "Course" : "Courses"}
                </span>
              </div>
              <div>
                <Activity className="mx-auto text-purple-500 w-6 h-6" />
                <span className="text-sm block mt-1">42h Learning</span>
              </div>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Enrolled Courses</h3>
              <Link to="/courses" className="text-blue-500 hover:underline">
                Browse More
              </Link>
            </div>

            {userProgress?.length > 0 ? (
              <div className="space-y-4">
                {userProgress?.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() =>
                      navigate(`/course/${course.course_details.course_id}`)
                    }
                  >
                    {course.icon && <div className="mr-4">{course.icon}</div>}
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold truncate max-w-[70%]">
                          {course.course_details.title}
                        </span>
                        <span className="text-sm">
                          {course.percent_complete}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${course.percent_complete}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {course.total_modules} Modules
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-lg font-medium">No enrolled courses yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Check out our latest{" "}
                  <Link to="/courses" className="text-blue-500 font-semibold">
                    courses
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Recent Courses and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Recent Courses</h3>
            {!userProgress || userProgress.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-lg font-medium">Nothing here</p>
                <p className="text-sm text-gray-400 mt-1">
                  You have not enrolled in any courses
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userProgress?.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b last:border-b-0"
                  >
                    <div className="mb-2 sm:mb-0">
                      <span className="font-semibold block">
                        {course.course_details.title}
                      </span>
                      <div className="text-sm text-gray-500">
                        Last accessed:{" "}
                        {format(
                          new Date(course.last_accessed),
                          "dd-MMM-yyyy HH:mm"
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm">
                        {course.percent_complete}%
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${course.percent_complete}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/courses"
                className="flex items-center bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <BookOpen className="mr-3 text-blue-500" />
                New Course
              </Link>
              <Link
                to="/community"
                className="flex items-center bg-green-50 p-3 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Home className="mr-3 text-green-500" />
                Community Forum
              </Link>
              <Link
                to="/progress"
                className="flex items-center bg-purple-50 p-3 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Activity className="mr-3 text-purple-500" />
                Performance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
