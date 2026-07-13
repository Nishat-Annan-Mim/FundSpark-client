"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "Fund Ideas That Matter",
    subtitle:
      "Back creators, causes, and products you believe in — one contribution at a time.",
    bg: "from-indigo-600 to-purple-700",
  },
  {
    title: "Launch Your Own Campaign",
    subtitle:
      "Turn your vision into reality with support from a community that cares.",
    bg: "from-emerald-600 to-teal-700",
  },
  {
    title: "Every Credit Counts",
    subtitle:
      "Small contributions add up to big change. Join thousands making an impact.",
    bg: "from-rose-600 to-orange-600",
  },
];

export default function HeroSection() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="h-[500px] md:h-[600px]"
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div
            className={`h-full w-full bg-gradient-to-br ${slide.bg} flex items-center justify-center px-6`}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {slide.title}
              </h1>
              <p className="text-white/90 text-base md:text-lg mb-8">
                {slide.subtitle}
              </p>
              <Link
                href="/campaigns"
                className="inline-block bg-white text-slate-800 font-medium px-6 py-3 rounded-lg hover:bg-slate-100 transition"
              >
                Explore Campaigns
              </Link>
            </motion.div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}