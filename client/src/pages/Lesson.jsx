import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Download, Clock, BookOpen } from 'lucide-react';
import api from '../services/api';
import { exportToPdf } from '../utils/pdfGenerator';

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto py-8 animate-pulse">
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="mb-8">
        <div className="aspect-video bg-gray-200 rounded-lg"></div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

// Enhanced content renderer with better styling
const renderContent = (content) => {
  if (!Array.isArray(content)) {
    return (
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed">{content}</p>
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      {content.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 
                key={index} 
                className="text-3xl font-bold text-gray-800 mt-8 mb-4 border-b border-gray-200 pb-2"
              >
                {block.content}
              </h2>
            );
          case 'h3':
            return (
              <h3 
                key={index} 
                className="text-2xl font-semibold text-gray-700 mt-6 mb-3"
              >
                {block.content}
              </h3>
            );
          case 'p':
            return (
              <p 
                key={index} 
                className="mb-4 text-gray-700 leading-relaxed text-lg"
              >
                {block.content}
              </p>
            );
          case 'code':
            return (
              <div key={index} className="mb-6">
                <pre className="bg-gradient-to-br from-gray-900 to-gray-800 text-green-400 p-6 rounded-lg overflow-x-auto border border-gray-700 shadow-inner">
                  <code className="text-sm font-mono">{block.content}</code>
                </pre>
              </div>
            );
          case 'ul':
            return (
              <ul key={index} className="mb-4 space-y-2">
                {block.items?.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={index} className="mb-4 space-y-2 counter-reset">
                {block.items?.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="text-blue-500 mr-2 font-semibold">{itemIndex + 1}.</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ol>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const Lesson = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) {
        setError('Lesson ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/api/lessons/${id}`);
        setLesson(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load lesson. The content may be generating, please refresh in a moment.');
        console.error('Error fetching lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleExport = async () => {
    if (!lesson) return;
    
    try {
      setIsExporting(true);
      await exportToPdf('lesson-content', lesson.title);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Lesson</div>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-600 text-xl">📚 Lesson not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="mb-8">
          <Link 
            to={`/course/${lesson.course}`} 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to {lesson.courseName || 'Course'} Outline
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-3 leading-tight">
                  {lesson.title}
                </h1>
                {lesson.description && (
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    {lesson.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {lesson.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration} min</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Lesson</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link 
                  to={`/edit-lesson/${id}`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Lesson
                </Link>
              </div>
            </div>

            {/* Video Section */}
            {lesson.youtubeVideoId && (
              <div className="mb-8 group">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-gray-900">
                  <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${lesson.youtubeVideoId}?rel=0&modestbranding=1`}
                    title={`${lesson.title} - Video Lesson`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div id="lesson-content" className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8 lg:p-12">
            {renderContent(lesson.content)}
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-600">
              <span className="font-medium">Ready to export?</span>
              <span className="ml-2">Save this lesson as a PDF for offline reading.</span>
            </div>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              {isExporting ? 'Exporting...' : 'Export to PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;