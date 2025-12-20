import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Sign Up & Setup",
    description:
      "Create your account and set up your dashboard in minutes. Choose your business type and customize your workspace.",
  },
  {
    number: "02",
    title: "Upload Your Data",
    description:
      "Add menu items, drinks, table layouts, and staff information. Bulk upload or add items individually.",
  },
  {
    number: "03",
    title: "Manage Everything",
    description:
      "Start accepting reservations, processing payments, and managing your entire operation from one dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1728044849280-10a1a75cff83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3NjYxNDg3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Restaurant management"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          <div className="order-1 lg:order-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full">
                How It Works
              </div>
              <h2 className="text-4xl lg:text-5xl text-gray-900">
                Get Started in{" "}
                <span className="text-teal-600">3 Simple Steps</span>
              </h2>
            </motion.div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ x: 10 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.number}
                    </motion.div>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-2xl text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
