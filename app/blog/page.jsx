import React from "react";

const Blog = () => {
  const plants = [
    { id: 1, name: 'Monstera Deliciosa', care: 
      'Monstera Deliciosa thrives in bright, indirect light but can tolerate low light conditions. Water it when the top 1-2 inches of soil feel dry, usually every 1-2 weeks. Ensure proper drainage to avoid root rot. Mist the leaves occasionally to increase humidity, especially in dry indoor conditions. Fertilize once a month during the growing season (spring and summer).', 
      image: '/plants/monstera.jpg' 
    },
    { id: 2, name: 'Snake Plant', care: 
      'Snake Plants are low-maintenance and ideal for beginners. They can survive in low to medium light but prefer indirect sunlight. Water every 2-3 weeks, letting the soil dry out completely before watering again. Overwatering can lead to root rot, so ensure the pot has good drainage. Snake Plants prefer warmer temperatures and don’t need frequent fertilization. Keep them away from drafts or sudden temperature changes.', 
      image: '/plants/snake-plant.jpg' 
    },
    { id: 3, name: 'Fiddle Leaf Fig', care: 
      'Fiddle Leaf Figs need bright, indirect light, and should be placed near a window with filtered sunlight. Water when the top 2 inches of soil feel dry, usually every 1-2 weeks, but avoid letting the soil stay soggy. It thrives in warm and humid conditions, so consider placing it on a humidity tray or using a humidifier. Wipe the leaves regularly to remove dust. Fertilize once a month during the growing season and prune to encourage new growth.', 
      image: '/plants/fiddle-leaf.jpg' 
    },
    { id: 4, name: 'Peace Lily', care: 
      'Peace Lilies thrive in low to medium light, making them perfect for indoor spaces with little sunlight. Keep the soil evenly moist, but avoid overwatering. Water it when the top 1 inch of soil feels dry, and be sure to empty any water that collects in the saucer beneath the pot. Peace Lilies prefer higher humidity, so misting or placing them near a humidifier can be beneficial. Clean the leaves regularly and fertilize every 6-8 weeks during the growing season.', 
      image: '/plants/peace-lily.jpg' 
    },
    { id: 5, name: 'Aloe Vera', care: 
      'Aloe Vera requires bright, indirect light. Too much direct sunlight can scorch the leaves, while too little light can stunt its growth. Water the plant every 2-3 weeks, allowing the soil to dry out completely between waterings. During the winter months, reduce watering. Aloe Vera thrives in well-draining soil and prefers being slightly root-bound. You can harvest its gel for topical use, but be cautious not to damage the plant while doing so.', 
      image: '/plants/aloe-vera.jpg' 
    },
    { id: 6, name: 'Spider Plant', care: 
      'Spider Plants prefer bright, indirect light but can tolerate some shade. Keep the soil evenly moist, but not soggy. Water when the top of the soil feels dry. During the warmer months, Spider Plants grow actively and may need more frequent watering. They thrive in average household temperatures and humidity. Fertilize once a month during the growing season, but avoid overfertilizing, as this can cause brown leaf tips. Spider Plants also produce “babies,” or offshoots, which can be propagated.', 
      image: '/plants/spider-plant.jpg' 
    },
    { id: 7, name: 'ZZ Plant', care: 
      'ZZ Plants are extremely low-maintenance and can thrive in low light conditions, making them perfect for offices and dark corners. They tolerate drought very well, so water them only when the soil is completely dry, which could be every 2-3 weeks. Avoid overwatering, as this can lead to root rot. ZZ Plants do well in average humidity and temperature but prefer not to be in cold drafts or direct sunlight. Fertilize once every 2-3 months during the growing season.', 
      image: '/plants/zz-plant.jpg' 
    },
    { id: 8, name: 'Areca Palm', care: 
      'Areca Palms prefer bright, indirect light and can tolerate some direct sunlight. They thrive in humidity, so keep them in a room with higher humidity or use a humidifier. Water them when the top 2 inches of soil are dry. It is important not to let the plant sit in water, as this may cause root rot. Areca Palms are sensitive to low temperatures, so avoid placing them in drafty areas. Fertilize monthly during the growing season and occasionally trim dead fronds to maintain a tidy appearance.', 
      image: '/plants/areca-palm.jpg' 
    },
    { id: 9, name: 'Rubber Plant', care: 
      'Rubber Plants require bright, indirect light but can also tolerate low light. Water when the top 1-2 inches of soil are dry, usually every 1-2 weeks. Be cautious not to overwater, as this can cause root rot. Rubber Plants like humidity, so misting or placing the plant near a humidifier can help. Wipe the leaves regularly with a damp cloth to remove dust and keep them looking glossy. Fertilize once a month during the growing season. Prune if the plant gets too tall or leggy.', 
      image: '/plants/rubber-plant.jpg' 
    },
    { id: 10, name: 'Calathea', care: 
      'Calatheas thrive in low to medium light, avoiding direct sunlight, which can scorch their beautiful leaves. Keep the soil evenly moist, but not soggy. Water when the topsoil feels dry, but be sure to avoid letting the plant sit in water. These plants enjoy high humidity, so mist the leaves regularly or place the plant on a humidity tray. Calatheas don’t like being over-fertilized, so feed them sparingly with a balanced liquid fertilizer during the growing season.', 
      image: '/plants/calathea.jpg' 
    },
    { id: 11, name: 'Cactus', care: 
      'Cacti love bright, direct sunlight and require at least 6 hours of sun per day. During the growing season (spring and summer), water them every 2-3 weeks, ensuring the soil dries completely between waterings. In the winter, reduce watering as the cactus goes dormant. Make sure the soil is well-draining to prevent root rot. Fertilize once a month during the growing season with a diluted cactus fertilizer. Cacti also prefer dry air and high temperatures, so avoid placing them in humid or cold areas.', 
      image: '/plants/cactus.jpg' 
    },
    { id: 12, name: 'Pothos', care: 
      'Pothos are incredibly easy to care for and can thrive in low to bright, indirect light. They tolerate some neglect, so only water them when the top of the soil feels dry. Pothos plants don’t like being overwatered, so make sure the soil has proper drainage. They grow well in average humidity and room temperature. Fertilize with a balanced liquid fertilizer once a month during the growing season. Pothos can be propagated easily from cuttings, so feel free to share your plant with friends!', 
      image: '/plants/pothos.jpg' 
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800 font-josefin">
      {/* Hero Section with Background Image */}
      <section
        className="relative h-[75vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/blog.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative text-2xl md:text-6xl font-bold text-gray-100 text-center px-6">
          <span className="block mb-8">Grow with Green Heaven</span>
          <span className="block text-lg md:text-4xl font-normal">Essential Plant Care for Every Home</span>
        </h1>
      </section>

      <section className="py-4 px-6 md:px-36 custom-section">
        <div className="container mx-auto px-4 text-center mb-12">
          <h1 className="text-4xl font-bold text-[#44542B] my-8">🌱 Plant Care</h1>
          <p className="text-lg text-gray-700 montserrat-regular">
            Welcome to our plant care blog! Whether you're a seasoned plant parent or a beginner looking to bring some greenery into your home,
            we've got you covered. In this space, you'll find detailed care guides for various indoor plants to help you keep your plants thriving. 
            Explore and learn how to care for your leafy friends to make your home a vibrant oasis!
          </p>
        </div>

        <div className="container mx-auto px-4">
          <div className="space-y-28">
            {plants.map((plant, index) => (
              <div key={plant.id} className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0">
                {/* Left side: Image */}
                <div className={`flex-shrink-0 ${index % 2 === 0 ? 'md:order-1' : ''}`}>
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="object-cover w-full md:w-[400px] h-[300px] md:h-[400px] rounded-lg shadow-lg"
                  />
                </div>
                {/* Right side: Title and Care Instructions */}
                <div className="text-center px-6 md:text-left flex-1">
                  <h2 className="text-3xl font-bold text-[#44542B] border-b-2 border-[#44542B] pb-2 mb-4">{plant.name}</h2>
                  <p className="mt-6 text-gray-700 font-josefin">{plant.care}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
