import { type FC } from "react";

export const Customer_ContactPage: FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/contact.jpg"
            alt="Contact Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto px-4">
            We're here to help—reach out and say hello!
          </p>
        </div>
      </section>

      {/* Contact Details & Form */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-serif mb-4">Visit Us</h3>
                <p className="text-gray-700">
                  123 Cinnamon Street,
                  <br />
                  Colombo 07, Sri Lanka
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-serif mb-4">Call</h3>
                <p className="text-gray-700">+94 77 123 4567</p>
              </div>

              <div>
                <h3 className="text-2xl font-serif mb-4">Email</h3>
                <p className="text-gray-700">contact@thon.lk</p>
              </div>

              <div>
                <h3 className="text-2xl font-serif mb-4">Opening Hours</h3>
                <p className="text-gray-700">Monday – Sunday: 10 AM – 10 PM</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-serif mb-6 text-center">
                Send Us a Message
              </h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:outline-none"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Message</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:outline-none"
                    rows={5}
                    placeholder="Type your message..."
                    required
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-serif mb-4">Let’s Connect</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're planning a special evening or just have a quick
            question, we're just a message away.
          </p>
          <a
            href="/reservations"
            className="bg-green-900 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Book a Reservation
          </a>
        </div>
      </section>
    </div>
  );
};