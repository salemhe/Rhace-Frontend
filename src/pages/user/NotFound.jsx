import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Simple broken link icon */}
        <div className="mb-8 flex justify-center">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-300"
          >
            {/* Broken chain link */}
            <path
              d="M45 35L35 45C28 52 28 63 35 70L40 75"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M75 85L85 75C92 68 92 57 85 50L80 45"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M50 70L70 50"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="4 8"
            />
            {/* X mark indicating broken */}
            <line
              x1="52"
              y1="52"
              x2="68"
              y2="68"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="68"
              y1="52"
              x2="52"
              y2="68"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="text-7xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound