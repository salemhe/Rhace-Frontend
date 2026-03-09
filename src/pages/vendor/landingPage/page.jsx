import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Testimonials } from "./components/Testimonials";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { FAQ } from "./components/FAQ";
import ProductPreview from "./components/ProductPreview";

export default function VendornHomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <ProductPreview />
      <HowItWorks />
      <FAQ />
      {/* <CTA /> */}
      <Footer />
    </div>
  );
}
