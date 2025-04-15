"use client"

import { motion } from "framer-motion"
import { Check, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Starter",
    description: "Perfect for new affiliate marketers and small businesses",
    price: {
      monthly: 29,
      annually: 290,
    },
    features: [
      "Up to 3 campaigns",
      "Basic analytics",
      "Standard reporting",
      "Email support",
      "100 conversions/month",
    ],
    cta: "Get Started",
    color: "blue",
  },
  {
    name: "Professional",
    description: "For growing businesses with advanced marketing needs",
    price: {
      monthly: 79,
      annually: 790,
    },
    features: [
      "Unlimited campaigns",
      "Advanced analytics",
      "Custom reports",
      "Priority support",
      "Unlimited conversions",
      "Fraud detection",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
    color: "purple",
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex requirements",
    price: {
      monthly: 199,
      annually: 1990,
    },
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integration",
      "24/7 priority support",
      "Advanced fraud prevention",
      "Multi-user access",
      "Single sign-on (SSO)",
      "Custom contracts",
    ],
    cta: "Contact Sales",
    color: "indigo",
  },
]

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-black py-24 sm:py-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="size-[40rem] rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 opacity-10 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute -top-20 right-0 size-[30rem] rounded-full bg-gradient-to-bl from-blue-500 to-indigo-500 opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 size-[30rem] rounded-full bg-gradient-to-tr from-violet-500 to-purple-500 opacity-10 blur-3xl" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            className="mb-6 inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-4 py-1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span className="relative mr-2 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-purple-500"></span>
            </span>
            <p className="bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-sm font-medium text-transparent">
              Flexible Pricing
            </p>
          </motion.div>

          <motion.h2
            className="relative bg-gradient-to-r from-gray-100 via-blue-100 to-gray-100 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </motion.h2>

          <motion.p
            className="mx-auto mt-4 max-w-2xl text-base text-gray-400/80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Choose the perfect plan for your business needs. All plans include a
            14-day free trial.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <div className="relative inline-flex rounded-full bg-gray-800 p-1">
              <span className="relative z-10 inline-flex h-9 items-center rounded-full bg-gray-700 px-4 py-1 text-sm font-medium text-purple-200 shadow-sm">
                Monthly
              </span>
              <span className="relative z-10 inline-flex h-9 items-center rounded-full px-4 py-1 text-sm font-medium text-gray-300">
                Annual
              </span>
              <span className="absolute right-1 top-1 text-xs font-medium text-purple-400">
                Save 20%
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl",
                "border border-white/5 bg-gradient-to-b from-gray-800/40 to-gray-900/40 shadow-sm backdrop-blur-3xl transition-all duration-300",
                "hover:border-white/10 hover:shadow-md",
                plan.popular ? "ring-2 ring-purple-500" : ""
              )}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Ambient glow effect */}
              <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {plan.popular && (
                <div className="absolute right-4 top-4 z-10">
                  <Badge
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-white"
                    variant="default"
                  >
                    Popular
                  </Badge>
                </div>
              )}

              <div className="p-8">
                <h3
                  className={cn(
                    "text-2xl font-bold",
                    plan.color === "blue" && "text-blue-400",
                    plan.color === "purple" && "text-purple-400",
                    plan.color === "indigo" && "text-indigo-400"
                  )}
                >
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-gray-400">{plan.description}</p>
                <div className="mt-6">
                  <p className="flex items-baseline">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      ${plan.price.monthly}
                    </span>
                    <span className="ml-2 text-base text-gray-400">/month</span>
                  </p>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={cn(
                          "size-5 shrink-0",
                          plan.color === "blue" && "text-blue-400",
                          plan.color === "purple" && "text-purple-400",
                          plan.color === "indigo" && "text-indigo-400"
                        )}
                      />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex w-full border-t border-white/5 p-8">
                <Button
                  className={cn(
                    "w-full justify-center",
                    plan.popular
                      ? "relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      : ""
                  )}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.popular && (
                    <Zap className="mr-2 size-4 animate-pulse" />
                  )}
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
