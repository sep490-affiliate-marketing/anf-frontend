"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { ChartTooltip } from "@/components/ui/chart"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const features = [
  "Real-time campaign tracking",
  "Multi-touch attribution",
  "AI-powered insights",
  "Advanced analytics dashboard",
]

const chartData = {
  revenue: [
    { date: "Jan", value: 45000 },
    { date: "Feb", value: 52000 },
    { date: "Mar", value: 49000 },
    { date: "Apr", value: 63000 },
    { date: "May", value: 58000 },
    { date: "Jun", value: 72000 },
    { date: "Jul", value: 85000 },
  ],
  distribution: [
    { name: "Direct", value: 40 },
    { name: "Social", value: 35 },
    { name: "Email", value: 25 },
  ],
}

export default function HeroSection() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  const scale = useTransform(scrollY, [0, 200], [1, 0.95])
  const translateY = useTransform(scrollY, [0, 200], [0, -50])

  return (
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-50 via-white to-white py-20">
      {/* Animated Background Elements */}
      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 size-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-50/50 via-purple-100/30 to-transparent" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[10%] top-1/4 size-64 rounded-full bg-blue-50/50 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute left-[5%] top-1/3 size-96 rounded-full bg-purple-50/50 blur-3xl"
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 [background-size:14px_24px] [background:linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Content */}
          <motion.div
            className="flex flex-col items-start justify-center lg:pr-8"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-white/80 p-1 pr-4 shadow-sm ring-1 ring-gray-900/5 backdrop-blur transition-all hover:bg-white/90 hover:shadow-md sm:gap-3 sm:p-1.5 sm:pr-5"
              variants={fadeInUp}
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white sm:gap-1.5 sm:text-xs">
                <span className="relative flex size-1 sm:size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex size-1 rounded-full bg-white sm:size-1.5"></span>
                </span>
                New
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm">
                Advanced Attribution
                <ArrowRight className="size-3 text-gray-400 transition-transform group-hover:translate-x-0.5 sm:size-3.5" />
              </span>
            </motion.div>

            <motion.h1
              className="mt-6 max-w-xl text-3xl font-bold leading-[1.15] tracking-tight text-gray-900 sm:mt-10 sm:text-5xl lg:text-6xl"
              variants={fadeInUp}
            >
              <span className="inline-block bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                Master Performance
              </span>{" "}
              Marketing & Attribution
            </motion.h1>

            <motion.p
              className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:mt-6 sm:text-xl"
              variants={fadeInUp}
            >
              Track, analyze, and optimize your affiliate marketing campaigns
              with real-time data and advanced analytics. Built for performance
              marketers who demand more.
            </motion.p>

            <motion.div
              className="mt-8 space-y-3 sm:mt-10 sm:space-y-4"
              variants={fadeInUp}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-2 text-gray-600 sm:gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-purple-100 sm:size-5">
                    <CheckCircle2 className="size-3 text-purple-600 sm:size-3.5" />
                  </div>
                  <span className="text-sm sm:text-[15px]">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 flex w-full flex-col gap-3 sm:mt-12 sm:flex-row sm:gap-4"
              variants={fadeInUp}
            >
              <Button
                size="lg"
                className={cn(
                  "group relative w-full overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 px-6 text-white transition-all sm:w-auto sm:px-8",
                  "hover:-translate-y-px hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/20",
                  "active:translate-y-0 active:shadow-sm"
                )}
              >
                <motion.span
                  className="relative z-10 flex items-center justify-center gap-2"
                  whileHover={{ scale: 0.97 }}
                >
                  Get Started Free
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </motion.span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "group w-full border-2 px-6 transition-all sm:w-auto sm:px-8",
                  "hover:border-gray-900/20 hover:bg-gray-50/50 hover:shadow-sm",
                  "active:translate-y-0"
                )}
              >
                <motion.span
                  className="flex items-center justify-center gap-2"
                  whileHover={{ scale: 0.97 }}
                >
                  Live Demo
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Dashboard */}
          <motion.div
            style={{ scale, y: translateY }}
            className="relative hidden lg:mt-0 lg:block"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-12 top-20 size-40 rounded-[2rem] border border-purple-100/30 bg-gradient-to-br from-purple-50/40 to-indigo-50/40 backdrop-blur-sm"
            />
            <motion.div
              animate={{
                y: [0, 8, 0],
                rotate: [0, -2, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -left-12 top-40 size-32 rounded-3xl border border-blue-100/30 bg-gradient-to-br from-blue-50/40 to-purple-50/40 backdrop-blur-sm"
            />

            {/* Main Dashboard Container */}
            <motion.div
              variants={fadeInUp}
              className="relative mx-auto w-full max-w-2xl"
            >
              {/* Glass Card Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-xl" />

              {/* Main Content */}
              <div className="relative space-y-6 rounded-3xl border border-gray-200/50 bg-white/90 p-8 shadow-xl">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-md">
                      <Sparkles className="size-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Analytics Pro
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="inline-flex size-2 animate-pulse rounded-full bg-green-500" />
                        View your campaign performance
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="group flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50/50"
                  >
                    Export Report
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="space-y-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Revenue
                          </p>
                          <p className="mt-2 text-2xl font-semibold text-gray-900">
                            $85,000
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            <span className="text-green-600">↑ 18%</span> vs
                            last month
                          </p>
                        </div>
                      </div>

                      <div className="h-[120px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={chartData.revenue}
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#7c3aed"
                                  stopOpacity={0.1}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#7c3aed"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="#7c3aed"
                              strokeWidth={2}
                              fill="url(#colorRevenue)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Campaign Distribution
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                          2,345
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Active campaigns
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        {chartData.distribution.map((item) => (
                          <div key={item.name} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-gray-500">
                                {item.name}
                              </span>
                              <span className="font-semibold text-gray-700">
                                {item.value}%
                              </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-purple-600/80 transition-all duration-500"
                                style={{ width: `${item.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Overview Chart */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        Revenue Overview
                      </h3>
                      <p className="text-sm text-gray-500">
                        Monthly performance
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {["7D", "30D", "90D"].map((period) => (
                        <button
                          key={period}
                          type="button"
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                            period === "30D"
                              ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                              : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData.revenue}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorRevenueMain"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#7c3aed"
                              stopOpacity={0.1}
                            />
                            <stop
                              offset="95%"
                              stopColor="#7c3aed"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          stroke="#94a3b8"
                          fontSize={12}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          stroke="#94a3b8"
                          fontSize={12}
                          tickFormatter={(value) =>
                            `$${(value / 1000).toFixed(0)}k`
                          }
                        />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const data = payload[0].payload
                            return (
                              <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                                <p className="text-xs font-medium text-gray-500">
                                  {data.date}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                  ${data.value.toLocaleString()}
                                </p>
                              </div>
                            )
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#7c3aed"
                          strokeWidth={2}
                          fill="url(#colorRevenueMain)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
