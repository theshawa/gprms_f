import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerCart } from "@/hooks/useCustomerCart";

// Mock data for Sri Lankan menu items
const menuCategories = [
  { id: 'rice-curry', name: 'Rice & Curry', icon: '/lunch.png' },
  { id: 'kottu', name: 'Kottu', icon: '/dinner.png', active: true },
  { id: 'hoppers', name: 'Hoppers', icon: '/hightea.png' },
  { id: 'seafood', name: 'Seafood', icon: '/brunch.png' },
  { id: 'string-hoppers', name: 'String Hoppers', icon: '/item1.png' },
  { id: 'rotis', name: 'Rotis', icon: '/lunch.png' },
  { id: 'desserts', name: 'Desserts', icon: '/dinner.png' },
  { id: 'beverages', name: 'Beverages', icon: '/hightea.png' }
];

const menuItems = {
  kottu: [
    { id: 1, name: 'Chicken Kottu', price: 1200.00, image: '/dinner.png' },
    { id: 2, name: 'Beef Kottu', price: 1450.00, image: '/lunch.png' },
    { id: 3, name: 'Vegetable Kottu', price: 950.00, image: '/brunch.png' },
    { id: 4, name: 'Cheese Kottu', price: 1350.00, image: '/hightea.png' }
  ],
  'rice-curry': [
    { id: 5, name: 'Rice & Curry Special', price: 1850.00, image: '/item1.png' },
    { id: 6, name: 'Fish Curry with Rice', price: 1650.00, image: '/lunch.png' },
    { id: 7, name: 'Chicken Curry Rice', price: 1750.00, image: '/dinner.png' },
    { id: 8, name: 'Vegetable Curry Rice', price: 1450.00, image: '/brunch.png' },
    { id: 9, name: 'Dhal Curry Rice', price: 1250.00, image: '/hightea.png' },
    { id: 10, name: 'Coconut Rice Special', price: 1950.00, image: '/item1.png' },
    { id: 11, name: 'Jackfruit Curry Rice', price: 1550.00, image: '/lunch.png' }
  ],
  hoppers: [
    { id: 12, name: 'Plain Hoppers (4pcs)', price: 600.00, image: '/dinner.png' },
    { id: 13, name: 'Egg Hoppers (3pcs)', price: 850.00, image: '/lunch.png' },
    { id: 14, name: 'Milk Hoppers (4pcs)', price: 750.00, image: '/brunch.png' },
    { id: 15, name: 'Hoppers with Curry', price: 1200.00, image: '/hightea.png' }
  ],
  seafood: [
    { id: 16, name: 'Fish Ambul Thiyal', price: 2200.00, image: '/item1.png' },
    { id: 17, name: 'Crab Curry', price: 3500.00, image: '/lunch.png' },
    { id: 18, name: 'Prawn Curry', price: 2800.00, image: '/dinner.png' },
    { id: 19, name: 'Fish Head Curry', price: 2500.00, image: '/brunch.png' }
  ],
  'string-hoppers': [
    { id: 20, name: 'String Hoppers (8pcs)', price: 850.00, image: '/hightea.png' },
    { id: 21, name: 'String Hoppers with Chicken', price: 1350.00, image: '/item1.png' },
    { id: 22, name: 'String Hoppers with Fish', price: 1450.00, image: '/lunch.png' }
  ],
  rotis: [
    { id: 23, name: 'Pol Roti', price: 450.00, image: '/dinner.png' },
    { id: 24, name: 'Coconut Roti', price: 500.00, image: '/brunch.png' },
    { id: 25, name: 'Gotukola Roti', price: 550.00, image: '/hightea.png' }
  ],
  desserts: [
    { id: 26, name: 'Kiribath with Jaggery', price: 450.00, image: '/item1.png' },
    { id: 27, name: 'Kokis', price: 350.00, image: '/lunch.png' },
    { id: 28, name: 'Watalappan', price: 650.00, image: '/dinner.png' }
  ],
  beverages: [
    { id: 29, name: 'King Coconut', price: 250.00, image: '/brunch.png' },
    { id: 30, name: 'Ceylon Tea', price: 200.00, image: '/hightea.png' },
    { id: 31, name: 'Wood Apple Juice', price: 350.00, image: '/item1.png' }
  ]
};

