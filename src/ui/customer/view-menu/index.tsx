import type { FC } from "react";
import { useState } from "react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useCustomerCart } from "@/hooks/useCustomerCart";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "@/ui/staff/shared/page-loader";
import { PageError } from "@/ui/staff/shared/page-error";
import { DishesService } from "@/services/customer/dishes";
import { cloudinary, getCloudinaryImageUrl } from "@/cloudinary";

// Mock data for Sri Lankan categories and dishes
const categories = [
  { id: 1, name: "Rice & Curry", image: "/sample-category.jpeg" },
  { id: 2, name: "Kottu", image: "/sample-category.jpeg" },
  { id: 3, name: "Hoppers", image: "/sample-category.jpeg" },
  { id: 4, name: "Seafood", image: "/sample-category.jpeg" },
  { id: 5, name: "String Hoppers", image: "/sample-category.jpeg" },
  { id: 6, name: "Rotis", image: "/sample-category.jpeg" },
  { id: 7, name: "Desserts", image: "/sample-category.jpeg" },
  { id: 8, name: "Beverages", image: "/sample-category.jpeg" },
];

const dishesByCategory = {
  1: [
    // Rice & Curry
    {
      id: 1,
      name: "Rice & Curry Special",
      price: 1850.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 2,
      name: "Fish Curry with Rice",
      price: 1650.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 3,
      name: "Chicken Curry Rice",
      price: 1750.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 4,
      name: "Vegetable Curry Rice",
      price: 1450.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 5,
      name: "Dhal Curry Rice",
      price: 1250.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 6,
      name: "Coconut Rice Special",
      price: 1950.0,
      image: "/sample-dish.png",
      available: true,
    },
  ],
  2: [
    // Kottu
    {
      id: 7,
      name: "Chicken Kottu",
      price: 1200.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 8,
      name: "Beef Kottu",
      price: 1450.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 9,
      name: "Vegetable Kottu",
      price: 950.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 10,
      name: "Cheese Kottu",
      price: 1350.0,
      image: "/sample-dish.png",
      available: true,
    },
  ],
  3: [
    // Hoppers
    {
      id: 11,
      name: "Plain Hoppers (4pcs)",
      price: 600.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 12,
      name: "Egg Hoppers (3pcs)",
      price: 850.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 13,
      name: "Milk Hoppers (4pcs)",
      price: 750.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 14,
      name: "Hoppers with Curry",
      price: 1200.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 15,
      name: "Sweet Hoppers",
      price: 650.0,
      image: "/sample-dish.png",
      available: true,
    },
  ],
  4: [
    // Seafood
    {
      id: 16,
      name: "Fish Ambul Thiyal",
      price: 2200.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 17,
      name: "Crab Curry",
      price: 3500.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 18,
      name: "Prawn Curry",
      price: 2800.0,
      image: "/sample-dish.png",
      available: true,
    },
  ],
  5: [
    // String Hoppers
    {
      id: 19,
      name: "String Hoppers (8pcs)",
      price: 850.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 20,
      name: "String Hoppers with Chicken",
      price: 1350.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 21,
      name: "String Hoppers with Fish",
      price: 1450.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 22,
      name: "String Hoppers with Dhal",
      price: 1150.0,
      image: "/sample-dish.png",
      available: true,
    },
  ],
  6: [
    // Rotis
    {
      id: 23,
      name: "Pol Roti",
      price: 450.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 24,
      name: "Coconut Roti",
      price: 500.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 25,
      name: "Gotukola Roti",
      price: 550.0,
      image: "/sample-dish.png",
      available: true,
    },
  ],
  7: [
    // Desserts
    {
      id: 26,
      name: "Kiribath with Jaggery",
      price: 450.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 27,
      name: "Watalappan",
      price: 650.0,
      image: "/sample-dish.png",
      available: true,
    },
  ],
  8: [
    // Beverages
    {
      id: 28,
      name: "King Coconut",
      price: 250.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 29,
      name: "Ceylon Tea",
      price: 200.0,
      image: "/sample-dish.png",
      available: true,
    },
    {
      id: 30,
      name: "Wood Apple Juice",
      price: 350.0,
      image: "/sample-dish.png",
      available: true,
    },
  ],
};

