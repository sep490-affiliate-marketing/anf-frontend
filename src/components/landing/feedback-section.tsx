"use client"

import Image from "next/image"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    content:
      "The platform has transformed how we manage our affiliate program. The real-time analytics and automated payouts have saved us countless hours.",
    author: {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechGrowth",
      image: "https://placekitten.com/100/100",
    },
    rating: 5,
  },
  {
    content:
      "Integration was seamless, and the support team was incredibly helpful. We've seen a 40% increase in our affiliate sign-ups since switching.",
    author: {
      name: "Michael Park",
      role: "Affiliate Manager",
      company: "EcomPro",
      image: "https://placekitten.com/101/101",
    },
    rating: 5,
  },
  {
    content:
      "The fraud prevention features give us peace of mind, and the reporting tools help us make data-driven decisions. Highly recommended!",
    author: {
      name: "Emma Wilson",
      role: "Operations Lead",
      company: "GrowthMasters",
      image: "https://placekitten.com/102/102",
    },
    rating: 5,
  },
  {
    content:
      "The analytics dashboard provides incredible insights that have helped us optimize our campaigns and increase ROI significantly.",
    author: {
      name: "David Kim",
      role: "Growth Manager",
      company: "ScaleUp",
      image: "https://placekitten.com/103/103",
    },
    rating: 5,
  },
  {
    content:
      "Outstanding customer support and regular platform updates keep us ahead of the curve. A game-changer for our affiliate program.",
    author: {
      name: "Rachel Torres",
      role: "Digital Marketing Lead",
      company: "InnovateX",
      image: "https://placekitten.com/104/104",
    },
    rating: 5,
  },
]

