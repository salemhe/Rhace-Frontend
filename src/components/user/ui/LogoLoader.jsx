// export default function UniversalLoader({ fullscreen = false, size = 48 }) {
//   return (
//     <div
//       className={`${
//         fullscreen
//           ? "fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50"
//           : "flex items-center justify-center"
//       }`}
//     >
//       <div
//         className="rounded-full border-4 border-[#0A6C6D]/30 border-t-[#0A6C6D] animate-spin"
//         style={{
//           width: `${size}px`,
//           height: `${size}px`,
//         }}
//       ></div>
//     </div>
//   );
// }

// export function UniversalLoader({
//   fullscreen = false,
//   size = 48,
//   type = "default",
// }) {
//   const sk = "bg-gray-200 skeleton-shine";

//   return (
//     <>
//       {type === "default" && (
//         <div
//           className={`${
//             fullscreen
//               ? "fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50"
//               : "flex items-center justify-center"
//           }`}
//         >
//           <div
//             className="rounded-full border-2 border-[#0A6C6D]/30 border-t-[#0A6C6D] animate-spin"
//             style={{ width: `${size}px`, height: `${size}px` }}
//           />
//         </div>
//       )}

//       {type === "cards" && (
//         <div className="flex flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 overflow-auto hide-scrollbar lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 m-6">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <div key={i} className="rounded-2xl snap-start min-w-[185px] sm:min-w-0 w-[185px] sm:w-auto shadow-md overflow-hidden">
//               <div className={`h-44 w-full ${sk}`} />
//               <div className="p-4 space-y-4">
//                 <div className={`h-5 w-2/3 ${sk} rounded`} />
//                 <div className="flex gap-2">
//                   <div className={`h-5 w-16 ${sk} rounded-full`} />
//                   <div className={`h-5 w-14 ${sk} rounded-full`} />
//                   <div className={`h-5 w-12 ${sk} rounded-full`} />
//                 </div>
//                 <div className={`h-4 w-5/6 ${sk} rounded`} />
//                 <div className={`h-11 w-full ${sk} rounded-full`} />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {type === "room-cards" && (
//         <div className="flex flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 overflow-auto hide-scrollbar lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 m-6">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <div key={i} className="rounded-2xl snap-start min-w-[250px] sm:min-w-0 w-[185px] sm:w-auto shadow-md overflow-hidden">
//               <div className={`h-44 w-full ${sk}`} />
//               <div className="p-4 space-y-4">
//                 <div className={`h-5 w-2/3 ${sk} rounded`} />
//                 <div className="flex gap-2">
//                   <div className={`h-5 w-16 ${sk} rounded-full`} />
//                   <div className={`h-5 w-14 ${sk} rounded-full`} />
//                   <div className={`h-5 w-12 ${sk} rounded-full`} />
//                 </div>
//                 <div className={`h-4 w-5/6 ${sk} rounded`} />
//                 <div className={`h-11 w-full ${sk} rounded-full`} />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {type === "preselect-meal" && (
//         <div className="min-h-screen bg-white">
//           {/* Reservation summary bar */}
//           <div className="w-full border-b border-gray-100">
//             <div className="max-w-4xl mx-auto p-4 space-y-2">
//               <div className={`h-3 w-32 ${sk} rounded`} />
//               <div className="flex gap-3">
//                 <div className={`h-4 w-40 ${sk} rounded`} />
//                 <div className={`h-4 w-28 ${sk} rounded`} />
//                 <div className={`h-4 w-24 ${sk} rounded`} />
//               </div>
//             </div>
//           </div>

//           <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

//             {/* Info banner — plain gray, no yellow */}
//             <div className="rounded-2xl p-4 flex gap-4 border border-gray-100">
//               <div className={`h-10 w-10 ${sk} rounded-full flex-shrink-0`} />
//               <div className="flex-1 space-y-2">
//                 <div className={`h-4 w-48 ${sk} rounded`} />
//                 <div className={`h-3 w-full ${sk} rounded`} />
//                 <div className={`h-3 w-5/6 ${sk} rounded`} />
//               </div>
//             </div>

//             {/* Tabs */}
//             <div className="flex gap-3 overflow-hidden">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <div key={i} className={`h-8 w-24 ${sk} rounded-full flex-shrink-0`} />
//               ))}
//             </div>

