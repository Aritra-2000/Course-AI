import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Course from './pages/Course';
import Lesson from './pages/Lesson';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import EditCourse from './pages/EditCourse';
import EditLesson from './pages/EditLesson';
import Navbar from './components/UI/Navbar';
import ProtectedRoute from './components/Authentication/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
                  <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-course/:id" element={<EditCourse />} />
            <Route path="/course/:id" element={<Course />} />
            <Route path="/lesson/:id" element={<Lesson />} />
            <Route path="/edit-lesson/:id" element={<EditLesson />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
