import Image from "next/image";

export default function About() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section with Background Image */}
      <section
        className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/about.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative text-4xl md:text-6xl font-bold text-gray-100 text-center px-6">
          Discover Our Green Journey
        </h1>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-[#7FA15A] mb-12">Our Passion for Nature</h2>
        <p className="text-xl leading-relaxed max-w-6xl mx-auto">
        At Green Heaven, we believe that plants are more than just decorations—they are a source of tranquility, beauty, and 
      connection to nature. Our passion for greenery drives us to curate a diverse selection of high-quality plants, from 
      resilient indoor varieties to lush outdoor species, ensuring that every space can flourish with life. More than just a 
      marketplace, we are dedicated to educating and empowering plant lovers through expert care tips, sustainable gardening 
      practices, and eco-friendly solutions. Whether you're nurturing your first plant or expanding your personal jungle, we 
      are here to support you in creating a thriving, refreshing, and environmentally conscious home.
    </p>
      </section>

      {/* Sustainable Impact Section */}
    <section className="bg-gray-50 py-16">
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold text-[#7FA15A] mb-12 animate__animated animate__fadeIn animate__delay-1s">
      Our Sustainable Impact
    </h2>
    <div className="flex flex-wrap justify-center gap-8">
      <div className="max-w-sm p-8 bg-white shadow-2xl rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out animate__animated animate__fadeIn animate__delay-2s">
        <h3 className="flex items-center gap-2 text-2xl font-semibold text-[#6B8E23] mb-4">
          <span>Eco-Friendly Practices</span> 
          <span className="text-green-500">🌿</span>
        </h3>
        <p className="text-gray-700 text-lg">
          We strive to minimize our environmental footprint by using sustainable materials and eco-friendly packaging for all our products.
        </p>
      </div>
      <div className="max-w-sm p-8 bg-white shadow-2xl rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out animate__animated animate__fadeIn animate__delay-3s">
        <h3 className="flex items-center gap-2 text-2xl font-semibold text-[#6B8E23] mb-4">
          <span>Planting for the Future</span> 
          <span className="text-green-500">🌱</span>
        </h3>
        <p className="text-gray-700 text-lg">
          For every purchase made, we contribute to tree planting projects worldwide to help restore forests and reduce carbon emissions.
        </p>
      </div>
      <div className="max-w-sm p-8 bg-white shadow-2xl rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out animate__animated animate__fadeIn animate__delay-4s">
        <h3 className="flex items-center gap-2 text-2xl font-semibold text-[#6B8E23] mb-4">
          <span>Educational Outreach</span> 
          <span className="text-green-500">📚</span>
        </h3>
        <p className="text-gray-700 text-lg">
          We offer free plant care workshops and resources to help communities become more self-sufficient and sustainable in their plant care practices.
        </p>
      </div>
    </div>
  </div>
</section>
 
      {/* Founder Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#7FA15A] mb-12">Meet Our Founder</h2>
          <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold">Hajar BENDHIBA</h3>
            <p className="text-green-600">Founder & Visionary</p>
            <p className="mt-4 text-gray-700">
              Hajar created Green Heaven with the dream of making plant care easy and accessible. 
              She believes in the power of nature to bring joy, relaxation, and beauty into everyday life.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#7FA15A] text-white py-16 text-center">
        <h2 className="text-4xl font-bold">Join Our Green Community!</h2>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          Discover the best plants for your home and learn how to take care of them.
          Connect with other plant lovers today.
        </p>
        <a
          href="/shop"
          className="mt-6 inline-block bg-white text-[#7FA15A] font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-200 transition"
        >
          Visit Our Shop
        </a>
      </section>
    </div>
  );
}
