import { motion, AnimatePresence } from 'motion/react';
import { Heart, Camera, MapPin, Calendar, Image as ImageIcon, Facebook, Instagram, Maximize2, X, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Home11A1 from './Home11A1';

export default function Home() {
  const { classId } = useParams<{ classId: string }>();
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; photoId: number; x: number; y: number }[]>([]);
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(null);

  if (classId === '11A1') {
    return <Home11A1 />;
  }

  const handleImageClick = (e: React.MouseEvent, photoId: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now(), photoId, x, y };
    setFloatingHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1000);
  };

  // Placeholder images - replacing these with actual URLs later
  const photos = [
    {
      id: 1,
      url: 'https://lh3.googleusercontent.com/d/1sxPxqKZ2FKbGBIzPWwqBewGur9lC32Z5',
      title: 'Chào đón năm học mới',
      desc: 'Ngày đầu tiên đầy bỡ ngỡ',
    },
    {
      id: 2,
      url: 'https://lh3.googleusercontent.com/d/1pM6QE87sdqYFxmUfukhuT8C_gFy1nho2',
      title: '💙Ngày hội thao Đoàn trường🔥',
      desc: 'Cùng nhau thể hiện sức trẻ và sự nhiệt huyết',
    },
    {
      id: 3,
      url: 'https://lh3.googleusercontent.com/d/11eAwMU3-maVMdNR1nxqSJBN-smDmFNa5',
      title: '❤️🔥Buổi từ thiện nấu cháo🍲',
      desc: 'Sẻ chia yêu thương, ấm áp tình người',
    },
    {
      id: 4,
      url: 'https://lh3.googleusercontent.com/d/1GRsie5jlZmXYrgF6Oi1QkMLwJcc6614N',
      title: '🎉Chào mừng cô đến với đại gia đình📚',
      desc: 'Gia đình 10A1 nồng nhiệt chào đón cô',
    },
    {
      id: 5,
      url: 'https://lh3.googleusercontent.com/d/1UyezFJCuGZrvE1wDVEO5yg-okREzrYJQ',
      title: '🌟Good byee👋🏻',
      desc: 'Những kỷ niệm sẽ mãi theo chúng ta',
    },
    {
      id: 6,
      url: 'https://lh3.googleusercontent.com/d/1YuHTpgAcd_5RTTXdTVHXjHTyKFA9uKrL',
      title: 'Tổng kết năm học',
      desc: 'Chặng đường đầy kỷ niệm',
    },
  ];

  return (
    <>
      {/* HEADER / HERO SECTION */}
      <header className="relative pt-12 pb-24 px-6 text-center border-b-[6px] border-b-pink-200 bg-gradient-to-br from-pink-100 via-rose-50 to-orange-50 overflow-hidden">
        {/* Floating decoration emojis/shapes using motion */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-[10%] text-5xl opacity-50"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -15, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-16 right-[15%] text-6xl opacity-50"
        >
          🌸
        </motion.div>
        
        <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10">
          
          {/* Curved Text SVG */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 1.5 }}
            className="w-full max-w-2xl mx-auto -mb-8 md:-mb-16 z-20 pointer-events-none drop-shadow-md"
          >
            <svg viewBox="0 0 500 120" className="w-full overflow-visible">
              <defs>
                <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <path id="curve" d="M 50 100 Q 250 10 450 100" fill="transparent" />
              <text className="font-display font-bold text-[3.5rem] tracking-wide" fill="url(#pinkGradient)">
                <textPath href="#curve" startOffset="50%" textAnchor="middle">
                  Kỷ Niệm 10A1
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Main Class Photo */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
            className="w-full z-10 relative"
          >
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [0.5, -0.5, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full bg-white p-3 md:p-5 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-pink-200/50"
            >
              <img 
                src="https://lh3.googleusercontent.com/d/1sxPxqKZ2FKbGBIzPWwqBewGur9lC32Z5" 
                alt="Tập thể lớp 10A1" 
                className="w-full aspect-[4/3] md:aspect-[21/9] object-cover rounded-[1.5rem] md:rounded-[2.5rem]"
              />
              {/* Logo Badge Overlapping */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -bottom-6 -right-4 md:-right-6 bg-white p-2 md:p-3 rounded-full shadow-xl border-4 border-rose-50 flex items-center justify-center"
              >
                <img 
                  src="https://lh3.googleusercontent.com/d/1joPG7N44t7nL3zkZCkVKXTLYaLM-HndA" 
                  alt="Logo 10A1" 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Description Below */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed mt-12 text-center"
          >
            Góc nhỏ lưu giữ thanh xuân rực rỡ và những nụ cười trong veo của chúng mình!
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-pink-100">
              <Calendar className="w-5 h-5 text-orange-400" />
              <span className="font-bold text-slate-700">Niên khóa 2025 - 2026</span>
            </div>
            <a 
              href="https://maps.app.goo.gl/gKt8ru6JhUxN1M6z6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-pink-100 hover:scale-105 hover:bg-pink-50 transition-all cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-pink-400" />
              <span className="font-bold text-slate-700">THPT Lê Lợi, Quảng Trị</span>
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-blue-100">
              <span className="text-xl leading-none">👥</span>
              <span className="font-bold text-slate-700">42</span>
              <span className="text-slate-300 font-light mx-1">|</span>
              <span className="text-xl leading-none">🧑🏻</span>
              <span className="font-bold text-slate-700">28</span>
              <span className="text-xl leading-none ml-1">👩🏻</span>
              <span className="font-bold text-slate-700">14</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-purple-100">
              <span className="text-xl leading-none">👩🏻‍🏫</span>
              <span className="font-bold text-slate-700">Nguyễn Lê Thu Hiền</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* GALLERY SECTION */}
      <main className="relative max-w-7xl mx-auto px-6 py-20 flex-grow">
        {/* Background Floating Decos */}
        <motion.div 
          animate={{
            y: [0, -30, 0],
            rotate: [-6, -2, -6],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 sm:top-40 left-0 sm:-left-12 z-0 opacity-50 pointer-events-none blur-[1px]"
        >
          <img 
            src="https://lh3.googleusercontent.com/d/10NENTAjvqwDPB8PL6dLdNuUIQ99GHHOf" 
            alt="Background Deco" 
            className="h-auto drop-shadow-2xl"
            style={{ width: "280px", maxWidth: "45vw" }}
          />
        </motion.div>
        
        <motion.div 
          animate={{
            y: [0, 30, 0],
            rotate: [12, 8, 12],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-40 sm:bottom-60 right-0 sm:-right-12 z-0 opacity-50 pointer-events-none blur-[1px]"
        >
          <img 
            src="https://lh3.googleusercontent.com/d/1cPz3wfLUOkxKZ3KLT3ZmXdjKWYaXCN9i" 
            alt="Background Deco" 
            className="h-auto drop-shadow-2xl"
            style={{ width: "280px", maxWidth: "45vw" }}
          />
        </motion.div>

        <div className="text-center mb-16 overflow-hidden py-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -40, rotate: -5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5, duration: 1 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white rounded-2xl shadow-xl shadow-pink-100 border-[3px] border-dashed border-pink-300 transform -rotate-1 relative"
          >
            {/* Cute pin decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-rose-400 rounded-full shadow-sm border-2 border-white z-10" />
            <Camera className="w-7 h-7 text-pink-500" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-pink-500 tracking-wide">Khoảnh Khắc Đẹp Nhất</h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 text-slate-500 text-lg font-medium"
          >
            Những tấm ảnh chứa đầy tiếng cười và kỷ niệm lớp mình cùng cô giáo 📸
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 px-4 relative z-10">
          {photos.map((photo, index) => {
            // Pre-calculate rotations so they don't change on re-render causing hydation issues
            const rotation = index % 3 === 0 ? -3 : index % 3 === 1 ? 2 : -1;
            
            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8, rotate: rotation * 3, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, rotate: rotation, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotate: 0, 
                  y: -10,
                  zIndex: 10,
                  transition: { type: "spring", stiffness: 300, damping: 20 } 
                }}
                className="group relative bg-white p-4 pb-6 rounded-sm shadow-xl shadow-slate-200/60 border border-slate-100"
              >
                {/* Tape decoration for polaroid feel */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-slate-200/80 backdrop-blur-sm -rotate-2 transform shadow-sm" />
                
                <div 
                  className="relative aspect-[4/3] mb-4 z-0 border border-slate-100 cursor-pointer"
                  onClick={(e) => handleImageClick(e, photo.id)}
                >
                  <div className="absolute inset-0 overflow-hidden bg-slate-100">
                    <motion.img 
                      src={photo.url} 
                      alt={photo.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                      <span className="text-white font-medium flex items-center gap-2 drop-shadow-md">
                        <Heart className="w-5 h-5 fill-white" /> Thả tim
                      </span>
                    </div>
                  </div>

                  {/* Fullscreen Button Overlay */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex z-40">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFullscreenImageUrl(photo.url); }}
                      title="Xem toàn ảnh"
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-pink-50 hover:scale-105 transition-all text-pink-500 border border-pink-100"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {floatingHearts.filter(h => h.photoId === photo.id).map(heart => (
                      <motion.div
                        key={heart.id}
                        initial={{ opacity: 1, y: heart.y - 20, x: heart.x - 20, scale: 0.5 }}
                        animate={{ opacity: 0, y: heart.y - 150, x: heart.x - 20 + (Math.random() * 60 - 30), scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute pointer-events-none z-50"
                      >
                        <Heart className="w-10 h-10 fill-pink-500 text-pink-500 drop-shadow-md" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="px-2 text-center mt-2">
                  <h3 className="font-display text-2xl font-bold text-slate-800 mb-1">{photo.title}</h3>
                  <p className="text-slate-500 font-medium text-sm">{photo.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* MESSAGE NOTE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-6 md:p-10 bg-rose-50/80 border-2 border-pink-200 rounded-3xl text-center max-w-3xl mx-auto shadow-sm"
        >
          <p className="text-slate-700 text-base leading-relaxed md:text-lg font-medium">
            ✨ Năm học đầu tiên, bước qua nhẹ nhàng và nhiều kỉ niệm.
            A1 đã được nhiều danh hiệu, và xếp hạng. Cảm ơn sự đồng hành của cô Hiền gvcn và tập thể ban cán sự của lớp. Mong rằng năm học tiếp theo, A1 vẫn giữ nguyên phong độ và phát triển hơn nữa ⭐️
          </p>
        </motion.div>
      </main>

      {/* FULLSCREEN IMAGE MODAL */}
      <AnimatePresence>
        {fullscreenImageUrl && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreenImageUrl(null)}
          >
            <motion.div 
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center cursor-auto isolate"
              initial={{ y: 50, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
            >
              {/* Close Button UI */}
              <div className="absolute -top-12 sm:-top-14 right-0 z-50">
                <button 
                  onClick={() => setFullscreenImageUrl(null)}
                  className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition-colors shadow-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <img src={fullscreenImageUrl} alt="Fullscreen" className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER & SOCIAL LINKS */}
      <footer className="relative bg-white pt-24 pb-12 border-t-[6px] border-t-pink-200 overflow-hidden mt-auto">
        {/* Footprints or cute decoration */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0 transform -translate-y-[1px]">
          <svg className="relative block w-full h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-rose-50"></path>
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-12">
          
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-800 mb-8">Kết Nối Với 10A1 Nhé! 👇</h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              
              {/* Facebook Button */}
              <motion.a 
                href="https://www.facebook.com/profile.php?id=61585730932531&mibextid=wwXIfr&rdid=WwVH9Ia6G8zz0MH4&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GDEXZhDd3%2F%3Fmibextid%3DwwXIfr%26utm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio#" 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ scale: 1.1, translateY: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-[2rem] flex items-center justify-center text-blue-600 shadow-xl shadow-blue-100 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <Facebook className="w-10 h-10" />
                </div>
                <span className="font-bold text-slate-600 group-hover:text-blue-500 transition-colors">Facebook</span>
              </motion.a>

              {/* Instagram Button */}
              <motion.a 
                href="https://www.instagram.com/_a1.memory_ll?fbclid=IwY2xjawR30W1leHRuA2FlbQIxMABicmlkETFydWozeHU3ODM2NmRwaVZ0c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHidmhKj5qgC3je_k-blWpJ69tcs16zMLD5h_yEXP_wlTuoBVfaQRHQkpGhtU_aem_idYanQ7i2JSXdZVwbJEigw" 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ scale: 1.1, translateY: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-20 h-20 bg-gradient-to-tr from-yellow-200 via-pink-200 to-purple-200 rounded-[2rem] flex items-center justify-center text-purple-600 shadow-xl shadow-purple-100 transition-colors group-hover:opacity-90">
                  <Instagram className="w-10 h-10" />
                </div>
                <span className="font-bold text-slate-600 group-hover:text-purple-500 transition-colors">Instagram</span>
              </motion.a>

            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-slate-400 font-medium flex items-center justify-center gap-2">
              Làm với <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> bởi Kiên Hoàng
            </p>
            <p className="text-slate-400 text-sm mt-2">© 2025 - 2026 THPT Lê Lợi, Quảng Trị.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
