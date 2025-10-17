import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

interface FeedbackItem {
  id: number;
  name: string;
  image: string;
  rating?: number;
}

const labels: { [index: string]: string } = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
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
  
  const [ratings, setRatings] = useState<{ [key: number]: number | null }>({});
  const [hover, setHover] = useState<{ [key: number]: number }>({});
  const [experienceText, setExperienceText] = useState('');

  const handleRating = (itemId: number, rating: number | null) => {
    setRatings(prev => ({
      ...prev,
      [itemId]: rating
    }));
  };

  const handleHover = (itemId: number, newHover: number) => {
    setHover(prev => ({
      ...prev,
      [itemId]: newHover
    }));
  };

  const handleSendFeedback = () => {
    // Handle feedback submission logic here
    console.log('Feedback submitted:', { ratings, experienceText });
    // Navigate to home page after completing feedback
    navigate('/');
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="w-full max-w-sm mx-auto min-h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <div className="w-full px-6 pt-14 pb-1 flex justify-center items-center">
        <div className="text-center text-black text-xl font-semibold">Share your feedback</div>
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
                
                {/* Star Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Rating
                    name={`rating-${item.id}`}
                    value={ratings[item.id] || null}
                    precision={0.5}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                      handleRating(item.id, newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      handleHover(item.id, newHover);
                    }}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    sx={{ fontSize: '2rem' }}
                  />
                  {ratings[item.id] !== null && ratings[item.id] !== undefined && (
                    <Box sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                      {labels[hover[item.id] !== undefined && hover[item.id] !== -1 ? hover[item.id] : ratings[item.id] || 0]}
                    </Box>
                  )}
                </Box>
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
            className="w-full h-14 px-6 py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-full flex justify-center items-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <span className="text-white text-base font-semibold">Send feedback</span>
          </button>
          <button
            onClick={handleSkip}
            className="w-full h-14 px-5 py-4 rounded-full border border-red-600 flex justify-center items-center transition-colors hover:bg-red-50"
          >
            <span className="text-red-600 text-base font-semibold">Skip</span>
          </button>
        </div>
      </div>
    </div>
  );
};