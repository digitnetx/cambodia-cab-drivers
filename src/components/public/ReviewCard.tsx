import React from 'react';
import { Review } from '../../types';
import { Star, Quote } from 'lucide-react';

export const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between h-full shadow-xs hover:border-red-500/50 hover:shadow-md transition-all text-slate-900">
      <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-100 pointer-events-none" />

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-3 text-red-600">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? 'fill-red-600 text-red-600' : 'text-slate-200'}`}
            />
          ))}
        </div>

        <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
          "{review.review}"
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 font-sans">{review.customer_name}</h4>
          <span className="text-xs text-slate-500">{review.country}</span>
        </div>
        <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-bold">
          Verified Guest
        </span>
      </div>
    </div>
  );
};
