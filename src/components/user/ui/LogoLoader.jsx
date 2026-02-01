
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

export default function UniversalLoader({ fullscreen = false, size = 48, type = "default" }) {
  return (
    <>
      {type === "default" && (
        <div
          className={`${fullscreen
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
            <div key={index} className="rounded-2xl snap-start min-w-[185px] sm:min-w-0 w-[185px] sm:w-auto bg-white shadow-md overflow-hidden">
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
          ))};
        </div>
      )}
    </>
  );
}
