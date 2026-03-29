import { motion } from "framer-motion";

// ── Abstract SVG illustrations ─────────────────────────────────────────────

function DashboardTypeIllustration() {
  return (
    <svg viewBox="0 0 300 140" fill="none" className="w-full h-full">
      {[
        { x: 8, bars: [0.4, 0.7, 0.5] },
        { x: 108, bars: [0.6, 0.45, 0.8] },
        { x: 208, bars: [0.8, 0.6, 0.9] },
      ].map((card, ci) => (
        <g key={ci}>
          <rect x={card.x} y="8" width="84" height="124" rx="14"
            fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
            style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.2))" }} />
          <rect x={card.x + 8} y="18" width="28" height="28" rx="8" fill="rgba(1,200,150,0.1)" />
          <rect x={card.x + 12} y="22" width="20" height="20" rx="4" fill="rgba(1,200,150,0.25)" />
          <rect x={card.x + 42} y="24" width="34" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
          <rect x={card.x + 42} y="34" width="22" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
          {card.bars.map((h, bi) => (
            <rect key={bi}
              x={card.x + 12 + bi * 22} y={120 - h * 48}
              width="14" height={h * 48} rx="4"
              fill={`rgba(1,180,130,${0.15 + bi * 0.15})`} />
          ))}
          <circle cx={card.x + 72} cy="18" r="5" fill="rgba(1,200,150,0.8)" />
          <circle cx={card.x + 72} cy="18" r="8" fill="rgba(1,200,150,0.15)" />
        </g>
      ))}
    </svg>
  );
}

function PayoutIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" className="w-full h-full">
      <line x1="20" y1="75" x2="180" y2="75" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <circle cx="40" cy="75" r="10" fill="rgba(1,180,130,0.12)" stroke="rgba(1,180,130,0.25)" strokeWidth="1.5" />
      <circle cx="40" cy="75" r="5" fill="rgba(1,180,130,0.5)" />
      <rect x="18" y="92" width="44" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
      <rect x="22" y="102" width="36" height="5" rx="2.5" fill="rgba(255,255,255,0.05)" />
      <line x1="50" y1="75" x2="150" y2="75"
        stroke="rgba(1,180,130,0.3)" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
      <path d="M145 70 L155 75 L145 80" stroke="rgba(1,180,130,0.5)" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="160" cy="75" r="14" fill="rgba(1,180,130,0.15)" stroke="rgba(1,180,130,0.3)" strokeWidth="1.5" />
      <circle cx="160" cy="75" r="7" fill="rgba(1,200,150,0.7)" />
      <circle cx="160" cy="75" r="22" fill="rgba(1,180,130,0.06)" />
      <circle cx="160" cy="75" r="30" fill="rgba(1,180,130,0.03)" />
      <rect x="136" y="96" width="48" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      <rect x="140" y="106" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.06)" />
      <rect x="18" y="52" width="44" height="8" rx="4" fill="rgba(255,255,255,0.06)" />
      <rect x="130" y="48" width="60" height="10" rx="5" fill="rgba(1,180,130,0.15)" />
    </svg>
  );
}

function ReservationsIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" className="w-full h-full">
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="16" y={16 + i * 30} width="168" height="22" rx="8"
            fill={i === 0 ? "rgba(1,180,130,0.1)" : "rgba(255,255,255,0.04)"}
            stroke={i === 0 ? "rgba(1,180,130,0.2)" : "rgba(255,255,255,0.06)"} strokeWidth="1" />
          <circle cx="32" cy={27 + i * 30} r="5"
            fill={`rgba(1,180,130,${0.6 - i * 0.12})`} />
          <rect x="44" y={22 + i * 30} width={80 - i * 10} height="5" rx="2.5"
            fill={`rgba(255,255,255,${0.18 - i * 0.03})`} />
          <rect x="44" y={31 + i * 30} width={52 - i * 6} height="4" rx="2"
            fill={`rgba(255,255,255,${0.08 - i * 0.01})`} />
          <rect x={148} y={22 + i * 30} width="28" height="12" rx="6"
            fill={i === 0 ? "rgba(1,180,130,0.2)" : "rgba(255,255,255,0.05)"} />
        </g>
      ))}
      <circle cx="32" cy="27" r="9" fill="rgba(1,180,130,0.1)" />
      <circle cx="32" cy="27" r="13" fill="rgba(1,180,130,0.05)" />
    </svg>
  );
}

