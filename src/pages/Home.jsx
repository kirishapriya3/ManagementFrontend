import { Link } from "react-router-dom";

export default function Home(){

return(
  <div className="min-h-screen bg-[#4B2E2B] text-[#FFF8F0]">
    {/* Navigation Header */}
    {/* <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">
                StayMate Management
              </h1>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/login" 
              className="border-2 border-[#FFF8F0] text-[#FFF8F0] px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-[#FFF8F0] text-[#4B2E2B] px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header> */}

    {/* Hero Section with Building Image */}
    <section className="relative">
      {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div> */}
      <div 
        className="relative h-screen bg-cover bg-center"
        // style={{
        //   backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        // }}
      >
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-[#FFF8F0] px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 mt-28 animate-fade-in">
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
              <div className="text-4xl mb-4 hover:animate-bounce">🏠</div>
              <h3 className="text-xl font-semibold text-[#4B2E2B] mb-3">
                Feel Like Home
              </h3>
              <p className="text-gray-600">
                Experience the comfort and warmth of a true home. Our spaces are designed to make you feel relaxed and cherished.
              </p>
            </div>
            
            <div className="bg-[#FFF8F0] p-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
              <div className="text-4xl mb-4 hover:rotate-12 transition-transform duration-300">🛡️</div>
              <h3 className="text-xl font-semibold text-[#4B2E2B] mb-3">
                Secure & Safe
              </h3>
              <p className="text-gray-600">
                Your safety is our priority. With 24/7 security and modern amenities, enjoy peace of mind throughout your stay.
              </p>
            </div>
            
            <div className="bg-[#FFF8F0] p-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
              <div className="text-4xl mb-4 hover:animate-pulse">⭐</div>
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

    {/* Features Section */}
    {/* <section className="py-16 bg-gray-50"> */}
    {/* <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Comprehensive Management Solutions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FFF8F0] p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 transform text-center">
            <div className="text-3xl mb-4 hover:animate-spin">🏠</div>
            <h3 className="font-bold text-[#4B2E2B] mb-2">
              Room Allocation
            </h3>
            <p className="text-gray-600 text-sm">
              Smart room management and allocation system
            </p>
          </div>

          <div className="bg-[#FFF8F0] p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 transform text-center">
            <div className="text-3xl mb-4 hover:animate-spin">🔧</div>
            <h3 className="font-bold text-[#4B2E2B] mb-2">
              Maintenance
            </h3>
            <p className="text-gray-600 text-sm">
              Quick and efficient maintenance tracking
            </p>
          </div>

          <div className="bg-[#FFF8F0] p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 transform text-center">
            <div className="text-3xl mb-4 hover:animate-ping">💳</div>
            <h3 className="font-bold text-[#4B2E2B] mb-2">
              Billing
            </h3>
            <p className="text-gray-600 text-sm">
              Seamless payment and billing management
            </p>
          </div>

          <div className="bg-[#FFF8F0] p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 transform text-center">
            <div className="text-3xl mb-4 hover:animate-pulse">🔔</div>
            <h3 className="font-bold text-[#4B2E2B] mb-2">
              Notifications
            </h3>
            <p className="text-gray-600 text-sm">
              Stay updated with real-time alerts
            </p>
          </div>
        </div>
      </div>
    </section> */}

    {/* Thank You Section */}
    {/* <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white"> */}
    <section className="py-16 bg-[#4B2E2B]">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-6">
          Thank You for Choosing StayMate
        </h2>
        <p className="text-xl mb-8">
          We're honored to be part of your journey. Our commitment to excellence ensures that every moment with us is memorable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/register" 
            className="border-2 border-[#FFF8F0] text-[#FFF8F0] px-8 py-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#4B2E2B] transition-colors font-semibold"
          >
            Join Our Community
          </Link>
          <Link 
            to="/login" 
            className="border-2 border-[#FFF8F0] text-[#FFF8F0] px-8 py-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#4B2E2B] transition-colors font-semibold"
          >
            Access Your Account
          </Link>
        </div>
      </div>
    </section>

    <div className="FFF8F0 ml-12 mr-12"><hr /></div>
    

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
        <p className="text-sm ">
          Your trusted partner in comfortable and secure living. 
        </p>
      </div>
    </footer>
  </div>
);
}