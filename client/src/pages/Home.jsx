import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic) {
      setError('Please enter a topic to begin.');
      return;
    }
    if (!token) {
      // If user is not logged in, redirect them to login page.
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // The backend returns { courseId: newCourse._id }
      const res = await api.post('/api/courses', { topic });
      navigate(`/course/${res.data.courseId}`);
    } catch (err) {
      setError('Failed to generate the course. The topic might be too broad or there was a server issue. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center px-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Unlock Knowledge with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Turn any topic into a comprehensive, structured course in seconds. What do you want to learn today?
        </p>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl w-full">
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 'The Renaissance' or 'Introduction to Python'"
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-indigo-600 text-white py-4 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 transform hover:scale-105 transition-all duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </div>
            ) : 'Create My Course'}
          </button>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </form>
        
        {!token && (
          <p className="mt-8 text-gray-500">
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in or create an account</Link> to start learning.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;