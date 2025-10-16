import { type FC } from "react";
import { Link } from "react-router-dom";

export const Customer_DiningAreasPage: FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/diningareas.jpg"
            alt="Dining Areas Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Dining Areas</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto px-4">
            Discover the perfect spot to enjoy your meal
          </p>
        </div>
      </section>

      {/* Dining Areas Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Area 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-serif mb-4">The Garden Terrace</h3>
                <p className="mb-4">
                  Surrounded by lush greenery and tropical blooms, the Garden
                  Terrace offers a serene outdoor dining experience. Perfect for
                  relaxed lunches and intimate dinners under the stars.
                </p>
                <p>
                  Enjoy fresh air and the sounds of nature while savoring our
                  signature dishes.
                </p>
              </div>
              <div>
                <img
                  src="/gardenterrace.jpg"
                  alt="Garden Terrace"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Area 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img
                  src="/mainhall.jpg"
                  alt="Main Dining Hall"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="text-2xl font-serif mb-4">Main Dining Hall</h3>
                <p className="mb-4">
                  Our spacious Main Dining Hall is perfect for family gatherings
                  and celebrations. The elegant decor combined with warm
                  lighting creates an inviting ambiance.
                </p>
                <p>
                  Whether you're here for a casual meal or a special occasion,
                  our attentive staff ensures a memorable experience.
                </p>
              </div>
            </div>

            {/* Area 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-serif mb-4">Rooftop Lounge</h3>
                <p className="mb-4">
                  Offering panoramic views of Colombo’s skyline, the Rooftop
                  Lounge is the perfect place for evening cocktails and light
                  bites.
                </p>
                <p>
                  Enjoy live music and a relaxed atmosphere as you watch the
                  sunset.
                </p>
              </div>
              <div>
                <img
                  src="/rooftoplounge.jpg"
                  alt="Rooftop Lounge"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Statistics Section */}
            <div className="text-center">
              <h3 className="text-2xl font-serif mb-6">
                Our Spaces at a Glance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800 mb-2">
                    3
                  </div>
                  <div className="text-gray-600">Distinct Dining Areas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800 mb-2">
                    150+
                  </div>
                  <div className="text-gray-600">Seating Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800 mb-2">
                    24/7
                  </div>
                  <div className="text-gray-600">Ambiance & Comfort</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-serif mb-4">
            Reserve Your Favorite Spot
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether it’s a garden dinner or a rooftop evening, book your perfect
            dining experience with us.
          </p>
          <div className="space-x-4">
            <Link
              to="/reservations"
              className="bg-green-900 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Reserve Now
            </Link>
            <Link
              to="/menu"
              className="border border-green-900 text-green-900 hover:bg-green-50 px-8 py-3 rounded-lg transition-colors"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};