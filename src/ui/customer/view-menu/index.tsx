import type { FC } from "react";
import { useState } from "react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useCustomerCart } from "@/hooks/useCustomerCart";
import { useNavigate } from "react-router-dom";

// Mock data for Sri Lankan categories and dishes
const categories = [
  { id: 1, name: "Rice & Curry", image: "https://placehold.co/36x36" },
  { id: 2, name: "Kottu", image: "https://placehold.co/36x36" },
  { id: 3, name: "Hoppers", image: "https://placehold.co/36x36" },
  { id: 4, name: "Seafood", image: "https://placehold.co/36x36" },
  { id: 5, name: "String Hoppers", image: "https://placehold.co/36x36" },
  { id: 6, name: "Rotis", image: "https://placehold.co/36x36" },
  { id: 7, name: "Desserts", image: "https://placehold.co/36x36" },
  { id: 8, name: "Beverages", image: "https://placehold.co/36x36" },
];

const dishesByCategory = {
  1: [ // Rice & Curry
    { id: 1, name: "Rice & Curry Special", price: 1850.00, image: "https://placehold.co/140x140", available: true },
    { id: 2, name: "Fish Curry with Rice", price: 1650.00, image: "https://placehold.co/140x140", available: true },
    { id: 3, name: "Chicken Curry Rice", price: 1750.00, image: "https://placehold.co/140x140", available: true },
    { id: 4, name: "Vegetable Curry Rice", price: 1450.00, image: "https://placehold.co/140x140", available: true },
    { id: 5, name: "Dhal Curry Rice", price: 1250.00, image: "https://placehold.co/140x140", available: true },
    { id: 6, name: "Coconut Rice Special", price: 1950.00, image: "https://placehold.co/140x140", available: true },
  ],
  2: [ // Kottu
    { id: 7, name: "Chicken Kottu", price: 1200.00, image: "https://placehold.co/140x140", available: true },
    { id: 8, name: "Beef Kottu", price: 1450.00, image: "https://placehold.co/140x140", available: true },
    { id: 9, name: "Vegetable Kottu", price: 950.00, image: "https://placehold.co/140x140", available: true },
    { id: 10, name: "Cheese Kottu", price: 1350.00, image: "https://placehold.co/140x140", available: true },
  ],
  3: [ // Hoppers
    { id: 11, name: "Plain Hoppers (4pcs)", price: 600.00, image: "https://placehold.co/140x140", available: true },
    { id: 12, name: "Egg Hoppers (3pcs)", price: 850.00, image: "https://placehold.co/140x140", available: true },
    { id: 13, name: "Milk Hoppers (4pcs)", price: 750.00, image: "https://placehold.co/140x140", available: true },
    { id: 14, name: "Hoppers with Curry", price: 1200.00, image: "https://placehold.co/140x140", available: true },
    { id: 15, name: "Sweet Hoppers", price: 650.00, image: "https://placehold.co/140x140", available: true },
  ],
  4: [ // Seafood
    { id: 16, name: "Fish Ambul Thiyal", price: 2200.00, image: "https://placehold.co/140x140", available: true },
    { id: 17, name: "Crab Curry", price: 3500.00, image: "https://placehold.co/140x140", available: true },
    { id: 18, name: "Prawn Curry", price: 2800.00, image: "https://placehold.co/140x140", available: true },
  ],
  5: [ // String Hoppers
    { id: 19, name: "String Hoppers (8pcs)", price: 850.00, image: "https://placehold.co/140x140", available: true },
    { id: 20, name: "String Hoppers with Chicken", price: 1350.00, image: "https://placehold.co/140x140", available: true },
    { id: 21, name: "String Hoppers with Fish", price: 1450.00, image: "https://placehold.co/140x140", available: true },
    { id: 22, name: "String Hoppers with Dhal", price: 1150.00, image: "https://placehold.co/140x140", available: true },
  ],
  6: [ // Rotis
    { id: 23, name: "Pol Roti", price: 450.00, image: "https://placehold.co/140x140", available: true },
    { id: 24, name: "Coconut Roti", price: 500.00, image: "https://placehold.co/140x140", available: true },
    { id: 25, name: "Gotukola Roti", price: 550.00, image: "https://placehold.co/140x140", available: true },
  ],
  7: [ // Desserts
    { id: 26, name: "Kiribath with Jaggery", price: 450.00, image: "https://placehold.co/140x140", available: true },
    { id: 27, name: "Watalappan", price: 650.00, image: "https://placehold.co/140x140", available: true },
  ],
  8: [ // Beverages
    { id: 28, name: "King Coconut", price: 250.00, image: "https://placehold.co/140x140", available: true },
    { id: 29, name: "Ceylon Tea", price: 200.00, image: "https://placehold.co/140x140", available: true },
    { id: 30, name: "Wood Apple Juice", price: 350.00, image: "https://placehold.co/140x140", available: true },
  ],
};