//             {/* Menu cards */}
//             <div className="space-y-4">
//               {Array.from({ length: 3 }).map((_, i) => (
//                 <div key={i} className="rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4">
//                   <div className={`h-24 w-32 ${sk} rounded-2xl flex-shrink-0`} />
//                   <div className="flex-1 space-y-3">
//                     <div className={`h-4 w-40 ${sk} rounded`} />
//                     <div className={`h-3 w-5/6 ${sk} rounded`} />
//                     <div className={`h-4 w-24 ${sk} rounded`} />
//                     <div className="flex gap-3 items-center mt-4">
//                       <div className={`h-8 w-24 ${sk} rounded-full`} />
//                       <div className={`h-8 flex-1 ${sk} rounded-xl`} />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Summary sidebar (desktop) — plain gray, no blue tint */}
//             <div className="hidden md:block rounded-2xl border border-gray-100 p-6 space-y-4">
//               <div className={`h-4 w-48 ${sk} rounded`} />
//               <div className="space-y-2">
//                 <div className={`h-3 w-full ${sk} rounded`} />
//                 <div className={`h-3 w-5/6 ${sk} rounded`} />
//               </div>
//               <div className={`h-4 w-32 ${sk} rounded`} />
//             </div>
//           </div>

//           {/* Bottom CTA */}
//           <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4">
//             <div className="max-w-4xl mx-auto">
//               <div className={`h-10 w-full ${sk} rounded-xl`} />
//             </div>
//           </div>
//         </div>
//       )}

//       {type === "vendor-page" && (
//         <div className="min-h-screen bg-white">

//           {/* HEADER (desktop only) */}
//           <div className="hidden md:block h-[85px] border-b px-6">
//             <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
//               <div className={`h-8 w-32 ${sk} rounded-lg`} /> {/* Logo */}
//               <div className="flex gap-4">
//                 <div className={`h-8 w-20 ${sk} rounded-full`} /> {/* Menu */}
//                 <div className={`h-8 w-20 ${sk} rounded-full`} />
//                 <div className={`h-8 w-24 ${sk} rounded-full`} />
//               </div>
//             </div>
//           </div>

//           <main className="max-w-7xl mx-auto md:mt-[85px] pb-20 md:mb-4 md:py-8 md:px-6 lg:px-8">
//             <div className="flex flex-col md:flex-row gap-8 w-full">

//               {/* LEFT COLUMN */}
//               <div className="w-full space-y-4 md:space-y-8">

//                 {/* Hero image */}
//                 <div className={`w-full h-64 md:h-80 ${sk} rounded-none md:rounded-2xl`} />

//                 {/* Thumbnails */}
//                 <div className="hidden md:flex gap-2 px-4 md:px-0">
//                   {Array.from({ length: 4 }).map((_, i) => (
//                     <div key={i} className={`h-20 w-28 ${sk} rounded-xl flex-shrink-0`} />
//                   ))}
//                 </div>

//                 {/* Name + badge + save buttons */}
//                 <div className="px-4 md:px-0 space-y-2">
//                   <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//                     <div className="flex justify-between items-center">
//                       <div className={`h-7 w-48 ${sk} rounded-lg`} /> {/* Name */}
//                       <div className={`h-5 w-14 ${sk} rounded-full ml-3`} /> {/* Badge */}
//                     </div>
//                     <div className="flex gap-2">
//                       <div className={`h-8 w-24 ${sk} rounded-full`} /> {/* Save */}
//                       <div className={`h-8 w-24 ${sk} rounded-full`} />
//                     </div>
//                   </div>
//                   <div className="hidden md:flex gap-2 items-center">
//                     <div className={`h-4 w-24 ${sk} rounded`} />
//                     <div className={`h-4 w-10 ${sk} rounded`} />
//                     <div className={`h-4 w-28 ${sk} rounded`} />
//                   </div>
//                 </div>

//                 {/* Tabs / pills */}
//                 <div className="flex gap-2 px-4 md:px-0 overflow-x-auto hide-scrollbar">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <div key={i} className={`h-8 w-24 ${sk} rounded-full flex-shrink-0`} />
//                   ))}
//                 </div>

//                 {/* Info section */}
//                 <div className="px-4 md:px-0 space-y-3">
//                   <div className={`h-4 w-full ${sk} rounded`} />
//                   <div className={`h-4 w-5/6 ${sk} rounded`} />
//                   <div className={`h-4 w-4/6 ${sk} rounded`} />
//                 </div>

//                 {/* Amenity / tag pills */}
//                 <div className="flex flex-wrap gap-2 px-4 md:px-0">
//                   {Array.from({ length: 6 }).map((_, i) => (
//                     <div key={i} className={`h-7 w-20 ${sk} rounded-full`} />
//                   ))}
//                 </div>

//                 {/* Menu / offerings */}
//                 <div className="px-4 md:px-0 space-y-4">
//                   <div className={`h-5 w-32 ${sk} rounded`} />
//                   {Array.from({ length: 3 }).map((_, i) => (
//                     <div key={i} className="flex gap-4 bg-white rounded-2xl shadow-sm p-4">
//                       <div className={`h-20 w-24 ${sk} rounded-xl flex-shrink-0`} />
//                       <div className="flex-1 space-y-2">
//                         <div className={`h-4 w-36 ${sk} rounded`} />
//                         <div className={`h-3 w-full ${sk} rounded`} />
//                         <div className={`h-3 w-4/6 ${sk} rounded`} />
//                         <div className={`h-4 w-16 ${sk} rounded`} />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* RIGHT COLUMN */}
//               <div className="space-y-8 px-4 md:px-0 md:w-[340px] flex-shrink-0">

//                 {/* Booking / action card */}
//                 <div className="hidden md:block p-4 rounded-2xl bg-[#E7F0F0] border border-[#E5E7EB] space-y-4">
//                   <div className={`h-6 w-40 ${sk} rounded-lg`} />
//                   <div className="space-y-3">
//                     {Array.from({ length: 3 }).map((_, i) => (
//                       <div key={i} className={`h-10 w-full ${sk} rounded-xl`} />
//                     ))}
//                   </div>
//                   <div className={`h-10 w-full ${sk} rounded-full`} />
//                 </div>

//                 {/* Map placeholder */}
//                 <div className={`h-48 w-full ${sk} rounded-2xl`} />

//                 {/* Contact card */}
//                 <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4 space-y-4">
//                   <div className="space-y-2">
//                     <div className={`h-4 w-24 ${sk} rounded`} />
//                     <div className="flex gap-2 items-center">
//                       <div className={`h-5 w-5 ${sk} rounded-full`} />
//                       <div className={`h-4 w-48 ${sk} rounded`} />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <div className={`h-4 w-36 ${sk} rounded`} />
//                     <div className="flex gap-2 items-center">
//                       <div className={`h-5 w-5 ${sk} rounded-full`} />
//                       <div className={`h-4 w-32 ${sk} rounded`} />
//                     </div>
//                     <div className="flex gap-2 items-center">
//                       <div className={`h-5 w-5 ${sk} rounded-full`} />
//                       <div className={`h-4 w-44 ${sk} rounded`} />
//                     </div>
//                   </div>
//                   <div className={`h-4 w-32 ${sk} rounded`} />
//                 </div>
//               </div>
//             </div>
//           </main>

//           {/* Mobile sticky CTA */}
//           <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t p-4">
//             <div className={`h-12 w-full ${sk} rounded-full`} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default UniversalLoader;

// Shimmer keyframes injected once via a style tag inside the component
const shimmerStyle = `
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .skeleton-shine {
    background: linear-gradient(
      90deg,
      #e5e7eb 25%,
      #f3f4f6 50%,
      #e5e7eb 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
  }
`;

// Reusable shimmer block — drop-in replacement for the old static sk divs
function Sk({ className = "" }) {
  return <div className={`skeleton-shine ${className}`} />;
}

