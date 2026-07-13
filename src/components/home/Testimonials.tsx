"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const testimonials = [
  {
    name: "Ayesha Rahman",
    photo: "https://i.pravatar.cc/100?img=32",
    quote:
      "I raised funds for my community library project in under a month. The process felt safe and transparent.",
  },
  {
    name: "Tanvir Hasan",
    photo: "https://i.pravatar.cc/100?img=12",
    quote:
      "Supporting small creators here feels meaningful — I can actually track where my credits go.",
  },
  {
    name: "Nusrat Jahan",
    photo: "https://i.pravatar.cc/100?img=47",
    quote:
      "The withdrawal process was smooth and the platform kept me updated at every step.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-10">
          What Our Community Says
        </h2>
        <Swiper modules={[Autoplay]} autoplay={{ delay: 4000 }} loop>
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center px-6 pb-10">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover mb-4"
                />
                <p className="text-slate-600 italic max-w-xl mb-3">
                  "{t.quote}"
                </p>
                <p className="font-semibold text-slate-800">{t.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
