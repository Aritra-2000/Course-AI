import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Play, 
  Trash2, 
  Edit,
  ArrowLeft,
  CheckCircle,
  Circle,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import api from '../services/api';

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 bg-gray-200 rounded-full w-16"></div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
      
      {/* Modules skeleton */}
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(j => (
                <div key={j} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Confirmation Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm, lessonTitle, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Lesson</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "<span className="font-semibold">{lessonTitle}</span>"? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Course = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, lessonId: null, lessonTitle: '', moduleId: null });
  const [completedLessons, setCompletedLessons] = useState(new Set());

  const handleDeleteLesson = async (lessonId, moduleId) => {
    setDeleteModal({ isOpen: false, lessonId: null, lessonTitle: '', moduleId: null });
    setIsDeleting(lessonId);
    
    try {
      await api.delete(`/api/lessons/${lessonId}`);
      setCourse(prevCourse => ({
        ...prevCourse,
        modules: prevCourse.modules.map(module => 
          module._id === moduleId
            ? { ...module, lessons: module.lessons.filter(lesson => lesson._id !== lessonId) }
            : module
        )
      }));
    } catch (err) {
      setError('Failed to delete the lesson. Please try again.');
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const openDeleteModal = (lessonId, lessonTitle, moduleId) => {
    setDeleteModal({ isOpen: true, lessonId, lessonTitle, moduleId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, lessonId: null, lessonTitle: '', moduleId: null });
  };

  const toggleLessonCompletion = (lessonId) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/courses/${id}`);
        setCourse(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load course details.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Course</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-900">Course not found</h2>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedCount = completedLessons.size;
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/Dashboard" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12 text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">{course.title}</h1>
            <p className="text-xl text-blue-100 mb-6 leading-relaxed max-w-3xl">{course.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {course.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full border border-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <BookOpen className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{course.modules.length}</div>
                <div className="text-sm text-blue-100">Modules</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <Play className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalLessons}</div>
                <div className="text-sm text-blue-100">Lessons</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <Clock className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-blue-100">Complete</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <Award className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="text-sm text-blue-100">Finished</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-6 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Course Progress</span>
              <span className="text-sm text-gray-600">{completedCount}/{totalLessons} lessons completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Course Outline */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-600" />
            Course Outline
          </h2>
          
          <div className="space-y-6">
            {course.modules.map((module, moduleIndex) => (
              <div key={module._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {moduleIndex + 1}
                    </div>
                    {module.title}
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div 
                        key={lesson._id} 
                        className="group flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <button
                            onClick={() => toggleLessonCompletion(lesson._id)}
                            className="flex-shrink-0"
                          >
                            {completedLessons.has(lesson._id) ? (
                              <CheckCircle className="w-5 h-5 text-green-500 hover:text-green-600 transition-colors" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                            )}
                          </button>
                          
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                              {lessonIndex + 1}
                            </div>
                            <Link 
                              to={`/lesson/${lesson._id}`} 
                              className="text-gray-800 hover:text-blue-600 transition-colors font-medium flex-1 group-hover:text-blue-700"
                            >
                              {lesson.title}
                            </Link>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/edit-lesson/${lesson._id}`}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Edit lesson"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => openDeleteModal(lesson._id, lesson.title, module._id)}
                            disabled={isDeleting === lesson._id}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete lesson"
                          >
                            {isDeleting === lesson._id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDeleteLesson(deleteModal.lessonId, deleteModal.moduleId)}
        lessonTitle={deleteModal.lessonTitle}
        isDeleting={isDeleting === deleteModal.lessonId}
      />
    </div>
  );
};

export default Course;