export const Customer_HomePage: FC = () => {
  const { auth } = useCustomerAuth();
  const { cartItems, addItemToCart } = useCustomerCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(1); // Rice & Curry selected by default

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Get dishes for selected category
  const currentDishes = dishesByCategory[selectedCategory as keyof typeof dishesByCategory] || [];

  const handleAddToCart = (dish: typeof currentDishes[0]) => {
    if (!dish.available) return;
    
    const dishItem = {
      id: dish.id,
      name: dish.name,
      description: `Delicious ${dish.name}`,
      price: dish.price,
      ingredients: [],
      image: dish.image
    };
    addItemToCart(dishItem, 1);
  };

  const firstName = auth?.user?.name?.split(' ')[0] || 'Sudu';

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start">
      <div data-layer="Home" className="Home w-full max-w-sm mx-auto min-h-screen relative">
        <div data-layer="home" className="Home w-full min-h-screen bg-white overflow-y-auto shadow-lg">
        
        {/* Search Bar */}
        <div data-layer="search bar" className="SearchBar w-96 px-6 py-4 left-0 top-[116px] absolute inline-flex flex-col justify-center items-center gap-2.5">
          <div data-layer="search" className="Search self-stretch h-12 px-3 py-2 rounded-xl border border-gray-300 inline-flex justify-start items-center gap-2">
            <div data-layer="Frame 15397" className="Frame15397 w-52 flex justify-start items-center gap-2">
              <div data-layer="search-1" className="Search1 w-6 h-6 relative">
                <svg className="w-4 h-4 text-gray-600 absolute left-[3px] top-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text"
                placeholder="Enter a dish"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-gray-600 text-base font-normal bg-transparent outline-none flex-1"
              />
            </div>
          </div>
        </div>

        {/* Header */}
        <div data-layer="heading" className="Heading w-80 left-[24px] top-[60px] absolute inline-flex justify-between items-center">
          <div data-layer="Hello, Alex! 👋" className="HelloAlex text-gray-900 text-xl font-semibold leading-tight">
            Hello, {firstName}! 👋
          </div>
          <div data-layer="table No." className="TableNo inline-flex flex-col justify-start items-start">
            <div data-layer="Table No." className="TableNo text-gray-900 text-xs font-normal leading-none">Table No.</div>
            <div data-layer="icon" className="Icon inline-flex justify-start items-center gap-1">
              <div data-layer="trace 1" className="Trace1 w-8 h-6 relative overflow-hidden">
                <svg className="w-6 h-4 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                </svg>
              </div>
              <div data-layer="05" className="text-gray-900 text-base font-semibold leading-tight">05</div>
            </div>
          </div>
        </div>

        {/* Categories Sidebar */}
        <div data-layer="category" className="Category h-[921px] pl-6 pr-1 pt-4 left-[-1px] top-[216px] absolute bg-white border-r-[0.50px] border-gray-300 inline-flex flex-col justify-start items-start gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              data-layer="item" 
              className="Item flex flex-col justify-start items-center gap-2"
            >
              <div 
                data-layer="icon" 
                className={`Icon w-16 h-14 p-3 rounded-2xl inline-flex justify-center items-center gap-2.5 overflow-hidden ${
                  selectedCategory === category.id
                    ? 'bg-orange-100 border border-orange-600'
                    : 'bg-gray-100'
                }`}
              >
                <img 
                  data-layer="Rectangle 6489" 
                  className="Rectangle6489 w-9 h-9" 
                  src={category.image} 
                  alt={category.name}
                />
              </div>
              <div data-layer="group menu" className="GroupMenu self-stretch flex flex-col justify-center items-center gap-2">
                <div 
                  data-layer={category.name} 
                  className={`self-stretch text-center text-xs font-semibold tracking-tight ${
                    selectedCategory === category.id
                      ? 'text-orange-600'
                      : 'text-gray-600'
                  }`}
                >
                  {category.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      <div data-layer="Frame 2608249" className="Frame2608249 left-[110px] top-[217px] absolute right-0 bottom-0 overflow-y-auto">
        <div className="inline-flex flex-col justify-start items-start gap-5 pl-3 pr-5 pt-5 pb-32">
        {currentDishes.map((dish) => (
          <div 
            key={dish.id}
            data-layer="card vertical" 
            data-property-1="default" 
            className={`CardVertical w-52 pb-4 bg-white rounded-2xl border border-black/10 flex flex-col justify-start items-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${
              !dish.available ? 'opacity-60' : ''
            }`}
            onClick={() => navigate(`/dish/${dish.id}`)}
          >
            <img 
              data-layer="Rectangle 6493" 
              className="Rectangle6493 w-44 h-44" 
              src={dish.image}
              alt={dish.name}
            />
            <div 
              data-layer="title" 
              className={`Title self-stretch px-3 flex flex-col justify-center items-end gap-3 ${
                !dish.available ? 'opacity-10' : ''
              }`}
            >
              <div data-layer="dish name" className="DishName self-stretch text-center text-gray-900 text-base font-semibold leading-tight">
                {dish.name}
              </div>
              <div data-layer="price section" className="PriceSection self-stretch flex justify-center items-center gap-2 py-1">
                <div data-layer="price" className="Price text-center text-gray-900 text-lg font-bold leading-tight">
                  LKR {dish.price.toFixed(2)}
                </div>
                <div data-layer="currency" className="Currency text-center text-gray-600 text-sm font-normal leading-tight">
                  
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click when clicking add button
                  handleAddToCart(dish);
                }}
                disabled={!dish.available}
                data-layer="button" 
                className="Button p-1.5 bg-gray-900 rounded inline-flex justify-center items-center gap-2.5 hover:bg-gray-800 transition-colors disabled:cursor-not-allowed"
              >
                <div data-layer="Frame 15361" className="Frame15361 w-3 h-3 flex justify-center items-center">
                  <div data-layer="plus" className="Plus w-3 h-3 relative flex justify-center items-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M7 0H5v5H0v2h5v5h2V7h5V5H7V0z"/>
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* View Cart Button - Fixed to bottom of viewport */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-8">
          <button
            onClick={() => navigate('/cart')}
            data-layer="button" 
            data-left-icom="true" 
            data-right-icon="true" 
            data-size="large" 
            data-state="default" 
            data-type="black btn" 
            className="Button w-full h-14 px-6 py-4 bg-gray-900 rounded-[360px] inline-flex justify-center items-center gap-2.5 hover:bg-gray-800 transition-colors shadow-lg"
          >
            <div data-layer="button name" className="ButtonName text-center text-white text-base font-semibold leading-tight">
              View cart ({totalCartItems})
            </div>
          </button>
        </div>
      )}
      </div>
    </div>
  );
};
