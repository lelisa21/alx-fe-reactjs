import React from "react";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-2xl mx-auto p-8">
            <div className="text-center">
              {/* Error Icon */}
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <FiAlertTriangle className="w-20 h-20 text-red-500" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-12 h-12 rounded-full bg-yellow-500 animate-pulse flex items-center justify-center">
                    <span className="text-white font-bold">!</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <h1 className="heading-2 text-red-600 dark:text-red-400 mb-4">
                Oops! Something went wrong
              </h1>

              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                We encountered an unexpected error. Don't worry, our team has
                been notified.
              </p>

              {/* Error Details (for development) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl text-left">
                  <h3 className="font-bold text-red-700 dark:text-red-300 mb-3">
                    Error Details:
                  </h3>
                  <pre className="text-sm text-red-600 dark:text-red-400 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-red-500 hover:text-red-600">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 text-xs text-red-500 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Recovery Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="btn-primary flex items-center justify-center space-x-2 px-8 py-3"
                >
                  <FiRefreshCw className="w-5 h-5" />
                  <span>Reload Application</span>
                </button>

                <Link
                  to="/"
                  className="btn-outline flex items-center justify-center space-x-2 px-8 py-3"
                >
                  <FiHome className="w-5 h-5" />
                  <span>Go to Homepage</span>
                </Link>
              </div>

              {/* Contact Support */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  If the problem persists, please contact our support team
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:support@booklibrary.com"
                    className="text-primary hover:underline"
                  >
                    support@booklibrary.com
                  </a>
                  <span className="text-gray-400 hidden sm:inline">|</span>
                  <a
                    href="https://help.booklibrary.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Help Center
                  </a>
                </div>
              </div>

              {/* Debug Information */}
              <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm text-gray-500">
                  <div>
                    <div className="font-medium">Browser</div>
                    <div>{navigator.userAgent.split(" ")[0]}</div>
                  </div>
                  <div>
                    <div className="font-medium">Online</div>
                    <div>{navigator.onLine ? "🟢 Yes" : "🔴 No"}</div>
                  </div>
                  <div>
                    <div className="font-medium">Timestamp</div>
                    <div>{new Date().toLocaleTimeString()}</div>
                  </div>
                  <div>
                    <div className="font-medium">Version</div>
                    <div>{process.env.REACT_APP_VERSION || "1.0.0"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
