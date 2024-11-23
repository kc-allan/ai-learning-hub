import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '../../components/header'
import { 
  Home, 
  BookOpen, 
  Activity, 
  Award, 
  TrendingUp, 
  Zap 
} from 'lucide-react'
import { Link } from 'react-router-dom'

const learningPaths = [
  { 
    id: 1, 
    title: 'Machine Learning Fundamentals', 
    progress: 65, 
    modules: 4, 
    icon: <Zap className="text-blue-500" />
  },
  { 
    id: 2, 
    title: 'Deep Learning Specialization', 
    progress: 35, 
    modules: 6, 
    icon: <TrendingUp className="text-green-500" />
  }
]

const recentCourses = [
  { 
    id: 1, 
    title: 'Python for Data Science', 
    progress: 75, 
    lastAccessed: '2 hours ago' 
  },
  { 
    id: 2, 
    title: 'Neural Networks Basics', 
    progress: 45, 
    lastAccessed: 'Yesterday' 
  }
]

const Dashboard = () => {
  const user = useSelector((state) => state.user)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
		<Header/>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile and Quick Stats */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <img 
                src="/api/placeholder/100/100" 
                alt="Profile" 
                className="w-16 h-16 rounded-full mr-4" 
              />
              <div>
                <h2 className="text-xl font-bold">{user?.name || 'Learner'}</h2>
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
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <Award className="mx-auto text-yellow-500" />
                <span className="text-sm">12 Badges</span>
              </div>
              <div>
                <BookOpen className="mx-auto text-green-500" />
                <span className="text-sm">8 Cou</span>
              </div>
              <div>
                <Activity className="mx-auto text-purple-500" />
                <span className="text-sm">42h Learning</span>
              </div>
            </div>
          </div>

          {/* Learning Paths and Progress */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Learning Paths</h3>
              <Link 
                to="/courses" 
                className="text-blue-500 hover:underline"
              >
                Browse More
              </Link>
            </div>

            <div className="space-y-4">
              {learningPaths.map(path => (
                <div 
                  key={path.id} 
                  className="flex items-center bg-gray-100 p-4 rounded-lg"
                >
                  {path.icon}
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <span className="font-semibold">{path.title}</span>
                      <span>{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {path.modules} Modules
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Courses and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Recent Courses</h3>
            {recentCourses.map(course => (
              <div 
                key={course.id} 
                className="flex justify-between items-center py-3 border-b"
              >
                <div>
                  <span className="font-semibold">{course.title}</span>
                  <div className="text-sm text-gray-500">
                    Last accessed: {course.lastAccessed}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">{course.progress}%</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/courses" 
                className="flex items-center bg-blue-50 p-3 rounded-lg hover:bg-blue-100"
              >
                <BookOpen className="mr-3 text-blue-500" />
                New Course
              </Link>
              <Link 
                to="/community" 
                className="flex items-center bg-green-50 p-3 rounded-lg hover:bg-green-100"
              >
                <Home className="mr-3 text-green-500" />
                Community Forum
              </Link>
              <Link 
                to="/progress" 
                className="flex items-center bg-purple-50 p-3 rounded-lg hover:bg-purple-100"
              >
                <Activity className="mr-3 text-purple-500" />
                Performance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;