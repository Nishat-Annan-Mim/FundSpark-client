"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Campaigns Launched", value: "120+" },
  { label: "Total Credits Raised", value: "45,000+" },
  { label: "Active Supporters", value: "2,300+" },
  { label: "Successful Withdrawals", value: "310+" },
];

export default function PlatformImpact() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
        Platform Impact in Numbers
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <p className="text-3xl md:text-4xl font-bold text-indigo-600">
              {stat.value}
            </p>
            <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}