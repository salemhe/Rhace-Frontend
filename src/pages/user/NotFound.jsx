import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: "#f8faf9" }}
    >
      {/* Ambient blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] -z-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top left, rgba(1,107,88,0.06) 0%, transparent 65%)" }} />
      <div className="absolute bottom-0 right-0 w-[440px] h-[440px] -z-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom right, rgba(1,120,95,0.05) 0%, transparent 65%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center max-w-xs"
      >

        {/* ── Abstract 404 illustration ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-10"
        >
          <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">

            {/* ── Left "4" shape ── */}
            {/* Vertical left stroke */}
            <motion.line
              x1="22" y1="30" x2="22" y2="90"
              stroke="#016b58" strokeWidth="6" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            {/* Diagonal down-right */}
            <motion.line
              x1="22" y1="90" x2="52" y2="60"
              stroke="#016b58" strokeWidth="6" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
            {/* Horizontal crossbar */}
            <motion.line
              x1="10" y1="72" x2="58" y2="72"
              stroke="#016b58" strokeWidth="6" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.7 }}
            />
            {/* Vertical right stroke */}
            <motion.line
              x1="52" y1="55" x2="52" y2="110"
              stroke="#016b58" strokeWidth="6" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.85 }}
            />

            {/* ── "0" shape — center ── */}
            <motion.ellipse
              cx="100" cy="72" rx="28" ry="38"
              stroke="#016b58" strokeWidth="6" strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            />
            {/* Diagonal slash through 0 */}
            <motion.line
              x1="80" y1="100" x2="120" y2="44"
              stroke="rgba(1,77,67,0.25)" strokeWidth="4" strokeLinecap="round"
              strokeDasharray="5 5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            />

            {/* ── Right "4" shape ── */}
            <motion.line
              x1="148" y1="30" x2="148" y2="90"
              stroke="#016b58" strokeWidth="6" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            <motion.line
              x1="148" y1="90" x2="178" y2="60"
              stroke="#016b58" strokeWidth="6" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
            <motion.line
              x1="136" y1="72" x2="184" y2="72"
              stroke="#016b58" strokeWidth="6" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.7 }}
            />
            <motion.line
              x1="178" y1="55" x2="178" y2="110"
              stroke="#016b58" strokeWidth="6" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.85 }}
            />

            {/* ── Decorative dots ── */}
            {[
              [14, 22], [52, 22], [136, 22], [184, 22],
              [72, 145], [100, 148], [128, 145],
            ].map(([cx, cy], i) => (
              <motion.circle
                key={i} cx={cx} cy={cy} r="3"
                fill="#016b58" opacity="0.18"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.18 }}
                transition={{ duration: 0.3, delay: 1.8 + i * 0.06 }}
              />
            ))}

            {/* ── Ground line ── */}
            <motion.line
              x1="40" y1="118" x2="160" y2="118"
              stroke="rgba(1,107,88,0.12)" strokeWidth="2" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            />

            {/* ── Floating orbit ring ── */}
            <motion.circle
              cx="100" cy="72" r="58"
              stroke="rgba(1,107,88,0.06)" strokeWidth="1.5"
              strokeDasharray="3 6" fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "100px 72px" }}
            />
            {/* Orbiting dot */}
            <motion.circle
              cx="158" cy="72" r="3.5"
              fill="#016b58" opacity="0.2"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "100px 72px" }}
            />

          </svg>

          {/* Soft glow under illustration */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 blur-xl rounded-full pointer-events-none"
            style={{ background: "rgba(1,107,88,0.12)" }}
          />
        </motion.div>

        {/* ── Copy ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.5 }}
          className="text-xs font-bold tracking-[0.25em] uppercase mb-3"
          style={{ color: "rgba(1,107,88,0.45)" }}
        >
          Page not found
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl font-bold text-gray-950 tracking-tight mb-3"
        >
          Looks like you're lost
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-gray-400 font-light leading-relaxed text-sm mb-10"
        >
          This page doesn't exist or may have been moved.
        </motion.p>

        {/* ── Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/"
              className="inline-flex items-center text-sm font-semibold text-white px-5 py-3 rounded-xl"
              style={{ backgroundColor: "#016b58", boxShadow: "0 4px 16px -4px rgba(1,107,88,0.4)" }}
            >
              Back to Home
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center text-sm font-semibold text-gray-600 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200"
          >
            Go Back
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default NotFound;