"use client";

import { motion } from "framer-motion";
import { Rocket, HandCoins, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Rocket,
    title: "Launch a Campaign",
    desc: "Creators share their idea, set a funding goal, and go live after quick approval.",
  },
  {
    icon: HandCoins,
    title: "Get Contributions",
    desc: "Supporters discover campaigns and contribute credits toward the ones they believe in.",
  },
  {
    icon: TrendingUp,
    title: "Track & Withdraw",
    desc: "Creators track progress in real time and withdraw raised funds once approved.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            className="text-center px-4"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 flex items-center justify-center mb-4">
              <step.icon className="text-indigo-600" size={28} />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">{step.title}</h3>
            <p className="text-slate-500 text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
