import FeaturesSection from "@/components/landing/features-section"
import FeedbackSection from "@/components/landing/feedback-section"
import Footer from "@/components/landing/footer"
import Header from "@/components/landing/header"
import HeroSection from "@/components/landing/hero-section"
import StatsSection from "@/components/landing/stats-section"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <FeedbackSection />
      </main>
      <Footer />
    </>
  )
}
