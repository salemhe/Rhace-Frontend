import Footer from "@/components/Footer";
import Header from "@/components/user/Header";
import {  Users, MapPin, Star } from "lucide-react";

export default function AboutRhace() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="max-w-5xl mx-auto mt-20 py-16 px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-title mb-4">About Us</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Welcome to Rhace, Africa’s premier lifestyle booking platform where you can effortlessly <strong>book a hotel stay</strong>, <strong>reserve a restaurant table</strong>, or <strong>secure a club booking</strong>, all from one place.
                    </p>
                </div>

                <section className="mb-12">
                    <h3 className="text-2xl font-semibold text-title mb-4">Our Story</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Rhace was born out of a desire to elevate the African travel and leisure experience. With a strong belief that discovering new places, dining in style, and experiencing nightlife should be as seamless as possible, our founders set out in 2025 to build a platform tailored to the vibrant, diverse rhythms of Africa.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        From Lagos to Nairobi, Johannesburg to Accra, we partner with the best hotels, restaurants and clubs to bring you curated, trusted experiences — whether you’re planning a business retreat, a romantic dinner, or a weekend of nightlife.
                    </p>
                </section>

                <section className="mb-12">
                    <h3 className="text-2xl font-semibold text-title mb-4">Mission, Vision & Values</h3>
                    <div className="space-y-4">
                        <div>
                            <strong className="text-title">Mission:</strong> <span className="text-gray-700">To make premium booking experiences accessible across Africa — enabling users to effortlessly reserve hotels, restaurants and clubs, backed by local insights and global standards.</span>
                        </div>
                        <div>
                            <strong className="text-title">Vision:</strong> <span className="text-gray-700">To be Africa’s leading lifestyle booking destination — trusted by millions of users and thousands of venues for outstanding experiences.</span>
                        </div>
                        <div>
                            <strong className="text-title">Values:</strong>
                            <ul className="list-disc list-inside text-gray-700">
                                <li><strong>Convenience</strong> – We streamline bookings so our users spend less time planning and more time experiencing.</li>
                                <li><strong>Trust</strong> – We partner only with verified venues, provide transparent pricing and protect your data.</li>
                                <li><strong>Local insight</strong> – Born in Africa, we understand the diversity, culture and expectation of our markets.</li>
                                <li><strong>Excellence</strong> – From design to technology to customer service, we aspirationally deliver top-tier experiences.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h3 className="text-2xl font-semibold text-title mb-4">Who We Serve</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex items-start space-4">
                            <Users className="text-primary w-10 h-10 mr-4" />
                            <div>
                                <h4 className="text-title font-semibold mb-2">The Traveller</h4>
                                <p className="text-gray-700 leading-relaxed">
                                    Whether you’re visiting for business, leisure or exploring new cities, Rhace helps you find great hotels, make reservations, and manage your stay seamlessly.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-4">
                            <MapPin className="text-primary w-10 h-10 mr-4" />
                            <div>
                                <h4 className="text-title font-semibold mb-2">The Local Leisure-Seeker</h4>
                                <p className="text-gray-700 leading-relaxed">
                                    Living in your city and looking to discover something new? Reserve a table at a high-end restaurant or join your favourite club — Rhace makes it easy.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h3 className="text-2xl font-semibold text-title mb-4">Why Choose Us</h3>
                    <ul className="space-y-4 text-gray-700">
                        <li><Star className="inline text-primary w-5 h-5 mr-2 align-middle" />Curated venue selection – we partner only with venues that meet strict standards of quality, safety and service.</li>
                        <li><Star className="inline text-primary w-5 h-5 mr-2 align-middle" />One-stop platform – hotels, restaurants and clubs all in one place.</li>
                        <li><Star className="inline text-primary w-5 h-5 mr-2 align-middle" />African focus – we understand local culture and needs, while delivering global standards.</li>
                        <li><Star className="inline text-primary w-5 h-5 mr-2 align-middle" />Secure & transparent – your bookings are confirmed, your payments are safe, and your experience matters.</li>
                    </ul>
                </section>

                <section className="text-center">
                    <h3 className="text-2xl font-semibold text-title mb-4">Our Journey So Far</h3>
                    <p className="text-gray-700 leading-relaxed">
                        Launched in 2025, Rhace is already operating in Nigeria, Kenya and Ghana, working with hundreds of hotels and restaurants and hosting thousands of bookings each month. We’re expanding across Africa and aim to be present in 15+ countries by 2027.
                    </p>
                </section>
            </div>
            <Footer />
        </div>
    );
}
