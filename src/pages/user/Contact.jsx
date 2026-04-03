import Footer from "@/components/Footer";
import Header from "@/components/user/Header";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import calling from "@/public/images/calling.png";

export default function ContactRhace() {
  return (
    <div className="min-h-screen h-lvh bg-white">
      <Header />
      <main className="w-full mt-24 h-full text-black max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex-1"></div>
        <div className="bg-[#0A6C6D] text-white h-full rounded-lg p-8 flex flex-col gap-6 relative">
          <img src={calling} alt="a person calling" className="w-full h-full absolute left-0 -top-3 object-cover" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
