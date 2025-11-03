
export default function UniversalLoader({ fullscreen = false, size = 48 }) {
  return (
    <div
      className={`${
        fullscreen
          ? "fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50"
          : "flex items-center justify-center"
      }`}
    >
      <div
        className="rounded-full border-4 border-[#0A6C6D]/30 border-t-[#0A6C6D] animate-spin"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      ></div>
    </div>
  );
}