export const Customer_MenuScrollPage: FC = () => {
  const navigate = useNavigate();
  const { cartItems, addItemToCart } = useCustomerCart();
  const [selectedCategory, setSelectedCategory] = useState('kottu');
  const selectedMeal = 'DINNER';

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleAddToCart = (item: any) => {
    const dish = {
      id: item.id,
      name: item.name,
      description: `Delicious ${item.name}`,
      price: item.price,
      ingredients: [],
      image: item.image
    };
    addItemToCart(dish, 1);
  };

  const handleGoBack = () => {
    navigate('/order-summary');
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const currentItems = menuItems[selectedCategory as keyof typeof menuItems] || [];

  return (
    <div className="w-full mx-auto h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <div className="w-full px-6 pt-14 pb-2 bg-white border-b border-gray-300 flex justify-between items-center">
        <button 
          onClick={handleGoBack}
          className="w-12 h-12 bg-gray-100 rounded-full flex justify-center items-center"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-1">
          <div className="text-gray-900 text-xl font-normal">{selectedMeal}</div>
          <div className="w-6 h-6 relative">
            <div className="w-2.5 h-1.5 bg-gray-900 absolute left-2 top-2.5"></div>
          </div>
        </div>
        <div className="flex items-start gap-0.5">
          <div className="w-6 h-6 relative">
            <div className="w-4 h-4 bg-gray-900 absolute left-1 top-1"></div>
          </div>
          <div className="w-6 h-6 relative">
            <div className="w-4 h-4 bg-gray-400 absolute left-1 top-1"></div>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Category Sidebar */}
        <div className="w-24 bg-white border-r border-gray-300 flex flex-col items-center gap-4 pt-4 pb-4 overflow-y-auto">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-16 h-14 p-3 rounded-2xl flex justify-center items-center overflow-hidden ${
                category.active || selectedCategory === category.id
                  ? 'bg-green-100 border border-green-600'
                  : 'bg-gray-100'
              }`}>
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-9 h-9 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/36x36";
                  }}
                />
              </div>
              <div className={`text-xs font-semibold text-center ${
                category.active || selectedCategory === category.id
                  ? 'text-green-600'
                  : 'text-gray-600'
              }`}>
                {category.name}
              </div>
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto pb-20">
          {/* Category Title */}
          <div className="w-full px-4 py-3 bg-white">
            <div className="text-gray-900 text-base font-medium capitalize">{selectedCategory}</div>
          </div>

          {/* Menu Items Grid */}
          <div className="px-4 grid grid-cols-2 gap-4">
            {currentItems.map((item) => (
              <div key={item.id} className="pb-4 bg-white rounded-2xl flex flex-col items-center overflow-hidden shadow-sm border border-gray-100">
                <button
                  onClick={() => navigate(`/menu/dish/${item.id}`)}
                  className="w-full"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/140x140";
                    }}
                  />
                </button>
                <div className="w-full px-3 py-3 flex flex-col items-center gap-3">
                  <button
                    onClick={() => navigate(`/menu/dish/${item.id}`)}
                    className="w-full text-center text-gray-900 text-sm font-semibold leading-tight hover:text-green-600 transition-colors"
                  >
                    {item.name}
                  </button>
                  <div className="w-full flex justify-between items-center">
                    <div className="text-gray-900 text-sm font-normal">
                      LKR {item.price.toFixed(2)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="px-2 py-1 bg-green-600 rounded-full text-white text-xs font-semibold hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View Cart Button */}
      {totalCartItems > 0 && (
        <div className="absolute bottom-4 right-4">
          <div className="relative">
            <button
              onClick={handleViewCart}
              className="px-6 py-2 bg-green-500 rounded-full border border-green-500 flex justify-center items-center"
            >
              <div className="text-white text-base font-semibold">View cart</div>
            </button>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 rounded-full flex justify-center items-center">
              <div className="text-white text-xs font-semibold">{totalCartItems}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
