import Footer from "@/components/Footer";
import Header from "@/components/user/Header";
import { useEffect, useRef } from "react";

function useReveal() {
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("opacity-100", "translate-y-0");
          e.target.classList.remove("opacity-0", "translate-y-7");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (i) => (el) => (refs.current[i] = el);
}

export default function AboutRhace() {
  const reveal = useReveal();

  return (
    <div className="overflow-x-hidden bg-white">
      <Header />

      {/* HERO */}
      <div className="max-w-[1100px] mx-auto px-8 pt-32 pb-24">
        <p className="text-[11px] font-semibold tracking-[.14em] uppercase text-[#0A6C6D] mb-10">
          About Rhace
        </p>
        <h1 className="text-[clamp(44px,7vw,88px)] font-semibold leading-[1.03] tracking-[-0.03em] text-[#0D1117] max-w-[820px]">
          Nigeria deserves better{" "}
          <span className="text-[#0A6C6D]">hospitality</span>{" "}
          infrastructure.
        </h1>
        <p className="mt-8 text-[18px] text-[#6B7280] leading-[1.7] max-w-[520px]">
          We built Rhace to make booking a hotel room, reserving a table, or
          planning a night out as natural as sending a message. One platform.
          Every occasion.
        </p>
      </div>

      {/* STATS BAND */}
      <div className="bg-[#F7F7F5] py-14 px-8">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3">
          {[
            { num: "3", label: "booking categories on one platform" },
            { num: "2", label: "sides of the market we serve" },
            { num: "1", label: "login for guests and vendors alike" },
          ].map((s, i) => (
            <div
              key={i}
              className={`px-10 py-6 ${i > 0 ? "border-t md:border-t-0 md:border-l border-[#E5E5E0]" : ""}`}
            >
              <p className="text-[42px] font-semibold tracking-tight text-[#0D1117]">
                {s.num}
              </p>
              <p className="text-[13px] text-[#9CA3AF] mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STORY */}
      <div
        ref={reveal(0)}
        className="max-w-[1100px] mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-20
                   opacity-0 translate-y-7 transition-all duration-700"
      >
        <div>
          <p className="text-[11px] font-semibold tracking-[.14em] uppercase text-[#9CA3AF] mb-6">
            Our story
          </p>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold leading-[1.15] tracking-tight text-[#0D1117]">
            Built from a real frustration
          </h2>
          <p className="mt-5 text-[16px] text-[#6B7280] leading-[1.8]">
            Getting a hotel room in Lagos required phone calls. Reserving a
            table meant showing up and hoping. Finding out a venue was fully
            booked happened at the door.
          </p>
          <p className="mt-4 text-[16px] text-[#6B7280] leading-[1.8]">
            We built Rhace because Nigerian hospitality is world-class, but the
            infrastructure behind it was not keeping pace. We set out to change
            that, starting with hotels, restaurants, and clubs.
          </p>
        </div>
        <div className="pt-3">
          <blockquote className="border-l-[3px] border-[#0A6C6D] pl-6 text-[22px] font-medium leading-[1.45] tracking-tight text-[#0D1117]">
            "The food is incredible. The hotels are beautiful. The nightlife is
            electric. It just needed to be easier to access."
          </blockquote>
          <p className="mt-4 pl-6 text-[13px] text-[#9CA3AF]">
            The thinking behind Rhace
          </p>
        </div>
      </div>

      {/* WHAT WE DO */}
      <div className="bg-[#0D1117] py-24 px-8">
        <div
          ref={reveal(1)}
          className="max-w-[1100px] mx-auto opacity-0 translate-y-7 transition-all duration-700"
        >
          <p className="text-[11px] font-semibold tracking-[.14em] uppercase text-[#0A6C6D] mb-6">
            What we do
          </p>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-tight text-white mb-14">
            Three problems, one product
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1F2937]">
            {[
              {
                n: "01",
                title: "Hotel bookings",
                body: "Search rooms, compare prices, and confirm your stay in under two minutes. Real-time availability across hotels nationwide.",
                tag: "Nationwide",
              },
              {
                n: "02",
                title: "Restaurant reservations",
                body: "From casual dinners to fine dining, reserve your table at the best restaurants in Lagos, Abuja, and beyond. No hold music, no callbacks.",
                tag: "Instant confirm",
              },
              {
                n: "03",
                title: "Club reservations",
                body: "Pick your table, select your bottles, and arrive knowing everything is set. No surprises at the door, no wasted nights.",
                tag: "VIP ready",
              },
            ].map((c) => (
              <div key={c.n} className="px-8 py-10">
                <p className="text-[11px] font-semibold tracking-[.1em] text-[#374151] mb-8">
                  {c.n}
                </p>
                <h3 className="text-[22px] font-semibold text-white tracking-tight mb-4">
                  {c.title}
                </h3>
                <p className="text-[14px] text-[#6B7280] leading-[1.8]">
                  {c.body}
                </p>
                <span className="inline-block mt-7 text-[11px] font-semibold tracking-[.1em] uppercase text-[#0A6C6D] border border-[#0A6C6D] rounded-sm px-3 py-1">
                  {c.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VALUES */}
      <div
        ref={reveal(2)}
        className="max-w-[1100px] mx-auto px-8 py-24
                   opacity-0 translate-y-7 transition-all duration-700"
      >
        <div className="max-w-[680px] mb-16">
          <p className="text-[11px] font-semibold tracking-[.14em] uppercase text-[#9CA3AF] mb-6">
            How we think
          </p>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold leading-[1.15] tracking-tight text-[#0D1117]">
            The principles we build by
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
          {[
            ["Speed first", "Every second between intent and confirmation is friction. We obsess over removing it."],
            ["Vendor respect", "The businesses on Rhace are our partners, not just our inventory. Their growth is our growth."],
            ["Local by design", "Naira pricing, Nigerian time zones, local payment methods. We are not a global product patched for Nigeria."],
            ["Simple always wins", "If a feature makes the product harder to use, it does not ship. Complexity is a choice we refuse to make."],
            ["Honest transparency", "No hidden fees. No surprises at checkout. The price you see is the price you pay."],
            ["Relentless iteration", "Rhace today is not Rhace forever. We keep listening, keep shipping, keep improving."],
          ].map(([name, body]) => (
            <div
              key={name}
              className="py-9 border-b border-[#F0F0EC] grid grid-cols-[180px_1fr] gap-10 items-start"
            >
              <span className="text-[14px] font-semibold text-[#0D1117]">
                {name}
              </span>
              <p className="text-[15px] text-[#6B7280] leading-[1.75]">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VENDOR */}
      <div className="bg-[#0A6C6D]">
        <div
          ref={reveal(3)}
          className="max-w-[1100px] mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center
                     opacity-0 translate-y-7 transition-all duration-700"
        >
          <div>
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-tight text-white leading-[1.2]">
              Built for the businesses too
            </h2>
            <p className="mt-5 text-[16px] text-white/65 leading-[1.8]">
              Every hotel, restaurant, and club on Rhace gets a full vendor
              dashboard to manage listings, track reservations, and understand
              their guests.
            </p>
          </div>
          <div>
            {[
              "Reservation management",
              "Real-time availability control",
              "Guest history and profiles",
              "Revenue and booking analytics",
              "Custom listings and pricing",
            ].map((f, i) => (
              <div
                key={f}
                className={`flex items-center justify-between py-5 border-b border-white/10 ${
                  i === 0 ? "border-t border-white/10" : ""
                }`}
              >
                <span className="text-[15px] font-medium text-white">{f}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/35" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CITIES */}
      <div
        ref={reveal(4)}
        className="max-w-[1100px] mx-auto px-8 py-24
                   opacity-0 translate-y-7 transition-all duration-700"
      >
        <p className="text-[11px] font-semibold tracking-[.14em] uppercase text-[#9CA3AF] mb-6">
          Where we are
        </p>
        <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-tight text-[#0D1117] mb-14 max-w-[480px]">
          Starting in Nigeria's biggest cities
        </h2>
        <div className="max-w-[560px]">
          {[
            { city: "Lagos", live: true },
            { city: "Abuja", live: false },
            { city: "Port Harcourt", live: false },
            { city: "Ibadan", live: false },
            { city: "Enugu", live: false },
          ].map((c) => (
            <div
              key={c.city}
              className="flex items-center justify-between py-5 border-b border-[#F0F0EC] first:border-t first:border-[#F0F0EC]"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-2 h-2 rounded-full ${c.live ? "bg-[#0A6C6D]" : "bg-[#E5E7EB]"}`}
                />
                <span
                  className={`text-[18px] font-medium ${c.live ? "text-[#0D1117]" : "text-[#C9C9C4]"}`}
                >
                  {c.city}
                </span>
              </div>
              <span
                className={`text-[12px] font-semibold tracking-[.08em] uppercase ${
                  c.live ? "text-[#0A6C6D]" : "text-[#D1D5DB]"
                }`}
              >
                {c.live ? "Live" : "Coming soon"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}