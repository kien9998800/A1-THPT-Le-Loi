import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Letters from './pages/Letters';
import Navbar from './components/Navbar';
import IntroCard from './components/IntroCard';
import TransitionCurtain, {
  type TransitionTheme,
  type TransitionPhase,
} from './components/TransitionCurtain';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isIntroPage = location.pathname === '/';
  const isOceanTheme = location.pathname.startsWith('/11A1');

  const [transitionTheme, setTransitionTheme] = useState<TransitionTheme | null>(null);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('covering');
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handleStartTransition = (targetClass: TransitionTheme) => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];

    setTransitionTheme(targetClass);
    setTransitionPhase('covering');

    const navTimer = window.setTimeout(() => {
      navigate(`/${targetClass}`);
      setTransitionPhase('revealing');
    }, 1000);

    const endTimer = window.setTimeout(() => {
      setTransitionTheme(null);
      setTransitionPhase('covering');
    }, 1750);

    timersRef.current.push(navTimer, endTimer);
  };

  return (
    <div
      className={`min-h-screen text-slate-800 overflow-x-hidden flex flex-col ${
        isOceanTheme
          ? 'bg-sky-50 selection:bg-sky-300 selection:text-sky-950'
          : 'bg-rose-50 selection:bg-pink-300 selection:text-pink-900'
      } ${isIntroPage ? '' : 'pt-16'}`}
    >
      {!isIntroPage && <Navbar />}
      <Routes>
        <Route path="/" element={<IntroCard onStartTransition={handleStartTransition} />} />
        <Route path="/:classId" element={<Home />} />
        <Route path="/:classId/blogs" element={<Blog />} />
        <Route path="/:classId/letters" element={<Letters />} />
      </Routes>
      <TransitionCurtain theme={transitionTheme} phase={transitionPhase} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
