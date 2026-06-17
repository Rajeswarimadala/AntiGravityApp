import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 mb-4">
        404
      </h1>
      <h2 className="text-3xl font-bold text-text mb-4">Page Not Found</h2>
      <p className="text-text/70 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button size="lg">Back to Home</Button>
      </Link>
    </div>
  );
};
