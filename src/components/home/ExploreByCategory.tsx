"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  { name: "Technology", emoji: "💻" },
  { name: "Art", emoji: "🎨" },
  { name: "Community", emoji: "🤝" },
  { name: "Health", emoji: "🏥" },
  { name: "Education", emoji: "📚" },
  { name: "Environment", emoji: "🌱" },
];

export default function ExploreByCategory() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                href={`/campaigns?category=${cat.name}`}
                className="flex flex-col items-center gap-2 bg-white rounded-xl py-6 border border-slate-100 hover:shadow-md hover:border-indigo-200 transition"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-sm font-medium text-slate-700">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
