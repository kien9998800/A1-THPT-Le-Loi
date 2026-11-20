import { motion, MotionConfig } from 'motion/react';
import {
  Heart,
  Waves,
  MapPin,
  Calendar,
  Facebook,
  Instagram,
  Compass,
  NotebookPen,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home11A1() {
  return (
    <MotionConfig reducedMotion="user">
      {/* OCEAN HERO SECTION */}
      <header className="relative pt-12 pb-28 px-6 text-center bg-gradient-to-b from-sky-100 via-[#eef9ff] to-cyan-50 overflow-hidden">
        {/* Subtle floating ocean bubbles */}
        <motion.div
          animate={{ y: [0, -18, 0], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 left-[9%] w-10 h-10 rounded-full border-2 border-sky-300/60 bg-white/40 pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 16, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute top-28 right-[11%] w-14 h-14 rounded-full border-2 border-cyan-300/50 bg-white/30 pointer-events-none"
        />

        <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10">
          {/* Curved SVG Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 1.2 }}
            className="w-full max-w-2xl mx-auto -mb-8 md:-mb-16 z-20 pointer-events-none drop-shadow-md"
          >
            <svg viewBox="0 0 500 120" className="w-full overflow-visible">
              <defs>
                <linearGradient id="oceanTitleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
              </defs>
              <path id="oceanCurve" d="M 50 100 Q 250 10 450 100" fill="transparent" />
              <text
                className="font-display font-bold text-[3.5rem] tracking-wide"
                fill="url(#oceanTitleGradient)"
              >
                <textPath href="#oceanCurve" startOffset="50%" textAnchor="middle">
                  Kỷ Niệm 11A1
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Main Class Photo */}
          <motion.div
            initial={{ opacity: 0, y: 36, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0.5 }}
            transition={{ type: 'spring', stiffness: 105, damping: 20, delay: 0.15 }}
            className="w-full z-10 relative"
          >
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [0.4, -0.4, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full bg-white p-3 md:p-5 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-sky-200/60 border border-sky-100"
            >
              <img
                src="/assets/aistudio/796584961_122139791439191031_580398144135894163_n_a240dc17.jpg"
                alt="Tập thể lớp 11A1"
                className="w-full aspect-[16/10] md:aspect-[16/9] object-cover rounded-[1.5rem] md:rounded-[2.5rem]"
              />

              {/* Logo Badge Overlapping */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -bottom-6 -right-4 md:-right-6 bg-white p-2 md:p-3 rounded-full shadow-xl border-4 border-sky-50 flex items-center justify-center"
              >
                <img
                  src="https://lh3.googleusercontent.com/d/1joPG7N44t7nL3zkZCkVKXTLYaLM-HndA"
                  alt="Logo 11A1"
                  className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-xl md:text-2xl font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed mt-12 text-center text-balance"
          >
            Giữa đại dương tuổi trẻ bao la, 11A1 là những con sóng xanh cùng nhau vươn xa và giữ trọn ký ức!
          </motion.p>

          {/* Info Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <div className="flex items-center gap-2 bg-white/85 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-sky-100">
              <Calendar className="w-5 h-5 text-sky-500" />
              <span className="font-bold text-slate-700">Niên khóa 2026 - 2027</span>
            </div>
            <a
              href="https://maps.app.goo.gl/gKt8ru6JhUxN1M6z6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/85 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-sky-100 hover:scale-105 hover:bg-sky-50 transition-all cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-cyan-500" />
              <span className="font-bold text-slate-700">THPT Lê Lợi, Quảng Trị</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4"
          >
            <div className="flex items-center gap-2 bg-white/85 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-cyan-100">
              <Compass className="w-5 h-5 text-teal-500" />
              <span className="font-bold text-slate-700">Tập thể 11A1 · 41 thủy thủ</span>
            </div>
            <div className="flex items-center gap-2 bg-white/85 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-teal-100">
              <span className="text-xl leading-none">👩🏻‍🏫</span>
              <span className="font-bold text-slate-700">Nguyễn Lê Thu Hiền</span>
            </div>
          </motion.div>
        </div>

        {/* Layered Ocean Wave Bottom Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[54px] sm:h-[72px]"
          >
            <path
              d="M0,48 C220,105 420,5 640,56 C860,108 1040,18 1200,52 L1200,120 L0,120 Z"
              fill="#bae6fd"
              opacity="0.45"
            />
            <path
              d="M0,72 C240,22 460,115 720,66 C940,25 1080,82 1200,58 L1200,120 L0,120 Z"
              fill="#f0f9ff"
            />
          </svg>
        </div>
      </header>

      {/* GALLERY SECTION - COMING SOON */}
      <main className="relative max-w-7xl mx-auto px-6 py-20 flex-grow">
        <div className="text-center mb-12 overflow-hidden py-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -32, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', bounce: 0.45, duration: 0.9 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white rounded-2xl shadow-xl shadow-sky-100 border-[3px] border-dashed border-sky-300 transform -rotate-1 relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-cyan-400 rounded-full shadow-sm border-2 border-white z-10" />
            <Waves className="w-7 h-7 text-sky-500" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-sky-600 tracking-wide">
              Hải Trình Kỷ Niệm
            </h2>
          </motion.div>
        </div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-dashed border-sky-200 p-10 sm:p-14 text-center shadow-lg shadow-sky-100/60"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 text-sky-500 flex items-center justify-center mx-auto mb-5"
          >
            <Waves className="w-8 h-8" />
          </motion.div>
          <h3 className="font-display text-3xl sm:text-4xl font-bold text-sky-600 mb-3">
            Sắp tới
          </h3>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
            Những khoảnh khắc rực rỡ của tập thể 11A1 đang trên đường cập bến. Cùng chờ đón nhé! 🌊
          </p>
        </motion.div>

        {/* MESSAGE NOTE & QUICK LINKS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-6 md:p-10 bg-sky-50/90 border-2 border-sky-200 rounded-3xl text-center max-w-3xl mx-auto shadow-sm"
        >
          <p className="text-slate-700 text-base leading-relaxed md:text-lg font-medium">
            🌊 Bước sang năm lớp 11, chúng mình không còn bỡ ngỡ như thuở ban đầu mà đã trở thành
            một tập thể vững vàng hơn trước mọi con sóng. Chúc cho hải trình 11A1 luôn rực rỡ nắng
            vàng, đầy ắp tiếng cười và những ước mơ xanh biếc!
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/11A1/blogs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-sky-100 text-sky-700 font-bold text-sm border border-sky-200 shadow-xs transition-colors"
            >
              <NotebookPen className="w-4 h-4" />
              Xem Bảng Tin 11A1
            </Link>
            <Link
              to="/11A1/letters"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-sm shadow-md shadow-sky-200/70 transition-all"
            >
              <Mail className="w-4 h-4" />
              Gửi Lời Nhắn Cho 11A1
            </Link>
          </div>
        </motion.div>
      </main>

      {/* OCEAN FOOTER */}
      <footer className="relative bg-white pt-24 pb-12 border-t-[6px] border-t-sky-200 overflow-hidden mt-auto">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0 transform -translate-y-[1px]">
          <svg
            className="relative block w-full h-[42px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-sky-50"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-800 mb-8">
              Kết Nối Với 11A1 Nhé! 🌊
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <motion.a
                href="https://www.facebook.com/profile.php?id=61585730932531&mibextid=wwXIfr&rdid=WwVH9Ia6G8zz0MH4&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GDEXZhDd3%2F%3Fmibextid%3DwwXIfr%26utm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio#"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.1, translateY: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-20 h-20 bg-sky-100 rounded-[2rem] flex items-center justify-center text-sky-600 shadow-xl shadow-sky-100 transition-colors group-hover:bg-sky-500 group-hover:text-white">
                  <Facebook className="w-10 h-10" />
                </div>
                <span className="font-bold text-slate-600 group-hover:text-sky-600 transition-colors">
                  Facebook
                </span>
              </motion.a>

              <motion.a
                href="https://www.instagram.com/_a1.memory_ll?fbclid=IwY2xjawR30W1leHRuA2FlbQIxMABicmlkETFydWozeHU3ODM2NmRwaVZ0c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHidmhKj5qgC3je_k-blWpJ69tcs16zMLD5h_yEXP_wlTuoBVfaQRHQkpGhtU_aem_idYanQ7i2JSXdZVwbJEigw"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.1, translateY: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-20 h-20 bg-gradient-to-tr from-sky-200 via-cyan-200 to-teal-200 rounded-[2rem] flex items-center justify-center text-cyan-700 shadow-xl shadow-cyan-100 transition-opacity group-hover:opacity-90">
                  <Instagram className="w-10 h-10" />
                </div>
                <span className="font-bold text-slate-600 group-hover:text-cyan-600 transition-colors">
                  Instagram
                </span>
              </motion.a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-slate-400 font-medium flex items-center justify-center gap-2">
              Làm với <Heart className="w-4 h-4 text-sky-500 fill-sky-500" /> bởi Kiên Hoàng
            </p>
            <p className="text-slate-400 text-sm mt-2">© 2026 - 2027 THPT Lê Lợi, Quảng Trị.</p>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}
