import type { FC } from "react";
import { Link } from "react-router-dom";

export const Customer_HomePage: FC = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-slider-3.jpg"
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left text-white max-w-3xl ">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight font-serif">
              Experience Dining Like Never Before
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              Indulge in a culinary journey that transcends the ordinary.
              <br className="hidden sm:block" />
              Reserve your table today and immerse yourself in a world of
              exquisite flavors and unparalleled comfort.
            </p>
            <Link
              to="reservations"
              className="bg-green-900 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-300"
            >
              Reserve
            </Link>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16 lg:py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-12 font-serif">
            Our Best Offers
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Static Offer Card */}
            <div className="lg:col-span-1 relative rounded-xl overflow-hidden shadow-lg">
              <img
                src="/offer-card-static.png"
                alt="Static offer"
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-6">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                  Up to 40% off
                </h3>
                <p className="text-sm sm:text-base mb-4">
                  Enjoy exclusive discounts on top-rated dishes
                </p>
                <Link
                  to="deals"
                  className="text-white-900 hover:underline font-semibold"
                >
                  SEE ALL DEALS →
                </Link>
              </div>
            </div>

            {/* Scrollable Offer Cards */}
            <div className="lg:col-span-2">
              <div className="overflow-x-auto">
                <div
                  className="flex space-x-4 pb-4"
                  style={{ width: "max-content" }}
                >
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-64 bg-white border rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="relative h-40">
                        <img
                          src="/offer-card-1.png"
                          alt="Offer card"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Most Rated
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-1">
                          Ambul Thiyal Set
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                          Tangy black pepper tuna curry with red rice & mallung
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-bold">800 LKR</span>
                            <span className="ml-2 text-xs text-gray-400 line-through">
                              1290 LKR
                            </span>
                          </div>
                          <span className="text-green-800 text-sm font-semibold">
                            ⭐ 9.7
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Selections Section */}
      <section className="py-12 sm:py-16 lg:py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base text-gray-600 uppercase tracking-wide">
                Signature Selections, Handcrafted for You
              </h3>
              <h2 className="text-2xl sm:text-3xl md:text-4xl leading-tight font-serif">
                Taste the Best of <br />
                Sri Lankan Culinary Art
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Enjoy handpicked creations by our chefs, inspired by the rich
                flavors of Sri Lanka and crafted to offer you an unforgettable
                dining experience.
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-600 font-semibold mb-2">
                ✨ Seasonal Crab Curry with Pol Sambol
              </p>
              <p className="text-sm text-gray-600">
                Fresh local crab tossed in a zesty coconut curry, served with
                vibrant pol sambol.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="border border-black text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Add to favourites
              </button>
              <Link
                to="menu"
                className="bg-green-900 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Explore →
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <img
              src="/chef.png"
              alt="Chef"
              className="w-full h-auto max-w-md mx-auto lg:max-w-none"
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-12 sm:py-16 lg:py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-6 lg:px-8  bg-gray-50 py-12 sm:py-16 lg:py-20 ">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 font-serif">
              A Taste for Every Hour
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Four curated buffets, crafted with Sri Lankan flavor and timeless
              style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                img: "/brunch.png",
                title: "Morning Brunch Experience",
                description:
                  "Fresh fruits, local bites, and warm morning favorites.",
              },
              {
                img: "/lunch.png",
                title: "Midday Lunch Delight",
                description:
                  "Classic rice and curry, seasonal sides, and hearty mains.",
              },
              {
                img: "/hightea.png",
                title: "Afternoon High Tea Ritual",
                description:
                  "Ceylon tea with sweet and savoury Sri Lankan treats.",
              },
              {
                img: "/dinner.png",
                title: "Signature Dinner Affair",
                description:
                  "A refined buffet of rich, local and global flavours.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                </div>
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 lg:py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img
              src="/our-story.png"
              alt="Our Story"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base text-gray-600 uppercase tracking-wide">
                Our Story
              </h3>
              <h2 className="text-2xl sm:text-3xl md:text-4xl leading-tight font-serif">
                Crafted With Heart,
                <br />
                Served With Soul
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                At THON, we believe dining is more than a meal. It's a story
                told through warm hospitality, local ingredients and timeless
                traditions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-yellow-500 font-semibold mb-2">
                  Locally Inspired
                </h4>
                <p className="text-sm text-gray-600">
                  Finest ingredients, elevated with local soul.
                </p>
              </div>
              <div>
                <h4 className="text-yellow-500 font-semibold mb-2">
                  Signature Service
                </h4>
                <p className="text-sm text-gray-600">
                  Gracious, refined, and always personal.
                </p>
              </div>
            </div>

            <Link
              to="our-story"
              className="bg-green-900 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Explore More →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
