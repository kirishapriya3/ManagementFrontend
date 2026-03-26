import { Link } from "react-router-dom";

export default function Home(){
  return(
    <div className="min-h-screen bg-[#4B2E2B] text-[#FFF8F0]">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-screen bg-cover bg-center">
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 mt-28" style={{ fontFamily: 'Inter, sans-serif' }}>
                Welcome to StayMate
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light">
                Where Home Meets Excellence
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="border-2 border-[#FFF8F0] text-[#FFF8F0] px-8 py-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#4B2E2B] transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  className="border-2 border-[#FFF8F0] text-[#FFF8F0] px-8 py-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#4B2E2B] transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Messages Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">
              Your Home Away From Home
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#FFF8F0] p-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
                <h3 className="text-xl font-semibold text-[#4B2E2B] mb-3">
                  Feel Like Home
                </h3>
                <p className="text-gray-600">
                  Experience the comfort and warmth of a true home. Our spaces are designed to make you feel relaxed and cherished.
                </p>
              </div>
              
              <div className="bg-[#FFF8F0] p-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
                <h3 className="text-xl font-semibold text-[#4B2E2B] mb-3">
                  Secure & Safe
                </h3>
                <p className="text-gray-600">
                  Your safety is our priority. With 24/7 security and modern amenities, enjoy peace of mind throughout your stay.
                </p>
              </div>
              
              <div className="bg-[#FFF8F0] p-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
                <h3 className="text-xl font-semibold text-[#4B2E2B] mb-3">
                  Comfortable Stay
                </h3>
                <p className="text-gray-600">
                  Premium facilities and thoughtful services ensure your stay is nothing short of exceptional and comfortable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#4B2E2B]">
        <div className="max-w-6xl mx-auto px-4 text-center py-4">
          <div className="mb-4">
            <h3 className="text-2xl font-bold">
              StayMate Management
            </h3>
          </div>
          <p className="mb-4">
            &copy; 2026 StayMate Management. All rights reserved.
          </p>
          <p className="text-sm">
            Your trusted partner in comfortable and secure living. 
          </p>
        </div>
      </footer>
    </div>
  );
}
