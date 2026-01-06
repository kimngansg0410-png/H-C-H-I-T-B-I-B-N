
import React from 'react';
import { ReviewResult } from '../types';

interface Props {
  review: ReviewResult;
}

const ReviewDisplay: React.FC<Props> = ({ review }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-blue-200 relative overflow-hidden max-w-2xl mx-auto mt-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -mr-4 -mt-4"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-yellow-100 rounded-tr-full -ml-3 -mb-3"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
          ✏️
        </div>
        <h3 className="text-2xl font-bold text-blue-600">Lời nhắn từ Bé Bút Chì</h3>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4 items-start">
          <div className="bg-pink-100 p-2 rounded-xl text-xl">💡</div>
          <div>
            <p className="font-bold text-pink-600 text-sm uppercase tracking-wider">Cách dùng từ</p>
            <p className="text-gray-700 text-lg leading-relaxed">{review.wordChoice}</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="bg-green-100 p-2 rounded-xl text-xl">📝</div>
          <div>
            <p className="font-bold text-green-600 text-sm uppercase tracking-wider">Cách viết câu</p>
            <p className="text-gray-700 text-lg leading-relaxed">{review.sentenceStructure}</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="bg-blue-100 p-2 rounded-xl text-xl">✨</div>
          <div>
            <p className="font-bold text-blue-600 text-sm uppercase tracking-wider">Cách trang trí</p>
            <p className="text-gray-700 text-lg leading-relaxed">{review.decoration}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dashed border-gray-200 text-center">
          <p className="text-xl font-bold text-orange-500 italic">
            "{review.encouragement}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDisplay;
