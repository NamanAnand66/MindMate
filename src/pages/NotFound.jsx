import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center">
        <div className="mx-auto h-24 w-24 bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-300 rounded-full flex items-center justify-center">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white">
          404 - Page Not Found
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;