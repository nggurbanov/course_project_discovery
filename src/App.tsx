import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { GuidePage } from './pages/GuidePage';
import { FavoritesPage } from './pages/FavoritesPage';

// Scroll to top on route change unless a page handles its own scroll restoration
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const noScrollRestorePages = ['/projects', '/favorites'];
    if (!noScrollRestorePages.includes(location.pathname)) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Router basename="/course_project_discovery">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/guide" element={<GuidePage />} />
      </Routes>
    </Router>
  );
}

export default App;
