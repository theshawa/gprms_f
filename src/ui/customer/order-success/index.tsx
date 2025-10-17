import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCustomerCart } from '@/hooks/useCustomerCart';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

// Order History Item Component
const OrderHistoryItem: React.FC<{ order: any }> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 text-xs">Round {String(order.roundNumber || 1).padStart(2, '0')}</span>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-xs font-medium">Delivered</span>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none" 
              className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-1">
          {order.items.length} item(s) • LKR {order.total.toFixed(2)}
        </div>
        <div className="text-xs text-gray-400">
          {new Date(order.timestamp).toLocaleTimeString()}
        </div>
      </button>
      
      {/* Expanded Items List */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gray-100">
          <div className="mt-3 space-y-2">
            <div className="text-xs font-medium text-gray-700 mb-2">Items ordered:</div>
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-1">
                <div className="flex-1">
                  <div className="text-xs text-gray-800">{item.dish.name}</div>
                  <div className="text-xs text-gray-500">LKR {item.dish.price.toFixed(2)} each</div>
                </div>
                <div className="text-xs text-gray-600">×{item.quantity}</div>
                <div className="text-xs font-medium text-gray-800 ml-3">
                  LKR {(item.dish.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">Subtotal</span>
                <span className="text-xs font-semibold text-gray-900">LKR {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Customer_OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCustomerCart();
  const { auth } = useCustomerAuth();
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  
  // Get customer first name
  const firstName = auth?.user?.name?.split(' ')[0] || 'Guest';
  
  // Get order details from navigation state
  const orderDetails = location.state?.orderDetails;

  // Save current order to session rounds
  React.useEffect(() => {
    if (orderDetails || cartItems.length > 0) {
      // Get current session rounds
      const currentSessionRounds = JSON.parse(localStorage.getItem('currentSessionRounds') || '[]');
      
      // Create unique ID based on timestamp to avoid duplicates
      const uniqueId = orderDetails?.id || `round-${Date.now()}`;
      
      // Check if this round already exists
      const roundExists = currentSessionRounds.some((round: any) => round.id === uniqueId);
      
      if (!roundExists) {
        // Calculate round number (current rounds count + 1)
        const roundNumber = currentSessionRounds.length + 1;
        
        const currentRound = {
          roundNumber: roundNumber,
          id: uniqueId,
          items: orderDetails?.items || cartItems,
          total: (orderDetails?.items || cartItems).reduce((sum: number, item: any) => 
            sum + (item.dish.price * item.quantity), 0),
          timestamp: new Date().toISOString()
        };
        
        currentSessionRounds.push(currentRound);
        localStorage.setItem('currentSessionRounds', JSON.stringify(currentSessionRounds));
      }
    }
  }, [orderDetails, cartItems]);

  const handleFinishDining = () => {
    setShowFinishConfirmation(true);
  };

  const confirmFinishDining = () => {
    // Here you would typically make an API call to alert the waiter
    console.log('Waiter has been notified to bring the bill');
    
    // Clear current session rounds as dining is finished
    localStorage.removeItem('currentSessionRounds');
    
    setShowFinishConfirmation(false);
    clearCart(); // Clear the cart after successful order
    navigate('/feedback'); // Navigate to feedback page instead of home
  };

  const cancelFinishDining = () => {
    setShowFinishConfirmation(false);
  };



  return (
    <div className="w-full max-w-sm mx-auto min-h-screen bg-white overflow-y-auto">
      {/* Header */}
      <div className="w-full h-24 px-6 pt-14 pb-1 bg-white flex flex-col items-center justify-center">
        <div className="text-center text-black text-xl font-semibold">Order Confirmed, {firstName}! 👋</div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 pb-16">
        <div className="flex flex-col items-center space-y-6">
        {/* Chef Preparing Image */}
        <div className="w-32 h-32">
          <img 
            src="/chef-preparing.jpg" 
            alt="Chef preparing your dishes" 
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        
        {/* Supporting Message */}
        <p className="text-gray-600 text-base max-w-xs text-center leading-relaxed mt-8">
          You can add more items or relax while we work our magic!
        </p>
        
        {/* Current Order Summary */}
        <div className="w-full bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm">Round</span>
            <span className="text-gray-900 font-semibold text-sm">
              {(() => {
                const currentSessionRounds = JSON.parse(localStorage.getItem('currentSessionRounds') || '[]');
                const currentRoundNumber = currentSessionRounds.length;
                return `Round ${String(currentRoundNumber).padStart(2, '0')}`;
              })()}
            </span>
          </div>
          
          {/* Items List */}
          <div className="mb-3">
            <span className="text-gray-600 text-sm block mb-2">Items:</span>
            <div className="space-y-1">
              {(orderDetails?.items || cartItems).map((item: any) => (
                <div key={item.dish.id} className="flex justify-between items-center">
                  <span className="text-gray-800 text-sm">{item.dish.name}</span>
                  <span className="text-gray-600 text-sm">×{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Status</span>
            <span className="text-green-600 font-semibold text-sm">Preparing</span>
          </div>
        </div>

        {/* Previous Rounds Toggle */}
        <button
          onClick={() => setShowOrderHistory(!showOrderHistory)}
          className="w-full text-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
        >
          {showOrderHistory ? 'Hide Previous Rounds' : 'View Previous Rounds'}
        </button>

        {/* Previous Rounds (Current Session Only) */}
        {showOrderHistory && (
          <div className="w-full space-y-2">
            {(() => {
              // Get current session rounds only
              const currentSessionRounds = JSON.parse(localStorage.getItem('currentSessionRounds') || '[]');
              const previousRounds = currentSessionRounds.slice(0, -1); // Exclude current round
              
              if (previousRounds.length === 0) {
                return (
                  <div className="w-full bg-gray-50 rounded-xl p-4 text-center">
                    <span className="text-gray-500 text-sm">No previous rounds in this session</span>
                  </div>
                );
              }
              
              return previousRounds.reverse().map((order: any) => (
                <OrderHistoryItem key={order.id} order={order} />
              ));
            })()}
          </div>
        )}

        {/* Total Summary */}
        <div className="w-full bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs mb-1">Total</span>
              <span className="text-gray-600 text-sm">
                {(() => {
                  const currentSessionRounds = JSON.parse(localStorage.getItem('currentSessionRounds') || '[]');
                  const roundCount = currentSessionRounds.length;
                  return `${roundCount} Round${roundCount !== 1 ? 's' : ''}`;
                })()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-900 text-xl font-semibold">
                {(() => {
                  const currentSessionRounds = JSON.parse(localStorage.getItem('currentSessionRounds') || '[]');
                  const totalAmount = currentSessionRounds.reduce((sum: number, round: any) => 
                    sum + (round.total || 0), 0);
                  return `LKR ${totalAmount.toFixed(2)}`;
                })()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button 
            onClick={() => {
              // Don't clear cart - allow user to add more items
              navigate('/view-menu');
            }}
            className="w-full h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-full flex justify-center items-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <span className="text-white text-base font-semibold">Order More</span>
          </button>
          
          <button 
            onClick={handleFinishDining}
            className="w-full h-12 bg-white border border-gray-300 hover:bg-gray-50 rounded-full flex justify-center items-center transition-colors"
          >
            <span className="text-gray-700 text-base font-semibold">Finish Dining</span>
          </button>
        </div>
        </div>
      </div>

      {/* Finish Dining Confirmation Popup */}
      {showFinishConfirmation && (
        <div className="PopUp w-72 px-6 py-6 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.4)] border border-gray-200 flex flex-col justify-start items-center gap-6">
              <div className="Title self-stretch flex flex-col justify-start items-center gap-3">
                <div className="ReadyToFinishDining self-stretch text-center text-gray-900 text-xl font-semibold leading-tight">Finish dining?</div>
                <div className="Description self-stretch text-center text-gray-600 text-sm font-normal leading-relaxed">This will request the bill</div>
              </div>
              <div className="Button flex flex-col justify-start items-center gap-3">
                <button
                  onClick={confirmFinishDining}
                  className="Button w-48 h-10 px-6 py-2 bg-green-500 text-white text-base font-semibold rounded-full hover:bg-green-600 transition-colors"
                >
                  Yes, Finish
                </button>
                <button
                  onClick={cancelFinishDining}
                  className="Button w-48 h-10 px-6 py-2 rounded-full border border-gray-300 text-gray-700 text-base font-semibold hover:bg-gray-50 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
      )}
    </div>
  );
};