import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BookOpen,
  Brain,
  Code,
  Video,
  FileText,
  ListChecks,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import Header from "../../components/header";
import Footer from "../../components/footer";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeSection, setActiveSection] = useState('video');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await fetch(`/api/v1/course/${courseId}`);
        if (!response.ok) throw new Error("Failed to fetch course details");
        const data = await response.json();
        setCourseData(data);
        setSelectedModule(data.modules[0]);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    if (courseId) fetchCourseDetail();
  }, [courseId]);

  const getLevelIcon = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return <Brain className="w-5 h-5 md:w-6 md:h-6 text-green-600" />;
      case "intermediate":
        return <Code className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />;
      case "advanced":
        return <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />;
      default:
        return <Brain className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />;
    }
  };

  const renderModuleNavigation = () => {
    if (!courseData) return null;

    return (
      <div
        className={`
        fixed md:static inset-y-0 left-0 z-30 
        transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        bg-white border-r w-64 p-4 overflow-y-auto
      `}
      >
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-xl font-bold">Modules</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
        {courseData.modules.map((module) => (
          <div
            key={module.id}
            className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
              selectedModule?.id === module.id
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-gray-100"
            }`}
            onClick={() => {
              setSelectedModule(module);
              setIsSidebarOpen(false);
            }}
          >
            <h3 className="font-semibold">{module.title}</h3>
          </div>
        ))}
      </div>
    );
  };

  const fetchQuiz = async (quizId) => {
    try {
      const response = await fetch(`/api/v1/quiz/${quizId}/questions`);
      if (!response.ok) throw new Error("Failed to fetch quiz details");
      const data = await response.json();
      setQuizData(data);
      setActiveQuizId(quizId);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizSubmitted(false);
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    let correctAnswers = 0;
    quizData.forEach((question) => {
      if (selectedAnswers[question.id] === question.correct_answer_id) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / quizData.length) * 100);
  };

  const renderQuizContent = () => {
    console.log(quizData);
    
    if (!quizData) return null;

    if (quizSubmitted) {
      console.log(selectedAnswers);
      
      const score = calculateScore();
      return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                score >= 70
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {score >= 70 ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
            </div>
            <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
            <p className="text-gray-600">Your score: {score}%</p>
          </div>

          <div className="space-y-6">
            {quizData.map((question, index) => {
              const isCorrect =
                selectedAnswers[question.id] === question.correct_answer_id;
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg ${
                    isCorrect
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <p className="font-medium mb-3">
                    Question {index + 1}: {question.text}
                  </p>
                  <div className="space-y-2">
                    {question.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className={`flex items-center ${
                          answer.id === question.correct_answer_id
                            ? "text-green-700"
                            : answer.id === selectedAnswers[question.id]
                            ? "text-red-700"
                            : "text-gray-600"
                        }`}
                      >
                        {answer.id === question.correct_answer_id && (
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        )}
                        {answer.id === selectedAnswers[question.id] &&
                          answer.id !== question.correct_answer_id && (
                            <XCircle className="w-4 h-4 mr-2 text-red-600" />
                          )}
                        <span>{answer.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setQuizData(null);
                setActiveQuizId(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close Quiz
            </button>
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedAnswers({});
                setQuizSubmitted(false);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry Quiz
            </button>
          </div>
        </div>
      );
    }

    
    const currentQuestion = quizData[currentQuestionIndex];
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            Question {currentQuestionIndex + 1} of {quizData.length}
          </h3>
          <div className="text-sm text-gray-600">
            {Math.round(
              (currentQuestionIndex / quizData.length) * 100
            )}
            % Complete
          </div>
        </div>

        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (currentQuestionIndex / quizData.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg font-medium mb-4">{currentQuestion.text}</p>
          <div className="space-y-3">
            {currentQuestion.question_options.map((answer) => (
              <button
                key={answer.id}
                onClick={() =>
                  handleAnswerSelect(currentQuestion.id, answer.id)
                }
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  selectedAnswers[currentQuestion.id] === answer.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {answer.text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-600 disabled:text-gray-400"
          >
            Previous
          </button>
          {currentQuestionIndex === quizData.length - 1 ? (
            <button
              onClick={() => setQuizSubmitted(true)}
              disabled={
                Object.keys(selectedAnswers).length !==
                quizData.length
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              disabled={!selectedAnswers[currentQuestion.id]}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderModuleContent = () => {
    if (!selectedModule) return null;

    return (
      <div className="flex-1 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold">
            {selectedModule.title}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-full ${
                activeSection === "video"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveSection("video")}
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-full ${
                activeSection === "content"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveSection("content")}
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-full ${
                activeSection === "quiz"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveSection("quiz")}
            >
              <ListChecks className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeSection === "video" && (
          <div className="bg-black rounded-lg overflow-hidden aspect-video">
            <iframe
              src={selectedModule.video_url.replace("watch?v=", "embed/")}
              className="w-full h-full"
              title={selectedModule.title}
              allowFullScreen
            />
          </div>
        )}

        {activeSection === "content" && (
          <div className="prose max-w-none">
            <p>{selectedModule.content}</p>
          </div>
        )}

        {activeSection === "quiz" && (
          <div>
            {quizData ? (
              renderQuizContent()
            ) : selectedModule.quizzes.length > 0 ? (
              <div className="space-y-4">
                {selectedModule.quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">{quiz.title}</h3>
                    <button
                      onClick={() => fetchQuiz(quiz.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center">
                <AlertCircle className="mr-3 text-yellow-600 flex-shrink-0" />
                <p className="text-yellow-800">
                  No quizzes available for this module.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCourseHeader = () => {
    if (!courseData) return null;

    return (
      <>
        <Header />
        <div className="bg-white border-b p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start sm:items-center">
              <button
                className="md:hidden mr-4 p-2 hover:bg-gray-100 rounded"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <img
                src={courseData.course.thumbnail}
                alt={courseData.course.title}
                className="w-12 h-12 md:w-16 md:h-16 rounded-lg mr-4"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  {courseData.course.title}
                </h1>
                <div className="flex flex-wrap items-center mt-2 gap-2">
                  {getLevelIcon(courseData.course.level)}
                  <span className="text-gray-600">
                    {courseData.course.level.charAt(0).toUpperCase() +
                      courseData.course.level.slice(1)}{" "}
                    Level
                  </span>
                  {courseData.course.is_premium && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg">
              Download Course Materials
            </button>
          </div>
        </div>
      </>
    );
  };

  if (!courseData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {renderCourseHeader()}
      <div className="flex flex-1 overflow-hidden">
        {renderModuleNavigation()}
        {renderModuleContent()}
      </div>
    </div>
  );
};

export default CourseDetailPage;