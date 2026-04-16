import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Pattern from "../components/Pattern";

// function to split letters
const splitLetters = (text) => text.split("");

export default function Home(){
 const title = "Welcome to StayMate";
  const subtitle = "Where Home Meets Excellence";

return(
  <div className="min-h-screen bg-[#4B2E2B] text-[#FFF8F0]">

    {/* Hero Section with Building Image */}
     <section className="relative">
        <div className="relative h-screen bg-cover bg-center">
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4">

              {/* TITLE */}
             <motion.h1
  className="text-5xl md:text-6xl font-bold mb-6 mt-28 flex flex-wrap justify-center"
  style={{ fontFamily: 'Inter, sans-serif' }}
>
  {splitLetters(title).map((char, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.05,  // fast letter animation
        duration: 0.3,
      }}
      className="inline-block"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  ))}
</motion.h1>

              {/* SUBTITLE */}
             <motion.p
  className="text-xl md:text-2xl mb-8 font-light flex flex-wrap justify-center"
>
  {splitLetters(subtitle).map((char, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 1.5 + index * 0.04, // starts after title
        duration: 0.3,
      }}
      className="inline-block"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  ))}
</motion.p>

              {/* BUTTONS */}
<motion.div
  className="flex flex-col sm:flex-row gap-4 justify-center"
>
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 2.5, duration: 0.6 }}
  >
    <Link to="/register" className="border-2 border-[#FFF8F0] px-8 py-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#4B2E2B] transition-all duration-300 transform hover:scale-105 font-semibold">
      Get Started
    </Link>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 2.8, duration: 0.6 }}
  >
    <Link to="/login" className="border-2 border-[#FFF8F0] px-8 py-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#4B2E2B] transition-all duration-300 transform hover:scale-105 font-semibold">
      Sign In
    </Link>
  </motion.div>
</motion.div>

            </div>
          </div>
        </div>
      </section>

    {/* Welcome Messages Section */}
   <section className="py-16 px-4">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <motion.h2
  className="text-4xl font-bold mb-10 flex flex-wrap justify-center"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.5 }} // 👈 important
>
  {splitLetters("Your Home Away From Home").map((char, index) => (
    <motion.span
      key={index}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
      }}
      className="whitespace-pre"
    >
      {char}
    </motion.span>
  ))}
</motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* CARD 1 */}
        <div className="card-uiverse shadow-lg hover:scale-105 transition-transform duration-300">
          <div className="card-content flex flex-col items-center justify-center h-full">
            <h3 className="card-title text-xl font-semibold text-[#4B2E2B] text-center">
              Feel Like Home
            </h3>
            <p className="card-hover-text text-gray-700 text-center mt-2">
              Experience the comfort and warmth of a true home. Our spaces are designed to make you feel relaxed and cherished.
            </p>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="card-uiverse shadow-lg">
          <div className="card-content flex flex-col items-center justify-center h-full">
            <h3 className="card-title text-xl font-semibold text-[#4B2E2B] text-center">
              Secure & Safe
            </h3>
            <p className="card-hover-text text-gray-700 text-center mt-2">
              Your safety is our priority. With 24/7 security and modern amenities, enjoy peace of mind throughout your stay.
            </p>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="card-uiverse shadow-lg">
          <div className="card-content flex flex-col items-center justify-center h-full">
            <h3 className="card-title text-xl font-semibold text-[#4B2E2B] text-center">
              Comfortable Stay
            </h3>
            <p className="card-hover-text text-gray-700 text-center mt-2">
              Premium facilities and thoughtful services ensure your stay is nothing short of exceptional and comfortable.
            </p>
          </div>
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
    <section className="py-16 bg-[#4B2E2B]">
  <div className="max-w-4xl mx-auto text-center px-4">

    {/* HEADING */}
    <motion.h2
      className="text-3xl font-bold mb-6 flex flex-wrap justify-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.6 }}
    >
      {"Thank You for Choosing StayMate".split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" }
          }}
          transition={{
            delay: index * 0.04,
            duration: 0.4,
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h2>

    {/* PARAGRAPH */}
    <motion.p
      className="text-xl mb-8 flex flex-wrap justify-center"
      initial={{ opacity: 0, y: 100 }}  // Start from bottom
      whileInView={{ opacity: 1, y: 0 }}  // Move to top
      viewport={{ once: false, amount: 0.6 }}
      transition={{
        delay: 1,  // Start after heading
        duration: 0.6,
      }}
    >
      We're honored to be part of your journey. Our commitment to excellence ensures that every moment with us is memorable.
    </motion.p>

    {/* BUTTONS */}
    <motion.div
      className="flex flex-col sm:flex-row gap-4 justify-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ delay: 2.2, duration: 0.5 }}
      >
        <Link 
          to="/register" 
          className="border-2 border-[#FFF8F0] text-[#FFF8F0] px-8 py-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#4B2E2B] transition-all duration-300 transform hover:scale-105 font-semibold"
        >
          Join Our Community
        </Link>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ delay: 2.4, duration: 0.5 }}
      >
        <Link 
          to="/login" 
          className="border-2 border-[#FFF8F0] text-[#FFF8F0] px-8 py-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#4B2E2B] transition-all duration-300 transform hover:scale-105 font-semibold"
        >
          Access Your Account
        </Link>
      </motion.div>
    </motion.div>

  </div>
</section>

    <div className="FFF8F0 ml-12 mr-12"><hr /></div>
    

    {/* Footer */}
    <footer className="py-8 bg-[#4B2E2B]">
  <div className="max-w-6xl mx-auto px-4 text-center py-4">

    {/* TYPEWRITER HEADING */}
    <motion.h3
      className="text-2xl font-bold mb-4 flex justify-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.6 }} // 👈 triggers on scroll
    >
      {"StayMate Management".split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          transition={{
            delay: index * 0.06, // typing speed
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h3>

    {/* TEXT */}
    <motion.p
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ delay: 1.5 }}
    >
      &copy; 2026 StayMate Management. All rights reserved.
    </motion.p>

    <motion.p
      className="text-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ delay: 1.8 }}
    >
      Your trusted partner in comfortable and secure living.
    </motion.p>

  </div>
</footer>
  </div>
);
}