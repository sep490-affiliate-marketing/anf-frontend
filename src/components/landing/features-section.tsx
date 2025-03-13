"use client"

import { motion } from "framer-motion"
import {
  BarChart3,
  Globe2,
  LineChart,
  Lock,
  Settings2,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"

const features = [
  {
    icon: Globe2,
    title: "Global Reach",
    description:
      "Connect with affiliates and advertisers worldwide through our extensive network and localized support.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: LineChart,
    title: "Real-time Analytics",
    description:
      "Make data-driven decisions with comprehensive real-time reporting and analytics.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Lock,
    title: "Fraud Prevention",
    description:
      "Advanced fraud detection and prevention systems to protect your campaigns and revenue.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description:
      "Track all your marketing campaigns in one place with detailed attribution and conversion data.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Settings2,
    title: "Automation Tools",
    description:
      "Streamline your workflow with powerful automation tools for payments, reporting, and more.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Fast Integration",
    description:
      "Quick and easy integration with your existing systems and third-party tools.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    gradient: "from-yellow-500 to-orange-500",
  },
]

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32"
    >
      <div className="bg-grid-slate-900/[0.04] absolute inset-0 bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span className="relative mr-2 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-purple-500"></span>
            </span>
            <p className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-sm font-medium text-transparent">
              Powerful Features
            </p>
          </motion.div>

          <motion.h2
            className="relative h-[4.5rem] bg-gradient-to-r from-purple-500 via-purple-700 to-indigo-800 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Scale Your Affiliate Program
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              {" "}
              Effortlessly
            </span>
          </motion.h2>

          <motion.p
            className="mx-auto mt-4 max-w-2xl text-base text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Powerful tools and features designed to help you manage and grow
            your affiliate marketing program effectively
          </motion.p>
        </div>

        <motion.div
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-white/10 p-8",
                "border border-gray-100 shadow-sm backdrop-blur-sm",
                "transition-all duration-300 ease-out",
                "hover:border-transparent hover:shadow-md"
              )}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={cn(
                  "absolute inset-0 -z-10",
                  feature.gradient,
                  "opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-5"
                )}
              />

              <div
                className={cn(
                  "mb-6 inline-flex rounded-xl p-3",
                  feature.bgColor,
                  "transition-all duration-300 ease-out",
                  "group-hover:scale-110"
                )}
              >
                <feature.icon className={cn("size-6", feature.color)} />
              </div>

              <h3
                className={cn(
                  "text-xl font-semibold",
                  feature.color,
                  "transition-colors duration-300 ease-out"
                )}
              >
                {feature.title}
              </h3>
              <p className="mt-4 text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