export const Customer_HomePage: FC = () => {
  const { auth } = useCustomerAuth();
  const { cartItems } = useCustomerCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(1); // Rice & Curry selected by default

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Get all dishes from all categories for search
  const allDishes = Object.values(dishesByCategory).flat();

  // Determine which dishes to show
  let displayDishes;
  if (searchQuery.trim()) {
    // If searching, search across all categories
    displayDishes = allDishes.filter((dish) =>
      dish.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    // If not searching, show dishes from selected category
    displayDishes =
      dishesByCategory[selectedCategory as keyof typeof dishesByCategory] || [];
  }

  // Helper function to get quantity of specific dish in cart
  const getDishQuantity = (dishId: number): number => {
    const cartItem = cartItems.find((item) => item.dish.id === dishId);
    return cartItem ? cartItem.quantity : 0;
  };

  const firstName = auth?.user?.name?.split(" ")[0] || "Customer";

  const {
    data: dishes = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["customer_dishes"],
    queryFn: () => DishesService.getAll(),
  });

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="dishes list" error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div
        data-layer="Home"
        className="Home w-full mx-auto min-h-screen relative bg-white shadow-lg"
      >
        {/* Header */}
        <div
          data-layer="heading"
          className="Heading px-6 pt-4 pb-2 flex justify-between items-center"
        >
          <div
            data-layer="Hello, Alex! 👋"
            className="HelloAlex text-gray-900 text-xl font-semibold leading-tight"
          >
            Hello, {firstName}! 👋
          </div>
          <div
            data-layer="table No."
            className="TableNo flex justify-start items-center gap-3"
          >
            <div data-svg-wrapper data-layer="Vector" className="Vector">
              <svg
                width="26"
                height="14"
                viewBox="0 0 26 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.58675 0.0594047C0.514188 0.082561 0.394625 0.158921 0.321125 0.228999L0.1875 0.356405V7.0037V13.651L0.328125 13.7717C0.620187 14.0222 1.15956 14.0041 1.37712 13.7365C1.49419 13.5925 1.49956 13.4872 1.49975 11.3242L1.5 9.0625H4.25H7V11.2906C7 13.7366 7.00475 13.7705 7.367 13.911C7.61781 14.0082 7.80156 14.0033 8.04306 13.8929C8.17694 13.8317 8.264 13.7433 8.30831 13.6235C8.35194 13.5057 8.37444 12.2492 8.37463 9.91797L8.375 6.39062H4.9375H1.5V3.36794V0.345248L1.32812 0.202233C1.14281 0.0480612 0.818 -0.0145172 0.58675 0.0594047ZM24.8993 0.0594047C24.8267 0.082561 24.7071 0.158921 24.6336 0.228999C24.5002 0.356124 24.5 0.362404 24.5 3.37351V6.39062H21.061H17.622L17.6391 10.0117C17.6551 13.3817 17.6639 13.6412 17.7665 13.7545C17.9693 13.9783 18.3036 14.0387 18.633 13.911C18.9952 13.7705 19 13.7366 19 11.2906V9.0625H21.75H24.5L24.5002 11.3242C24.5004 13.4872 24.5058 13.5925 24.6229 13.7365C24.8404 14.0041 25.3798 14.0222 25.6719 13.7717L25.8125 13.651V6.99812V0.345248L25.6406 0.202233C25.4553 0.0480612 25.1305 -0.0145172 24.8993 0.0594047ZM5.88037 3.28361C5.72862 3.32383 5.48437 3.44678 5.33762 3.55684C4.97419 3.82937 4.875 4.09712 4.875 4.80541V5.35937H8.53125H12.1875V8.89033V12.4213L11.6884 12.4786C10.2026 12.6492 9.50313 13.0768 10.0655 13.4709C10.5106 13.7826 11.5701 13.9588 13 13.9588C14.0977 13.9588 14.7285 13.8895 15.4095 13.6941C16.0592 13.5076 16.3011 13.2062 15.9972 12.9617C15.7261 12.7435 14.9618 12.5356 14.1406 12.4569L13.8125 12.4254V8.89239V5.35937H17.4688H21.125V4.80541C21.125 4.09778 21.0257 3.82933 20.6635 3.55769C20.1604 3.18034 20.6498 3.20265 12.9733 3.20683C6.96669 3.21011 6.12344 3.2192 5.88037 3.28361Z"
                  fill="var(--text-primary, black)"
                />
              </svg>
            </div>
            <div
              data-layer="05"
              className="text-gray-900 text-base font-semibold leading-tight"
            >
              05
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div
          data-layer="search bar"
          className="SearchBar px-6 py-2 flex flex-col justify-center items-center gap-2.5"
        >
          <div
            data-layer="search"
            className="Search w-full h-12 px-3 py-2 rounded-xl border border-gray-300 flex justify-start items-center gap-2"
          >
            <div
              data-layer="Frame 15397"
              className="Frame15397 flex justify-start items-center gap-2 flex-1"
            >
              <div data-layer="search-1" className="Search1 w-6 h-6 relative">
                <svg
                  className="w-4 h-4 text-gray-600 absolute left-[3px] top-[3px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
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

        {/* Main Content Area */}
        <div className="flex h-[calc(100vh-140px)] overflow-hidden">
          {/* Categories Sidebar */}
          <div data-layer="category" className="Category w-24 bg-white border-r border-gray-300 flex flex-col gap-4 px-3 py-4 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSearchQuery(""); // Clear search when selecting a category
                }}
                data-layer="item" 
                className="Item flex flex-col justify-center items-center gap-2 min-w-0"
              >
                <div 
                  data-layer="icon" 
                  className={`Icon w-16 h-14 p-3 rounded-2xl flex justify-center items-center ${
                    selectedCategory === category.id && !searchQuery.trim()
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
                <div 
                  data-layer={category.name} 
                  className={`text-center text-xs font-semibold tracking-tight leading-tight ${
                    selectedCategory === category.id && !searchQuery.trim()
                      ? 'text-orange-600'
                      : 'text-gray-600'
                  }`}
                >
                  {category.name}
                </div>
              </button>
            ))}
          </div>

          {/* Dishes Grid */}
          <div
            data-layer="Frame 2608249"
            className="Frame2608249 flex-1 overflow-y-auto bg-gray-50"
          >
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-4 sm:p-6 pb-24"
            >
              {dishes.map((dish) => (
                <div
                  key={dish.id}
                  data-layer="card vertical"
                  data-property-1="default"
                  className={`CardVertical w-full bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-start items-center overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:shadow-lg hover:border-gray-200 hover:-translate-y-1`}
                  onClick={() => navigate(`/dish/${dish.id}`)}
                >
                  <div className="relative w-full">
                    <img
                      data-layer="Rectangle 6493"
                      className="Rectangle6493 w-full h-48 object-cover"
                      src={
                        cloudinary
                          ? getCloudinaryImageUrl(dish.image)
                          : dish.image
                      }
                      alt={dish.name}
                    />
                    {/* Quantity Display - Top right of image */}
                    {getDishQuantity(dish.id) > 0 && (
                      <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold shadow-lg">
                        {getDishQuantity(dish.id)}
                      </div>
                    )}
                  </div>
                  <div
                    data-layer="title"
                    className={`Title self-stretch px-6 py-5 flex flex-col justify-center items-start gap-2 text-black`}
                  >
                    <div
                      data-layer="dish name"
                      className="DishName self-stretch text-left text-gray-900 text-lg font-semibold leading-snug tracking-tight"
                    >
                      {dish.name}
                    </div>
                    <div
                      data-layer="price section"
                      className="PriceSection self-stretch flex justify-start items-center"
                    >
                      <div
                        data-layer="price"
                        className="Price text-left text-gray-700 text-base font-medium"
                      >
                        LKR {dish.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View Cart Button - Fixed to bottom of viewport */}
        {totalCartItems > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-8">
            <button
              onClick={() => navigate("/cart")}
              data-layer="button"
              data-left-icom="true"
              data-right-icon="true"
              data-size="large"
              data-state="default"
              data-type="black btn"
              className="Button w-full h-14 px-6 py-4 bg-gray-900 rounded-[360px] inline-flex justify-center items-center gap-2.5 transition-all duration-300 shadow-lg transform hover:scale-105 hover:bg-gray-800 active:scale-95"
            >
              <div
                data-layer="button name"
                className="ButtonName text-center text-white text-base font-semibold leading-tight"
              >
                View cart ({totalCartItems})
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