export default function FeedbackSection() {
  return (
    <section className="relative overflow-hidden bg-white pb-24 sm:pb-32">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(243 244 246 / 0.1) 1px, transparent 1px),
                         linear-gradient(to bottom, rgb(243 244 246 / 0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span className="relative mr-2 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-indigo-500"></span>
            </span>
            <p className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-sm font-medium text-transparent">
              Customer Success Stories
            </p>
          </motion.div>

          <motion.h2
            className="relative h-[4.5rem] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Trusted by Leading
            <span className="relative ml-2 inline-flex bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Marketers
              <motion.div
                className="absolute -right-4 top-0 -mt-6 size-4 rounded-full bg-indigo-500/30 blur-lg"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1.5, opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  repeatType: "reverse",
                }}
              />
            </span>
          </motion.h2>

          <motion.p
            className="mx-auto mt-4 max-w-2xl text-base text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Join thousands of successful marketers who have transformed their
            business with our powerful platform
          </motion.p>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-7xl gap-6 px-4 sm:mt-20 lg:px-8">
          {/* First Row - 3 Items */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* First Item */}
            <motion.div
              className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex gap-x-1">
                    {[...Array(testimonials[0].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-5 flex-none text-indigo-600"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-6">
                    <p className="relative text-lg font-medium text-gray-900">
                      <span className="absolute -left-2 -top-2 font-serif text-4xl text-indigo-200">
                        &ldquo;
                      </span>
                      <span className="relative">
                        {testimonials[0].content}
                      </span>
                    </p>
                  </blockquote>
                </div>
                <figcaption className="mt-6 flex items-center gap-x-4 border-t border-gray-900/10 pt-6">
                  <div className="relative">
                    <Image
                      src="/users/arc.svg"
                      alt={testimonials[0].author.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-full bg-gray-50 object-cover ring-2 ring-white"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonials[0].author.name}
                    </div>
                    <div className="text-gray-600">{`${testimonials[0].author.role}, ${testimonials[0].author.company}`}</div>
                  </div>
                </figcaption>
              </div>
            </motion.div>

            {/* Second Item */}
            <motion.div
              className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex gap-x-1">
                    {[...Array(testimonials[1].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-5 flex-none text-indigo-600"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-6">
                    <p className="relative text-lg font-medium text-gray-900">
                      <span className="absolute -left-2 -top-2 font-serif text-4xl text-indigo-200">
                        &ldquo;
                      </span>
                      <span className="relative">
                        {testimonials[1].content}
                      </span>
                    </p>
                  </blockquote>
                </div>
                <figcaption className="mt-6 flex items-center gap-x-4 border-t border-gray-900/10 pt-6">
                  <div className="relative">
                    <Image
                      src="/users/arc.svg"
                      alt={testimonials[1].author.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-full bg-gray-50 object-cover ring-2 ring-white"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonials[1].author.name}
                    </div>
                    <div className="text-gray-600">{`${testimonials[1].author.role}, ${testimonials[1].author.company}`}</div>
                  </div>
                </figcaption>
              </div>
            </motion.div>

            {/* Third Item */}
            <motion.div
              className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex gap-x-1">
                    {[...Array(testimonials[2].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-5 flex-none text-indigo-600"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-6">
                    <p className="relative text-lg font-medium text-gray-900">
                      <span className="absolute -left-2 -top-2 font-serif text-4xl text-indigo-200">
                        &ldquo;
                      </span>
                      <span className="relative">
                        {testimonials[2].content}
                      </span>
                    </p>
                  </blockquote>
                </div>
                <figcaption className="mt-6 flex items-center gap-x-4 border-t border-gray-900/10 pt-6">
                  <div className="relative">
                    <Image
                      src="/users/arc.svg"
                      alt={testimonials[2].author.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-full bg-gray-50 object-cover ring-2 ring-white"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonials[2].author.name}
                    </div>
                    <div className="text-gray-600">{`${testimonials[2].author.role}, ${testimonials[2].author.company}`}</div>
                  </div>
                </figcaption>
              </div>
            </motion.div>
          </div>

          {/* Second Row - 2 Items */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* First Item of Second Row */}
            <motion.div
              className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex gap-x-1">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="size-5 flex-none text-indigo-600"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-6">
                    <p className="relative text-lg font-medium text-gray-900">
                      <span className="absolute -left-2 -top-2 font-serif text-4xl text-indigo-200">
                        &ldquo;
                      </span>
                      <span className="relative">
                        The AI-powered fraud detection system has been
                        revolutionary. We&apos;ve seen a 95% reduction in
                        fraudulent transactions and saved over $2M in potential
                        losses. The real-time alerts and detailed analytics have
                        made our operations much more secure.
                      </span>
                    </p>
                  </blockquote>
                </div>
                <figcaption className="mt-6 flex items-center gap-x-4 border-t border-gray-900/10 pt-6">
                  <div className="relative">
                    <Image
                      src="/users/arc.svg"
                      alt="Alex Thompson"
                      width={40}
                      height={40}
                      className="size-10 rounded-full bg-gray-50 object-cover ring-2 ring-white"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Alex Thompson
                    </div>
                    <div className="text-gray-600">
                      Security Director, SecureNet
                    </div>
                  </div>
                </figcaption>
              </div>
            </motion.div>

            {/* Second Item of Second Row */}
            <motion.div
              className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex gap-x-1">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="size-5 flex-none text-indigo-600"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-6">
                    <p className="relative text-lg font-medium text-gray-900">
                      <span className="absolute -left-2 -top-2 font-serif text-4xl text-indigo-200">
                        &ldquo;
                      </span>
                      <span className="relative">
                        The multi-currency support and automated tax handling
                        have transformed our global operations. We&apos;ve
                        expanded to 15 new markets in just 6 months, and our
                        international revenue has grown by 300%. The platform
                        handles everything seamlessly.
                      </span>
                    </p>
                  </blockquote>
                </div>
                <figcaption className="mt-6 flex items-center gap-x-4 border-t border-gray-900/10 pt-6">
                  <div className="relative">
                    <Image
                      src="/users/arc.svg"
                      alt="Maria Garcia"
                      width={40}
                      height={40}
                      className="size-10 rounded-full bg-gray-50 object-cover ring-2 ring-white"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Maria Garcia
                    </div>
                    <div className="text-gray-600">
                      International Growth Lead, GlobalTech
                    </div>
                  </div>
                </figcaption>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