export function UniversalLoader({
  fullscreen = false,
  size = 48,
  type = "default",
}) {
  return (
    <>
      <style>{shimmerStyle}</style>

      {/* ─── DEFAULT SPINNER ─────────────────────────────────────── */}
      {type === "default" && (
        <div
          className={`${
            fullscreen
              ? "fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50"
              : "flex items-center justify-center"
          }`}
        >
          <div
            className="rounded-full border-2 border-[#0A6C6D]/30 border-t-[#0A6C6D] animate-spin"
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        </div>
      )}

      {/* ─── CARDS ───────────────────────────────────────────────── */}
      {type === "cards" && (
        <div className="flex flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 overflow-auto hide-scrollbar lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 m-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-sm snap-start min-w-[185px] sm:min-w-0 w-[185px] sm:w-auto"
            >
              <Sk className="h-36 sm:h-44 w-full" />
              <div className="p-2.5 sm:p-3 space-y-2">
                <div className="flex justify-between gap-2">
                  <Sk className="h-3.5 rounded w-2/3" />
                  <Sk className="h-3.5 rounded w-8" />
                </div>
                <Sk className="h-3 rounded w-1/3" />
                <div className="flex gap-1">
                  <Sk className="h-4 rounded w-12" />
                  <Sk className="h-4 rounded w-14" />
                </div>
                <Sk className="h-3 rounded w-3/4" />
                <Sk className="h-7 rounded-lg w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── ROOM CARDS ──────────────────────────────────────────── */}
      {type === "room-cards" && (
        <div className="flex flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 overflow-auto hide-scrollbar lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 m-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl snap-start min-w-[250px] sm:min-w-0 w-[185px] sm:w-auto shadow-md overflow-hidden"
            >
              <Sk className="h-44 w-full" />
              <div className="p-4 space-y-4">
                <Sk className="h-5 w-2/3 rounded" />
                <div className="flex gap-2">
                  <Sk className="h-5 w-16 rounded-full" />
                  <Sk className="h-5 w-14 rounded-full" />
                  <Sk className="h-5 w-12 rounded-full" />
                </div>
                <Sk className="h-4 w-5/6 rounded" />
                <Sk className="h-11 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── PRESELECT MEAL ──────────────────────────────────────── */}
      {type === "preselect-meal" && (
        <div className="min-h-screen bg-white">
          {/* Reservation summary bar */}
          <div className="w-full border-b border-gray-100">
            <div className="max-w-4xl mx-auto p-4 space-y-2">
              <Sk className="h-3 w-32 rounded" />
              <div className="flex gap-3">
                <Sk className="h-4 w-40 rounded" />
                <Sk className="h-4 w-28 rounded" />
                <Sk className="h-4 w-24 rounded" />
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {/* Info banner */}
            <div className="rounded-2xl p-4 flex gap-4 border border-gray-100">
              <Sk className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Sk className="h-4 w-48 rounded" />
                <Sk className="h-3 w-full rounded" />
                <Sk className="h-3 w-5/6 rounded" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <Sk key={i} className="h-8 w-24 rounded-full flex-shrink-0" />
              ))}
            </div>

            {/* Menu cards */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4"
                >
                  <Sk className="h-24 w-32 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Sk className="h-4 w-40 rounded" />
                    <Sk className="h-3 w-5/6 rounded" />
                    <Sk className="h-4 w-24 rounded" />
                    <div className="flex gap-3 items-center mt-4">
                      <Sk className="h-8 w-24 rounded-full" />
                      <Sk className="h-8 flex-1 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary sidebar (desktop) */}
            <div className="hidden md:block rounded-2xl border border-gray-100 p-6 space-y-4">
              <Sk className="h-4 w-48 rounded" />
              <div className="space-y-2">
                <Sk className="h-3 w-full rounded" />
                <Sk className="h-3 w-5/6 rounded" />
              </div>
              <Sk className="h-4 w-32 rounded" />
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4">
            <div className="max-w-4xl mx-auto">
              <Sk className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* ─── VENDOR PAGE ─────────────────────────────────────────── */}
      {type === "vendor-page" && (
        <div className="min-h-screen bg-white">
          {/* Header (desktop) */}
          <div className="hidden md:block h-[85px] border-b px-6">
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
              <Sk className="h-8 w-32 rounded-lg" />
              <div className="flex gap-4">
                <Sk className="h-8 w-20 rounded-full" />
                <Sk className="h-8 w-20 rounded-full" />
                <Sk className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto md:mt-[85px] pb-20 md:mb-4 md:py-8 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Left column */}
              <div className="w-full space-y-4 md:space-y-8">
                <Sk className="w-full h-64 md:h-80 rounded-none md:rounded-2xl" />

                {/* Thumbnails */}
                <div className="hidden md:flex gap-2 px-4 md:px-0">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Sk
                      key={i}
                      className="h-20 w-28 rounded-xl flex-shrink-0"
                    />
                  ))}
                </div>

                {/* Name + badge + save */}
                <div className="px-4 md:px-0 space-y-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex justify-between items-center">
                      <Sk className="h-7 w-48 rounded-lg" />
                      <Sk className="h-5 w-14 rounded-full ml-3" />
                    </div>
                    <div className="flex gap-2">
                      <Sk className="h-8 w-24 rounded-full" />
                      <Sk className="h-8 w-24 rounded-full" />
                    </div>
                  </div>
                  <div className="hidden md:flex gap-2 items-center">
                    <Sk className="h-4 w-24 rounded" />
                    <Sk className="h-4 w-10 rounded" />
                    <Sk className="h-4 w-28 rounded" />
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 px-4 md:px-0 overflow-x-auto hide-scrollbar">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Sk
                      key={i}
                      className="h-8 w-24 rounded-full flex-shrink-0"
                    />
                  ))}
                </div>

                {/* Info */}
                <div className="px-4 md:px-0 space-y-3">
                  <Sk className="h-4 w-full rounded" />
                  <Sk className="h-4 w-5/6 rounded" />
                  <Sk className="h-4 w-4/6 rounded" />
                </div>

                {/* Tag pills */}
                <div className="flex flex-wrap gap-2 px-4 md:px-0">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Sk key={i} className="h-7 w-20 rounded-full" />
                  ))}
                </div>

                {/* Menu / offerings */}
                <div className="px-4 md:px-0 space-y-4">
                  <Sk className="h-5 w-32 rounded" />
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 bg-white rounded-2xl shadow-sm p-4"
                    >
                      <Sk className="h-20 w-24 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Sk className="h-4 w-36 rounded" />
                        <Sk className="h-3 w-full rounded" />
                        <Sk className="h-3 w-4/6 rounded" />
                        <Sk className="h-4 w-16 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-8 px-4 md:px-0 md:w-[340px] flex-shrink-0">
                {/* Booking card */}
                <div className="hidden md:block p-4 rounded-2xl bg-[#E7F0F0] border border-[#E5E7EB] space-y-4">
                  <Sk className="h-6 w-40 rounded-lg" />
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Sk key={i} className="h-10 w-full rounded-xl" />
                    ))}
                  </div>
                  <Sk className="h-10 w-full rounded-full" />
                </div>

                {/* Map placeholder */}
                <Sk className="h-48 w-full rounded-2xl" />

                {/* Contact card */}
                <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4 space-y-4">
                  <div className="space-y-2">
                    <Sk className="h-4 w-24 rounded" />
                    <div className="flex gap-2 items-center">
                      <Sk className="h-5 w-5 rounded-full" />
                      <Sk className="h-4 w-48 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Sk className="h-4 w-36 rounded" />
                    <div className="flex gap-2 items-center">
                      <Sk className="h-5 w-5 rounded-full" />
                      <Sk className="h-4 w-32 rounded" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <Sk className="h-5 w-5 rounded-full" />
                      <Sk className="h-4 w-44 rounded" />
                    </div>
                  </div>
                  <Sk className="h-4 w-32 rounded" />
                </div>
              </div>
            </div>
          </main>

          {/* Mobile sticky CTA */}
          <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t p-4">
            <Sk className="h-12 w-full rounded-full" />
          </div>
        </div>
      )}

      {type === "dashboard-2" && (
        <div className="w-full min-h-screen p-4 md:p-6 space-y-6">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Sk className="h-6 w-40 rounded" />

            <div className="flex gap-2">
              <Sk className="h-10 w-24 rounded-lg" />
              <Sk className="h-10 w-24 rounded-lg" />
              <Sk className="h-10 w-40 rounded-lg" />
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <Sk className="h-4 w-24 rounded" />
                  <Sk className="h-8 w-8 rounded-lg" />
                </div>
                <Sk className="h-6 w-10 rounded" />
                <Sk className="h-3 w-28 rounded" />
              </div>
            ))}
          </div>

          {/* FILTER + TABS */}
          <div className="rounded-2xl shadow-sm p-4 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 overflow-auto hide-scrollbar">
              {Array.from({ length: 5 }).map((_, i) => (
                <Sk key={i} className="h-8 w-20 rounded-lg flex-shrink-0" />
              ))}
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <Sk className="h-10 w-full md:flex-1 rounded-lg" />

              <div className="flex gap-2">
                <Sk className="h-10 w-24 rounded-lg" />
                <Sk className="h-10 w-32 rounded-lg" />
                <Sk className="h-10 w-36 rounded-lg" />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="rounded-2xl shadow-sm overflow-hidden">
            {/* TABLE HEADER */}
            <div className="hidden md:grid grid-cols-7 gap-4 p-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Sk key={i} className="h-4 w-20 rounded" />
              ))}
            </div>

            {/* TABLE BODY */}
            <div className="space-y-2 p-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 md:grid-cols-7 gap-4 items-center p-3 rounded-xl"
                >
                  {/* Customer */}
                  <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                    <Sk className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Sk className="h-3 w-20 rounded" />
                      <Sk className="h-2 w-14 rounded" />
                    </div>
                  </div>

                  <Sk className="h-3 w-24 rounded hidden md:block" />
                  <Sk className="h-3 w-8 rounded hidden md:block" />
                  <Sk className="h-6 w-14 rounded-full hidden md:block" />
                  <Sk className="h-6 w-14 rounded-full hidden md:block" />
                  <Sk className="h-6 w-20 rounded-full hidden md:block" />
                  <Sk className="h-4 w-4 rounded ml-auto hidden md:block" />
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between p-4">
              <Sk className="h-3 w-24 rounded" />

              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Sk key={i} className="h-8 w-8 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {type === "dashboard-1" && (
        <div className="p-4 md:p-6 space-y-6">
          {/* HEADER */}
          <div className="space-y-2">
            <Sk className="h-8 w-64 rounded" />
            <Sk className="h-4 w-80 rounded" />
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl shadow-sm space-y-3">
                <div className="flex justify-between">
                  <Sk className="h-4 w-28 rounded" />
                  <Sk className="h-10 w-10 rounded-xl" />
                </div>
                <Sk className="h-6 w-10 rounded" />
                <Sk className="h-3 w-24 rounded" />
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT CARD */}
            <div className="rounded-2xl shadow-sm p-4 space-y-6">
              <div className="flex justify-between items-center">
                <Sk className="h-5 w-40 rounded" />
                <Sk className="h-4 w-20 rounded" />
              </div>

              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Sk className="h-10 w-10 rounded" />
                <Sk className="h-4 w-48 rounded" />
              </div>
            </div>

            {/* RIGHT CARD (CHART) */}
            <div className="rounded-2xl shadow-sm p-4 space-y-6">
              <div className="flex justify-between items-center">
                <Sk className="h-5 w-40 rounded" />
                <div className="flex gap-2">
                  <Sk className="h-4 w-20 rounded" />
                  <Sk className="h-8 w-24 rounded-lg" />
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <Sk className="h-4 w-20 rounded" />
                <Sk className="h-4 w-20 rounded" />
              </div>

              <Sk className="h-8 w-12 rounded" />
              <Sk className="h-4 w-32 rounded" />

              {/* Fake chart bars */}
              <div className="flex items-end gap-4 h-40 mt-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Sk
                    key={i}
                    className={`w-10 rounded-t-xl ${
                      i % 2 === 0 ? "h-24" : "h-32"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {type === "dashboard-3" && (
        <div className="p-4 md:p-6 space-y-6">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Sk className="h-6 w-48 rounded" />

            <div className="flex gap-2">
              <Sk className="h-10 w-24 rounded-lg" />
              <Sk className="h-10 w-36 rounded-lg" />
              <Sk className="h-10 w-28 rounded-lg" />
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <Sk className="h-9 w-24 rounded-lg" />
              <Sk className="h-9 w-32 rounded-lg" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Sk className="h-10 w-64 rounded-lg" />
              <Sk className="h-10 w-36 rounded-lg" />
              <Sk className="h-10 w-40 rounded-lg" />
              <Sk className="h-10 w-20 rounded-lg" />
            </div>
          </div>

          {/* CARDS */}
          <div className="flex flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 overflow-auto hide-scrollbar lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 m-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl snap-start min-w-[250px] sm:min-w-0 w-[185px] sm:w-auto shadow-md overflow-hidden"
              >
                <Sk className="h-44 w-full" />

                <div className="p-4 space-y-4">
                  <Sk className="h-5 w-2/3 rounded" />

                  <div className="flex gap-2">
                    <Sk className="h-5 w-16 rounded-full" />
                    <Sk className="h-5 w-14 rounded-full" />
                    <Sk className="h-5 w-12 rounded-full" />
                  </div>

                  <Sk className="h-4 w-5/6 rounded" />
                  <Sk className="h-6 w-20 rounded" />

                  <div className="flex justify-between items-center">
                    <Sk className="h-4 w-24 rounded" />
                    <Sk className="h-4 w-20 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default UniversalLoader;
