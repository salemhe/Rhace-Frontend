import { Upload, Calendar, CreditCard, BarChart3, Users, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Utensils,
    title: 'Menu & Drinks Management',
    description: 'Upload and organize your complete menu, beverages, and specials with photos, prices, and availability tracking.',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    icon: Calendar,
    title: 'Table Reservations',
    description: 'Manage table bookings with an intuitive dashboard. See availability in real-time and handle reservations effortlessly.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: CreditCard,
    title: 'Payment Processing',
    description: 'Track all transactions in one place. Accept payments, generate invoices, and manage billing with ease.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Users,
    title: 'Staff Management',
    description: 'Organize your team with shift scheduling, role assignments, and performance tracking all from your dashboard.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Get insights into sales, popular items, peak hours, and staff performance with comprehensive analytics.',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: Upload,
    title: 'Easy Uploads',
    description: 'Bulk upload menu items, drinks, and table configurations. Update prices and availability instantly.',
    color: 'bg-yellow-100 text-yellow-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full">
            Dashboard Features
          </div>
          <h2 className="text-4xl lg:text-5xl text-gray-900">
            Everything in Your{' '}
            <span className="text-teal-600">Dashboard</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage every aspect of your business from one powerful, intuitive dashboard.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white p-8 rounded-2xl hover:shadow-xl transition-shadow border border-gray-100"
            >
              <motion.div 
                className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-5`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-6 h-6" />
              </motion.div>
              <h3 className="text-xl text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}