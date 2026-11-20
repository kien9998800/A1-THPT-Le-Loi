import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Star, Award, BookOpen, UserCircle2, X, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu cho Blog
interface BlogPost {
  id: number;
  firestoreId?: string;
  title: string;
  author: string;
  date: string;
  content: string;
  category: string;
  classId?: string;
  imageUrl?: string | string[];
  likes?: number;
  comments?: string[];
}

function getCategoryStyles(category: string) {
  switch (category) {
    case 'Tuyên dương':
      return { icon: <Award className="w-6 h-6 text-yellow-500" />, color: 'bg-yellow-50 border-yellow-200' };
    case 'Nhật ký lớp':
      return { icon: <BookOpen className="w-6 h-6 text-green-500" />, color: 'bg-green-50 border-green-200' };
    case 'Sự kiện':
      return { icon: <Star className="w-6 h-6 text-pink-500" />, color: 'bg-pink-50 border-pink-200' };
    default:
      return { icon: <BookOpen className="w-6 h-6 text-blue-500" />, color: 'bg-blue-50 border-blue-200' };
  }
}

export default function Blog() {
  const { classId } = useParams<{ classId: string }>();
  const currentClass = classId || '10A1';
  const isOcean = currentClass === '11A1';

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Nhật ký lớp');
  const [newAuthor, setNewAuthor] = useState('Admin');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Admin Login State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Interaction states
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  
  // Image zoom state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'all' | 'media'>('all');

  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'blogs'), orderBy('id', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogsList = snapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...doc.data()
      })) as BlogPost[];
      const filteredBlogs = blogsList.filter(b =>
        currentClass === '10A1' ? (!b.classId || b.classId === '10A1') : b.classId === currentClass
      );
      setBlogs(filteredBlogs);
      setIsLoading(false);
    }, (error) => {
      console.error('Failed to load blogs', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentClass]);

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSaving(true);
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const rawImages = newImageUrl.split(/[\n, ]+/).map(url => url.trim()).filter(url => url !== '');
    const parsedImageUrl = rawImages.length > 1 ? rawImages : (rawImages[0] || undefined);

    const newBlog = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      category: newCategory,
      author: newAuthor,
      classId: currentClass,
      date: formattedDate,
      imageUrl: parsedImageUrl,
      likes: 0,
      comments: [],
    };

    try {
      await addDoc(collection(db, 'blogs'), newBlog);
      
      setIsSaving(false);
      setIsModalOpen(false);
      
      // Reset form
      setNewTitle('');
      setNewContent('');
      setNewCategory('Nhật ký lớp');
      setNewImageUrl('');
    } catch (err) {
      console.error('Failed to save blog', err);
      setIsSaving(false);
      alert("Đã có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại!");
    }
  };

  const handleLike = async (id: number) => {
    const blogToUpdate = blogs.find(b => b.id === id);
    if (blogToUpdate && blogToUpdate.firestoreId) {
      try {
        const blogRef = doc(db, 'blogs', blogToUpdate.firestoreId);
        await updateDoc(blogRef, {
          likes: (blogToUpdate.likes || 0) + 1
        });
      } catch (err) {
        console.error("Error updating likes", err);
      }
    }
  };

  const toggleComments = (id: number) => {
    setOpenComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddComment = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const text = commentInputs[id];
    if (!text?.trim()) return;
    
    const blogToUpdate = blogs.find(b => b.id === id);
    if (blogToUpdate && blogToUpdate.firestoreId) {
      try {
        const blogRef = doc(db, 'blogs', blogToUpdate.firestoreId);
        await updateDoc(blogRef, {
          comments: [...(blogToUpdate.comments || []), text]
        });
        setCommentInputs(prev => ({ ...prev, [id]: '' }));
      } catch (err) {
        console.error("Error adding comment", err);
      }
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'Hoàng Trần Bảo Kiên' && loginPassword === '@Kk120716') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const handleShare = async (blog: BlogPost) => {
    const postUrl = `${window.location.origin}/blog?post=${blog.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.content.substring(0, 100) + '...',
          url: postUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${blog.title}\n${blog.content.substring(0, 100)}...\n${postUrl}`);
      alert('Đã sao chép liên kết chia sẻ!');
    }
  };

  return (
    <div className={`min-h-screen py-12 px-6 flex-grow ${isOcean ? 'bg-sky-50/50' : 'bg-rose-50/50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border-2 mb-6 ${
              isOcean ? 'shadow-sky-100 border-sky-200' : 'shadow-pink-100 border-pink-200'
            }`}
          >
            <PenTool className={`w-6 h-6 ${isOcean ? 'text-sky-500' : 'text-pink-500'}`} />
            <h1 className={`text-3xl font-display font-bold ${isOcean ? 'text-sky-600' : 'text-pink-500'}`}>
              Bảng Tin {currentClass}
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg font-medium mb-6"
          >
            {isOcean
              ? 'Nơi lưu giữ hải trình, nhật ký lớp và những khoảnh khắc rực rỡ của 11A1 🌊'
              : 'Nơi cập nhật tin tức, nhật ký lớp và tuyên dương những cá nhân xuất sắc 🌟'}
          </motion.p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setViewMode('all')}
              className={`px-6 py-2 rounded-full font-bold transition-colors cursor-pointer ${
                viewMode === 'all'
                  ? isOcean
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-pink-500 text-white shadow-md'
                  : isOcean
                    ? 'bg-white text-slate-500 hover:bg-sky-50'
                    : 'bg-white text-slate-500 hover:bg-pink-50'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setViewMode('media')}
              className={`px-6 py-2 rounded-full font-bold transition-colors cursor-pointer ${
                viewMode === 'media'
                  ? isOcean
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-pink-500 text-white shadow-md'
                  : isOcean
                    ? 'bg-white text-slate-500 hover:bg-sky-50'
                    : 'bg-white text-slate-500 hover:bg-pink-50'
              }`}
            >
              Media
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div
              className={`w-10 h-10 border-4 rounded-full animate-spin ${
                isOcean ? 'border-sky-200 border-t-sky-500' : 'border-pink-200 border-t-pink-500'
              }`}
            ></div>
          </div>
        ) : blogs.length === 0 ? (
          <div
            className={`text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed shadow-sm ${
              isOcean ? 'border-sky-200' : 'border-pink-200'
            }`}
          >
            <h3 className="text-xl font-bold text-slate-700 mb-2">Chưa có bài viết nào</h3>
            <p className="text-slate-500">Hãy là người đầu tiên chia sẻ câu chuyện của {currentClass} nhé!</p>
          </div>
        ) : viewMode === 'media' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {blogs.flatMap(blog => 
              Array.isArray(blog.imageUrl) 
                ? blog.imageUrl 
                : (blog.imageUrl ? [blog.imageUrl] : [])
            ).map((url, idx) => (
              <motion.div 
                 key={idx}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: (idx % 10) * 0.05 }}
                 className="aspect-[4/5] sm:aspect-square relative group overflow-hidden rounded-2xl cursor-pointer bg-slate-100"
                 onClick={() => !isVideo(url) && setSelectedImage(url)}
              >
                {isVideo(url) ? (
                  <video src={url} controls className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <img src={url} alt="Media" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                )}
              </motion.div>
            ))}
            {blogs.flatMap(blog => Array.isArray(blog.imageUrl) ? blog.imageUrl : (blog.imageUrl ? [blog.imageUrl] : [])).length === 0 && (
               <div className="col-span-full text-center py-10 text-slate-500">
                 Chưa có hình ảnh hay video nào.
               </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {blogs.map((blog, index) => {
              const styles = getCategoryStyles(blog.category);
              return (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                className={`bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border-l-[8px] ${styles.color} relative overflow-hidden group`}
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                  {styles.icon}
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 relative z-10">
                  <div className="bg-slate-50 p-4 rounded-2xl shrink-0 self-start">
                    {styles.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {blog.category}
                      </span>
                      <span className="text-sm font-medium text-slate-400">{blog.date}</span>
                    </div>
                    
                    <h2 className="text-2xl font-display font-bold text-slate-800 mb-3 group-hover:text-pink-500 transition-colors">
                      {blog.title}
                    </h2>
                    
                    <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
                      {blog.content}
                    </p>
                    
                    {blog.imageUrl && (
                      <div className={`mb-6 grid gap-2 ${Array.isArray(blog.imageUrl) && blog.imageUrl.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} rounded-2xl overflow-hidden border border-slate-100`}>
                        {Array.isArray(blog.imageUrl) ? blog.imageUrl.map((img, i) => (
                           isVideo(img) ? (
                             <video 
                               key={i}
                               src={img}
                               controls
                               className="w-full h-auto object-cover max-h-96 rounded-xl"
                             />
                           ) : (
                             <img 
                               key={i} 
                               src={img} 
                               alt={`${blog.title} - ${i}`} 
                               className="w-full h-auto object-cover max-h-96 rounded-xl cursor-pointer hover:opacity-90 transition-opacity" 
                               loading="lazy" 
                               onClick={() => setSelectedImage(img)}
                             />
                           )
                        )) : (
                           isVideo(blog.imageUrl as string) ? (
                             <video 
                               src={blog.imageUrl as string}
                               controls
                               className="w-full h-auto object-cover max-h-96 rounded-xl"
                             />
                           ) : (
                             <img 
                               src={blog.imageUrl as string} 
                               alt={blog.title} 
                               className="w-full h-auto object-cover max-h-96 rounded-xl cursor-pointer hover:opacity-90 transition-opacity" 
                               loading="lazy" 
                               onClick={() => setSelectedImage(blog.imageUrl as string)}
                             />
                           )
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 border-t border-slate-100 pt-4">
                      <UserCircle2 className="w-5 h-5 text-slate-400" />
                      Đăng bởi <span className="text-pink-500">{blog.author}</span>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-50">
                      <button onClick={() => handleLike(blog.id)} className="flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors group/btn">
                        <Heart className={`w-5 h-5 transition-transform group-hover/btn:scale-110 ${(blog.likes || 0) > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
                        <span className="font-medium text-sm">{blog.likes || 0}</span>
                      </button>
                      <button onClick={() => toggleComments(blog.id)} className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors group/btn">
                        <MessageCircle className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                        <span className="font-medium text-sm">{(blog.comments || []).length} Bình luận</span>
                      </button>
                      <button onClick={() => handleShare(blog)} className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors group/btn ml-auto">
                        <Share2 className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                        <span className="font-medium text-sm hidden sm:inline">Chia sẻ</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {openComments[blog.id] && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                            <ul className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                              {(blog.comments || []).length === 0 ? (
                                <li className="text-sm text-slate-400 font-medium pb-2">Chưa có bình luận nào. Hãy là người đầu tiên!</li>
                              ) : (
                                (blog.comments || []).map((cmt, idx) => (
                                  <li key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-sm text-slate-700">
                                    <span className="font-bold text-pink-500 mr-2">Bạn:</span>{cmt}
                                  </li>
                                ))
                              )}
                            </ul>
                            <form onSubmit={(e) => handleAddComment(e, blog.id)} className="flex items-center gap-2 mt-2">
                              <input 
                                type="text"
                                value={commentInputs[blog.id] || ''}
                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [blog.id]: e.target.value }))}
                                placeholder="Viết bình luận..."
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 bg-white"
                              />
                              <button type="submit" disabled={!commentInputs[blog.id]?.trim()} className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <Send className="w-4 h-4" />
                              </button>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        )}

        {/* Admin Login / Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-sm mx-auto"
        >
          {isAdminLoggedIn ? (
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-300/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <PenTool className="w-5 h-5" />
                Viết Blog Mới
              </button>
              <button 
                onClick={handleAdminLogout}
                className="text-sm text-slate-500 hover:text-slate-700 underline"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-pink-100">
              <div className="flex flex-col items-center mb-4">
                <UserCircle2 className="w-10 h-10 text-pink-400 mb-2" />
                <h3 className="font-bold text-slate-800">Đăng nhập Admin</h3>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Tài khoản" 
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-pink-400"
                    required
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    placeholder="Mật khẩu"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-pink-400"
                    required
                  />
                </div>
                {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
                <button 
                  type="submit"
                  className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors"
                >
                  Đăng nhập
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>

      {/* Write Blog Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-500 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <PenTool className="w-6 h-6 text-pink-500" />
                  <h2 className="text-2xl font-display font-bold text-slate-800">Tạo bài viết mới</h2>
                </div>

                <form onSubmit={handleCreateBlog} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tiêu đề</label>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="VD: Chúc mừng đại hội chi đoàn thành công..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Chủ đề</label>
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white"
                      >
                        <option value="Nhật ký lớp">Nhật ký lớp</option>
                        <option value="Tuyên dương">Tuyên dương</option>
                        <option value="Sự kiện">Sự kiện</option>
                        <option value="Thông báo">Thông báo</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Người đăng</label>
                      <input 
                        type="text" 
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nội dung</label>
                    <textarea 
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Viết nội dung bảng tin ở đây nhé..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all min-h-[150px] resize-y"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Đường dẫn ảnh (Tùy chọn - Ngăn cách bằng dấu phẩy hoặc xuống dòng)</label>
                    <textarea 
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="VD: https://link1.com/img1.jpg, https://link2.com/img2.jpg..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all min-h-[80px] resize-y"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-full font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-full font-bold bg-pink-500 hover:bg-pink-600 text-white shadow-md shadow-pink-200 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Đăng bài'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={selectedImage}
              alt="Phóng to"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 bg-white/10 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

