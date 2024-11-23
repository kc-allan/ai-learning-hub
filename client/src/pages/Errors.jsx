import React from 'react';
import { Card, Button } from '@mui/material';
import { AlertCircle, Home, Lock, RefreshCcw, Search } from 'lucide-react';

const ErrorLayout = ({ title, description, icon: Icon, illustration, action }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <Card className="max-w-md w-full p-6">
      <div className="text-center">
        <div className="mb-6">{illustration}</div>
        <div className="mb-2">
          <Icon className="mx-auto h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
          {action && (
            <Button 
              onClick={action.onClick}
              className="flex items-center gap-2"
            >
              {action.icon}
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </Card>
  </div>
);

const NotFoundPage = () => (
  <ErrorLayout
    title="Page Not Found"
    description="Oops! The page you're looking for doesn't exist or has been moved."
    icon={Search}
    illustration={
      <svg className="w-64 h-64 mx-auto" viewBox="0 0 200 200">
        <path d="M100 20a80 80 0 1 0 80 80 80 80 0 0 0-80-80zm0 140a60 60 0 1 1 60-60 60 60 0 0 1-60 60z" fill="#E5E7EB"/>
        <path d="M160 160l30 30M100 60v10M100 130v10M60 100h10M130 100h10" stroke="#6B7280" strokeWidth="10" strokeLinecap="round"/>
        <circle cx="100" cy="100" r="20" fill="#EF4444"/>
      </svg>
    }
    action={{
      label: "Search",
      icon: <Search className="w-4 h-4" />,
      onClick: () => window.location.href = '/search'
    }}
  />
);

const ServerErrorPage = () => (
  <ErrorLayout
    title="Server Error"
    description="Sorry! Something went wrong on our end. We're working to fix it."
    icon={AlertCircle}
    illustration={
      <svg className="w-64 h-64 mx-auto" viewBox="0 0 200 200">
        <rect x="40" y="60" width="120" height="80" rx="10" fill="#E5E7EB"/>
        <path d="M50 80h100M60 100h80M70 120h60" stroke="#6B7280" strokeWidth="5" strokeLinecap="round"/>
        <path d="M90 30l20 20M110 30l-20 20" stroke="#EF4444" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="100" cy="140" r="10" fill="#EF4444"/>
      </svg>
    }
    action={{
      label: "Retry",
      icon: <RefreshCcw className="w-4 h-4" />,
      onClick: () => window.location.reload()
    }}
  />
);

const ForbiddenPage = () => (
  <ErrorLayout
    title="Access Denied"
    description="Sorry, you don't have permission to access this page."
    icon={Lock}
    illustration={
      <svg className="w-64 h-64 mx-auto" viewBox="0 0 200 200">
        <rect x="60" y="80" width="80" height="60" rx="5" fill="#E5E7EB"/>
        <path d="M70 80V60a30 30 0 0 1 60 0v20" stroke="#6B7280" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="100" cy="110" r="10" fill="#EF4444"/>
        <path d="M100 120v10" stroke="#EF4444" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    }
    action={{
      label: "Login",
      icon: <Lock className="w-4 h-4" />,
      onClick: () => window.location.href = '/login'
    }}
  />
);

const GenericErrorPage = () => (
  <ErrorLayout
    title="Something Went Wrong"
    description="An unexpected error occurred. Please try again later."
    icon={AlertCircle}
    illustration={
      <svg className="w-64 h-64 mx-auto" viewBox="0 0 200 200">
        <path d="M20 100a80 80 0 1 1 160 0M100 20v160" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round"/>
        <path d="M100 80v40M100 140v10" stroke="#EF4444" strokeWidth="10" strokeLinecap="round"/>
        <circle cx="100" cy="50" r="10" fill="#6B7280"/>
        <path d="M60 150l80-40M60 110l80 40" stroke="#6B7280" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    }
    action={{
      label: "Try Again",
      icon: <RefreshCcw className="w-4 h-4" />,
      onClick: () => window.location.reload()
    }}
  />
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <GenericErrorPage />;
    }

    return this.props.children;
  }
}

// Custom hook for error states
const useErrorPage = (errorCode) => {
  switch (errorCode) {
    case 404:
      return <NotFoundPage />;
    case 500:
      return <ServerErrorPage />;
    case 403:
      return <ForbiddenPage />;
    default:
      return <GenericErrorPage />;
  }
};

export {
  NotFoundPage,
  ServerErrorPage,
  ForbiddenPage,
  GenericErrorPage,
  ErrorBoundary,
  useErrorPage
};