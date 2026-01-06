
import React, { useState, useEffect } from 'react';
import HandwritingUploader from './components/HandwritingUploader';
import ReviewDisplay from './components/ReviewDisplay';
import { analyzeHandwriting } from './services/geminiService';
import { AppState } from './types';

// Định nghĩa interface AIStudio và Window để khớp với môi trường và sửa lỗi TypeScript
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    loading: false,
    review: null,
    error: null,
  });
  const [hasKey, setHasKey] = useState<boolean>(false);

  // Kiểm tra trạng thái API key khi ứng dụng khởi chạy
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          console.error("Lỗi kiểm tra chìa khóa:", e);
        }
      }
    };
    checkKey();
  }, []);

  // Mở hộp thoại chọn chìa khóa và giả định thành công ngay lập tức để tránh race condition
  const handleOpenKeyDialog = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setHasKey(true);
      } catch (e) {
        console.error("Lỗi mở hộp thoại chọn chìa khóa:", e);
      }
    }
  };

  const handleImageSelect = async (base64: string) => {
    // Nếu chưa chọn chìa khóa, mở hộp thoại chọn trước khi thực hiện phân tích
    if (!hasKey && window.aistudio) {
      await handleOpenKeyDialog();
    }

    setState({ ...state, image: base64, loading: true, review: null, error: null });
    
    try {
      const review = await analyzeHandwriting(base64);
      setState({ 
        image: base64, 
        loading: false, 
        review, 
        error: null 
      });
    } catch (err: any) {
      console.error(err);
      // Nếu lỗi do dự án không hợp lệ hoặc không có quyền (404), yêu cầu người dùng chọn lại chìa khóa
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setState({ 
          image: base64, 
          loading: false, 
          review: null, 
          error: "Chìa khóa này không dùng được rồi, bạn chọn chìa khóa từ dự án trả phí (Paid Project) nhé!" 
        });
      } else {
        setState({ 
          image: base64, 
          loading: false, 
          review: null, 
          error: "Ôi, Bé Bút Chì không đọc được ảnh rồi. Bạn thử chụp lại rõ hơn nhé!" 
        });
      }
    }
  };

  const handleReset = () => {
    setState({
      image: null,
      loading: false,
      review: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      {/* Nút quản lý chìa khóa ở góc phải màn hình */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={handleOpenKeyDialog}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-md transition-all hover:scale-105 active:scale-95 border-2 ${
            hasKey 
              ? 'bg-green-100 text-green-700 border-green-300' 
              : 'bg-yellow-100 text-yellow-700 border-yellow-400 animate-bounce'
          }`}
        >
          <span>{hasKey ? '🔑 Chìa khóa: Sẵn sàng' : '🔑 Gắn chìa khóa ngay'}</span>
        </button>
      </div>

      {/* Tiêu đề ứng dụng */}
      <header className="text-center mb-12">
        <div className="inline-block relative">
          <h1 className="text-5xl font-black text-blue-600 mb-2 relative z-10">
            Bé Bút Chì
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-4 bg-yellow-300 -z-10 rounded-full opacity-60"></div>
        </div>
        <p className="text-xl text-gray-600 mt-4">Cùng bạn học lớp 3 xem bài và khích lệ nhau nhé!</p>
        <div className="mt-2 text-sm bg-blue-50 inline-block px-3 py-1 rounded-full text-blue-500 italic">
          Yêu cầu chìa khóa từ dự án trả phí. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline">Xem tài liệu thanh toán</a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {!state.review && !state.loading && (
          <div className="bg-white rounded-[2rem] p-8 shadow-lg border-2 border-yellow-200">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
              Gửi ảnh bài viết của bạn ở đây nè!
            </h2>
            <HandwritingUploader 
              onImageSelect={handleImageSelect} 
              disabled={state.loading} 
            />
          </div>
        )}

        {state.loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg">
              ✏️
            </div>
            <h2 className="text-3xl font-bold text-blue-600 mb-2">Đợi mình một xíu nhé...</h2>
            <p className="text-lg text-gray-500">Bé Bút Chì đang chăm chú đọc bài của bạn đây!</p>
          </div>
        )}

        {state.error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center mt-8">
            <p className="text-red-600 text-xl font-bold mb-4">{state.error}</p>
            <button 
              onClick={handleReset}
              className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition-colors"
            >
              Thử lại lần nữa
            </button>
          </div>
        )}

        {state.review && state.image && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-center">
              <div className="relative group">
                <img 
                  src={state.image} 
                  alt="Bài viết của bạn" 
                  className="max-h-64 rounded-2xl shadow-md border-4 border-white rotate-2 group-hover:rotate-0 transition-transform cursor-pointer"
                  onClick={() => window.open(state.image || '', '_blank')}
                />
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                  🖼️
                </div>
              </div>
            </div>

            <ReviewDisplay review={state.review} />

            <div className="flex justify-center mt-12">
              <button 
                onClick={handleReset}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <span>Gửi thêm bài khác nào!</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Các thành phần trang trí tĩnh */}
      <div className="fixed bottom-10 left-10 text-6xl opacity-20 pointer-events-none hidden lg:block">🎒</div>
      <div className="fixed top-20 right-20 text-6xl opacity-20 pointer-events-none hidden lg:block rotate-12">🍎</div>
      <div className="fixed bottom-20 right-10 text-6xl opacity-20 pointer-events-none hidden lg:block -rotate-12">⚽</div>
      <div className="fixed top-40 left-10 text-6xl opacity-20 pointer-events-none hidden lg:block">🎨</div>
    </div>
  );
};

export default App;
