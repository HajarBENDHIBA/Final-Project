"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';


export default function HomePage() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >

      {/* Animated Content Box */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl px-8 py-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-6xl font-extrabold text-white drop-shadow-lg"
        >
          Welcome to Green Heaven
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 text-xl text-gray-800 drop-shadow-md"
        >
          Discover a world of greenery for your home and garden.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-3 text-lg text-gray-700"
        >
          Transform your space with our carefully curated plants and accessories.
        </motion.p>

       {/* Animated Call-to-Action Button */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, delay: 0.6 }}
  className="mt-6"
>
  <Link
    href="/about"
    className="inline-block px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-[#4A7023] to-[#6B8E23] rounded-full shadow-xl transform transition hover:scale-105 hover:from-[#7FA15A] hover:to-[#A2C579]"
  >
    🌱 Learn More About Us
  </Link>
</motion.div>

      </motion.div>
    </section>
  );
}
