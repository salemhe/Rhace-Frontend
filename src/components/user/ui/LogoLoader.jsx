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

export default function UniversalLoader({
  fullscreen = false,
  size = 48,
  type = "default",
}) {
  return (
    <>
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
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          ></div>
        </div>
      )}
      {type === "cards" && (
        <div className="flex flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 overflow-auto hide-scrollbar lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 m-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl snap-start min-w-[185px] sm:min-w-0 w-[185px] sm:w-auto  shadow-md overflow-hidden"
            >
              <div className="h-44 w-full bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-4">
                <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-14 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-11 w-full bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
          ;
        </div>
      )}
      {type === "room-cards" && (
        <div className="flex flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 overflow-auto hide-scrollbar lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 m-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl snap-start min-w-[250px] sm:min-w-0 w-[185px] sm:w-auto  shadow-md overflow-hidden"
            >
              <div className="h-44 w-full bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-4">
                <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-14 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-11 w-full bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
          ;
        </div>
      )}
      {type === "preselect-meal" && (
  <div className="min-h-screen bg-white">
    {/* Sticky Reservation Summary Skeleton */}
    <div className="bg-[#E7F0F0] w-full">
      <div className="max-w-4xl mx-auto p-4 space-y-2">
        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex gap-3">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Info Banner Skeleton */}
      <div className="bg-[#FFFBEB] rounded-2xl p-4 flex gap-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* Menu Card Skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-4 flex gap-4 animate-pulse"
          >
            {/* Image */}
            <div className="h-24 w-32 bg-gray-200 rounded-2xl flex-shrink-0"></div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>

              {/* Quantity + Input */}
              <div className="flex gap-3 items-center mt-4">
                <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                <div className="h-8 flex-1 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Summary Skeleton (Desktop) */}
      <div className="hidden md:block bg-[#E9EBF3] rounded-2xl p-6 space-y-4">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>

    {/* Bottom Fixed Button Skeleton */}
    <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4">
      <div className="max-w-4xl mx-auto">
        <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </div>
)}

    </>
  );
}