function PricingIllustration() {
  return (
    <svg viewBox="0 0 280 120" fill="none" className="w-full h-full">
      <rect x="16" y="20" width="100" height="80" rx="14"
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))" }} />
      <rect x="28" y="36" width="52" height="10" rx="5" fill="rgba(255,255,255,0.2)" />
      <rect x="28" y="52" width="36" height="7" rx="3.5" fill="rgba(255,255,255,0.08)" />
      <rect x="28" y="68" width="76" height="4" rx="2" fill="rgba(255,255,255,0.07)" />
      <rect x="28" y="68" width="52" height="4" rx="2" fill="rgba(1,180,130,0.4)" />
      <circle cx="80" cy="70" r="7" fill="rgba(255,255,255,0.15)" stroke="rgba(1,180,130,0.4)" strokeWidth="1.5" />
      <circle cx="80" cy="70" r="3" fill="rgba(1,200,150,0.7)" />
      <path d="M124 60 L148 60" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
        strokeDasharray="4 3" strokeLinecap="round" />
      <path d="M144 56 L150 60 L144 64" stroke="rgba(1,180,130,0.5)" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="156" y="28" width="108" height="64" rx="14"
        fill="rgba(1,180,130,0.08)" stroke="rgba(1,180,130,0.2)" strokeWidth="1" />
      <rect x="168" y="42" width="60" height="12" rx="6" fill="rgba(1,180,130,0.35)" />
      <rect x="168" y="60" width="40" height="7" rx="3.5" fill="rgba(255,255,255,0.1)" />
      <circle cx="244" cy="36" r="10" fill="rgba(1,180,130,0.15)" />
      <path d="M244 41 L244 31 M240 35 L244 31 L248 35"
        stroke="rgba(1,200,150,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Bento card ─────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

function BentoCard({
  index, eyebrow, title, description, illustration,
  illustrationHeight = "h-36", className = "",
}: {
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
  illustrationHeight?: string;
  className?: string;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative rounded-[22px] p-6 flex flex-col overflow-hidden group ${className}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: `
          0 0 0 1px rgba(1,180,130,0.06),
          0 4px 12px -2px rgba(0,0,0,0.25),
          0 20px 48px -8px rgba(0,0,0,0.3),
          inset 0 1px 0 rgba(255,255,255,0.07)
        `,
      }}
    >
      {/* Inner glass shimmer */}
      <div
        className="absolute inset-0 rounded-[22px] pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(1,180,130,0.03) 100%)",
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute -inset-4 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(1,180,130,0.12) 0%, transparent 70%)" }}
      />

      {/* Eyebrow */}
      <span
        className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border self-start mb-3 relative z-10"
        style={{
          color: "rgba(1,200,150,0.9)",
          backgroundColor: "rgba(1,180,130,0.1)",
          borderColor: "rgba(1,180,130,0.2)",
        }}
      >
        <span className="w-1 h-1 rounded-full bg-current" />
        {eyebrow}
      </span>

      {/* Text */}
      <h3 className="text-lg font-bold tracking-tight leading-snug mb-1.5 relative z-10"
        style={{ color: "rgba(255,255,255,0.92)" }}>
        {title}
      </h3>
      <p className="text-sm font-light leading-relaxed mb-5 relative z-10"
        style={{ color: "rgba(255,255,255,0.4)" }}>
        {description}
      </p>

      {/* Illustration */}
      <div className={`w-full ${illustrationHeight} mt-auto relative z-10`}>
        {illustration}
      </div>
    </motion.div>
  );
}

// ── Export ─────────────────────────────────────────────────────────────────

export default function ProductPreview() {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #04110f 0%, #071a16 50%, #050f0d 100%)" }}
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "rgba(1,77,67,0.18)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full blur-[100px]"
          style={{ background: "rgba(1,60,50,0.14)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: "rgba(255,255,255,0.93)" }}>
            Your business, on your{" "}
            <span className="relative inline-block" style={{ color: "rgba(1,200,150,0.9)" }}>
              terms
              <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 200 4" fill="none" preserveAspectRatio="none">
                <path d="M0 2 Q50 0 100 2 Q150 4 200 2"
                  stroke="rgba(1,200,150,0.4)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-lg max-w-xl mx-auto font-light"
            style={{ color: "rgba(255,255,255,0.4)" }}>
            Rhace gives every hospitality vendor the tools, visibility, and control to run smarter.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="lg:col-span-2">
            <BentoCard
              index={0}
              eyebrow="Built for you"
              title="A dashboard shaped around your business type"
              description="Whether you run a hotel, restaurant, or club — your Rhace dashboard is tailored to how you actually operate. Rooms, tables, or VIP sections — everything fits."
              illustration={<DashboardTypeIllustration />}
              illustrationHeight="h-36"
              className="h-full"
            />
          </div>

          <BentoCard
            index={1}
            eyebrow="Payouts"
            title="Get paid the next business day"
            description="When a guest pays, the money moves fast. Every completed booking settles to your account at T+1 — no waiting, no chasing."
            illustration={<PayoutIllustration />}
            illustrationHeight="h-36"
          />

          <BentoCard
            index={2}
            eyebrow="Reservations"
            title="See every booking the moment it lands"
            description="Your reservations feed updates in real time. Know who's coming, when, and for what — before they even walk through the door."
            illustration={<ReservationsIllustration />}
            illustrationHeight="h-36"
          />

          <div className="sm:col-span-2 lg:col-span-2">
            <BentoCard
              index={3}
              eyebrow="Pricing"
              title="You set the price. You own the margin."
              description="Adjust your rates anytime from your dashboard. Run a weekend premium, a happy-hour special, or a seasonal rate — your pricing, your call. Rhace never touches your margins."
              illustration={<PricingIllustration />}
              illustrationHeight="h-32"
              className="h-full"
            />
          </div>

        </div>
      </div>
    </section>
  );
}