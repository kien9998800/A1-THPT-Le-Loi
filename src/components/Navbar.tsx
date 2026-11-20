import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, NotebookPen, Mail, ArrowLeftRight } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const match = location.pathname.match(/^\/(10A1|11A1|12A1)/);
  const currentClass = match ? match[1] : '10A1';
  const basePath = `/${currentClass}`;
  const isOcean = currentClass === '11A1';

  const links = [
    { path: `${basePath}`, label: 'Trang chủ', icon: <Home className="w-5 h-5" /> },
    { path: `${basePath}/blogs`, label: 'Bảng tin', icon: <NotebookPen className="w-5 h-5" /> },
    { path: `${basePath}/letters`, label: 'Gửi lời nhắn', icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-3 pointer-events-none">
      <div
        className={`max-w-[95vw] sm:max-w-max mx-auto bg-white/85 backdrop-blur-md px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-full shadow-lg border border-white flex items-center gap-1 sm:gap-2 pointer-events-auto overflow-x-auto hide-scrollbar ${
          isOcean ? 'shadow-sky-100/60' : 'shadow-pink-100/50'
        }`}
      >
        {links.map((link) => {
          const isActive =
            link.path === basePath
              ? location.pathname === basePath || location.pathname === `${basePath}/`
              : location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? isOcean
                    ? 'text-sky-600'
                    : 'text-pink-600'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className={`absolute inset-0 rounded-full z-0 ${
                    isOcean ? 'bg-sky-100' : 'bg-pink-100'
                  }`}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-sm sm:text-base">
                {link.icon}
                {link.label}
              </span>
            </Link>
          );
        })}

        <div className="w-px h-5 bg-slate-200 mx-0.5 shrink-0" aria-hidden="true" />

        <Link
          to="/"
          title="Đổi lớp"
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 ${
            isOcean
              ? 'text-sky-600 hover:bg-sky-50'
              : 'text-pink-600 hover:bg-pink-50'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>{currentClass}</span>
        </Link>
      </div>
    </nav>
  );
}

