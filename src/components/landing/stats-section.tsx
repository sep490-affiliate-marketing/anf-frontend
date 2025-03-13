"use client"

import { useRef } from "react"

import { motion, MotionValue, useScroll, useTransform } from "framer-motion"

const stats = [
  {
    id: 1,
    value: "1000+",
    label: "Active Clients",
    description: "Trusted by businesses worldwide",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    icon: (
      <svg
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    value: "150+",
    label: "Countries",
    description: "Global reach and impact",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    icon: (
      <svg
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    value: "99.9%",
    label: "Uptime",
    description: "Reliable performance",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    icon: (
      <svg
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    id: 4,
    value: "24/7",
    label: "Support",
    description: "Always here to help",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    icon: (
      <svg
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
]

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

export default function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useParallax(scrollYProgress, 30)

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-black py-24 sm:py-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="size-[40rem] rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 opacity-10 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute -top-20 right-0 size-[30rem] rounded-full bg-gradient-to-bl from-purple-500 to-pink-500 opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 size-[30rem] rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 opacity-10 blur-3xl" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div style={{ y }} className="mx-auto max-w-2xl lg:max-w-none">
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-6 inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-4 py-1.5"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="relative mr-2 flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <p className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-sm font-medium text-transparent">
                Our Impact in Numbers
              </p>
            </motion.div>

            <motion.h2
              className="relative bg-gradient-to-r from-gray-100 via-blue-100 to-gray-100 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Trusted by Marketers
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                {" "}
                Worldwide
              </span>
            </motion.h2>

            <motion.p
              className="mx-auto mt-4 max-w-2xl text-base text-gray-400/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Join thousands of successful marketers who have already
              transformed their business with our powerful platform
            </motion.p>

            {/* Decorative lines */}
            <div className="absolute -bottom-8 left-1/2 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent" />
          </motion.div>

          <motion.dl
            className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                {/* Stripe-inspired card design */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800/40 to-gray-900/40 p-6 backdrop-blur-3xl transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:border before:border-white/5 before:transition-all before:duration-300 after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] group-hover:before:border-white/10 group-hover:after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  {/* Ambient glow effect */}
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.02] via-transparent to-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Glowing border corners */}
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 blur-[2px] transition-all duration-300 group-hover:opacity-100" />

                  {/* Content wrapper */}
                  <div className="relative space-y-4">
                    {/* Icon and label row */}
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex size-10 items-center justify-center rounded-lg ${stat.bgColor} ring-1 ring-white/10 transition-all duration-300 group-hover:ring-white/20`}
                      >
                        <div
                          className={`${stat.color} transition-transform duration-300 group-hover:scale-110`}
                        >
                          {stat.icon}
                        </div>
                      </div>
                      <motion.dt
                        className="text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-gray-200"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + 0.1 * index }}
                      >
                        {stat.label}
                      </motion.dt>
                    </div>

                    {/* Value with enhanced styling */}
                    <motion.dd
                      className="space-y-1.5"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + index * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      <div
                        className={`text-3xl font-bold tracking-tight ${stat.color} transition-all duration-300 group-hover:translate-x-0.5`}
                      >
                        {stat.value}
                      </div>
                      <p className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                        {stat.description}
                      </p>
                    </motion.dd>
                  </div>

                  {/* Bottom highlight effect */}
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </motion.div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  )
}
