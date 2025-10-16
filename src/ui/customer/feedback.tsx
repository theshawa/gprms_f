import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FeedbackItem {
  id: number;
  name: string;
  image: string;
  rating?: number;
}

export const Customer_FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [feedbackItems] = useState<FeedbackItem[]>([
    {
      id: 1,
      name: "Special Sashimi 6",
      image: "https://placehold.co/60x60"
    },
    {
      id: 2,
      name: "Fermented soybean mixed with Japanese tuna",
      image: "https://placehold.co/60x60"
    }
  ]);
  
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [experienceText, setExperienceText] = useState('');

  const handleRating = (itemId: number, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [itemId]: rating
    }));
  };

  const handleSendFeedback = () => {
    // Handle feedback submission logic here
    console.log('Feedback submitted:', { ratings, experienceText });
    // Navigate back or show success message
    navigate(-1);
  };

  const handleSkip = () => {
    navigate(-1);
  };

  const renderEmoji = (rating: number) => {
    switch (rating) {
      case 1:
        return "😠"; // Angry
      case 2:
        return "😞"; // Disappointed
      case 3:
        return "😐"; // Neutral
      case 4:
        return "😊"; // Happy
      case 5:
        return "😍"; // Love
      default:
        return "😐";
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto min-h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <div className="w-full px-6 pt-14 pb-1 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 p-2 bg-gray-100 rounded-full flex justify-center items-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="text-center text-black text-xl font-semibold">Share your feedback</div>
        <button className="text-red-600 text-xs">Delete</button>
      </div>

      {/* Content */}
      <div className="px-0 pt-6 pb-32 overflow-y-auto">
        {/* Emoji Section */}
        <div className="flex flex-col gap-4">
          <div className="px-6 pt-2.5 pb-4">
            <div className="text-black text-xl font-bold">How do you feel about our food?</div>
          </div>
          
          <div className="px-6 flex flex-col gap-3">
            {feedbackItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-3">
                <div className="w-full py-3 border-b border-gray-200 flex items-center gap-4">
                  <img 
                    className="w-14 h-14 rounded-xl object-cover" 
                    src={item.image} 
                    alt={item.name}
                  />
                  <div className="flex-1">
                    <div className="text-black text-base font-semibold">{item.name}</div>
                  </div>
                </div>
                
                {/* Emoji Rating */}
                <div className="flex justify-start items-start gap-2.5 mb-6">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRating(item.id, rating)}
                      className={`w-12 h-12 p-2.5 flex justify-center items-center rounded-full transition-all ${
                        ratings[item.id] === rating 
                          ? 'bg-green-100 scale-110' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-2xl">{renderEmoji(rating)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Text Feedback Section */}
        <div className="px-6 flex flex-col gap-4 mt-8">
          <div className="text-black text-base font-semibold">Share your experiences</div>
          <textarea
            value={experienceText}
            onChange={(e) => setExperienceText(e.target.value)}
            placeholder="Write a sharing your thoughts (max 1000 words)"
            className="w-full h-24 px-4 pt-4 pb-2 rounded-xl border border-gray-300 text-base resize-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            maxLength={1000}
          />
          <div className="text-right text-xs text-gray-400">
            {experienceText.length}/1000 characters
          </div>
        </div>
      </div>

      {/* Bottom Buttons - Fixed */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 z-10">
        <div className="px-6 pt-2 pb-8 flex flex-col gap-2.5">
          <button
            onClick={handleSendFeedback}
            className="w-full h-14 px-6 py-4 bg-green-500 hover:bg-green-600 rounded-full flex justify-center items-center transition-colors"
          >
            <span className="text-white text-base font-semibold">Send feedback</span>
          </button>
          <button
            onClick={handleSkip}
            className="w-full h-14 px-5 py-4 rounded-full border border-green-500 flex justify-center items-center transition-colors hover:bg-green-50"
          >
            <span className="text-red-600 text-base font-semibold">Skip</span>
          </button>
        </div>
      </div>
    </div>
  );
};