import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Send, User, Mail, MessageSquare, FileText } from "lucide-react";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Form submitted:", data);
    toast.success("Message sent successfully! We'll get back to you soon.");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-slate-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-slate-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-slate-400" />
            </div>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="john@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-slate-700 mb-2">
          Subject
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <input
            id="subject"
            type="text"
            {...register("subject", { required: "Subject is required" })}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="How can we help you?"
          />
        </div>
        {errors.subject && (
          <p className="mt-2 text-red-600">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-slate-700 mb-2">
          Message
        </label>
        <div className="relative">
          <div className="absolute top-3 left-0 pl-4 pointer-events-none">
            <MessageSquare className="w-5 h-5 text-slate-400" />
          </div>
          <textarea
            id="message"
            rows={6}
            {...register("message", {
              required: "Message is required",
              minLength: {
                value: 10,
                message: "Message must be at least 10 characters",
              },
            })}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-all"
            placeholder="Tell us more about your inquiry..."
          />
        </div>
        {errors.message && (
          <p className="mt-2 text-red-600">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40"
      >
        <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
