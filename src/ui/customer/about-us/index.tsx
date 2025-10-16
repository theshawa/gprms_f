import { type FC } from "react";
import { Link } from "react-router-dom";

export const Customer_AboutPage: FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/aboutus.jpg"
            alt="Our Story Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Our Story</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto px-4">
            Every dish has a story, every flavor a memory
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
              <p className="text-xl text-center mb-12 font-light text-gray-600">
                In the heart of Colombo, where the aroma of spices dances
                through the air and stories are shared over steaming plates of
                rice and curry, THON was born from a simple dream: to share the
                soul of Sri Lankan cuisine with the world.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h3 className="text-2xl font-serif mb-4">The Dream Begins</h3>
                  <p className="mb-4">
                    It started with Grandmother Kamala's kitchen, where the
                    secret was never just the ingredients, but the love stirred
                    into every curry, the patience in every slow-cooked dal, and
                    the joy shared around every table.
                  </p>
                  <p>
                    Her grandson, now our Executive Chef, learned that cooking
                    wasn't just about following recipes - it was about
                    understanding the story each ingredient tells, the history
                    each spice carries.
                  </p>
                </div>
                <div>
                  <img
                    src="/traditionalkitchen.jpg"
                    alt="Traditional Kitchen"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 p-8 rounded-lg mb-16">
                <blockquote className="text-xl text-center font-serif text-yellow-800">
                  "Food is the thread that weaves families together, the
                  language that speaks to the heart without words."
                  <footer className="text-sm mt-4 text-yellow-600">
                    - Grandmother Kamala
                  </footer>
                </blockquote>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="order-2 lg:order-1">
                  <img
                    src="/modernrestaurant.jpg"
                    alt="Modern Restaurant"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-2xl font-serif mb-4">Growing Together</h3>
                  <p className="mb-4">
                    As word spread about our little corner of culinary heaven,
                    we realized our story was becoming part of something bigger.
                    Each guest who walked through our doors brought their own
                    story, their own memories to be made.
                  </p>
                  <p>
                    We've grown from a small family business to a beloved
                    destination, but our heart remains the same: to create
                    moments that matter, one meal at a time.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-serif mb-6">Today & Tomorrow</h3>
                <p className="text-lg mb-8">
                  Today, THON stands as more than just a restaurant. We're a
                  bridge between tradition and innovation, a place where the
                  past informs the present, and where every guest becomes part
                  of our continuing story.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-800 mb-2">
                      30+
                    </div>
                    <div className="text-gray-600">Years of Excellence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-800 mb-2">
                      50,000+
                    </div>
                    <div className="text-gray-600">Happy Guests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-800 mb-2">
                      100+
                    </div>
                    <div className="text-gray-600">Signature Dishes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-serif mb-4">Become Part of Our Story</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Every meal at THON is a new chapter waiting to be written. Join us
            and add your story to ours.
          </p>
          <div className="space-x-4">
            <Link
              to="/reservations"
              className="bg-green-900 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Reserve Your Table
            </Link>
            <Link
              to="/menu"
              className="border border-green-900 text-green-900 hover:bg-green-50 px-8 py-3 rounded-lg transition-colors"
            >
              Explore Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};