import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Hotel Manager, Grand Plaza',
    content: 'The dashboard makes managing our hotel so simple. From uploading room services to tracking reservations and staff schedules - everything is seamless. Our efficiency increased by 40%.',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Restaurant Owner, Bistro 21',
    content: 'Uploading our menu and drinks was incredibly easy. The table reservation system and payment tracking have transformed how we operate. Best decision we ever made!',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Club Director, Velvet Lounge',
    content: 'Managing events, staff shifts, and payments from one dashboard is a game-changer. Rhace handles everything perfectly. I can\'t imagine going back to our old system.',
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full">
            Testimonials
          </div>
          <h2 className="text-4xl lg:text-5xl text-gray-900">
            Loved by Businesses{' '}
            <span className="text-teal-600">Everywhere</span>
          </h2>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                  >
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
              <div className="border-t pt-4">
                <div className="text-gray-900">{testimonial.name}</div>
                <div className="text-gray-500">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}