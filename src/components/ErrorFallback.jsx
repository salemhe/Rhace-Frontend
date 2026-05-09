function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 mx-auto my-8 max-w-lg border-2 border-dashed border-red-200 rounded-xl bg-red-50 text-center">
      {/* Icon */}
      <div className="mb-4 p-3 bg-red-100 rounded-full text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      
      <p className="text-sm text-gray-600 mb-4">
        An unexpected error occurred. Please try again.
      </p>

      {/* Error Details - Good for Dev, maybe hide in Prod */}
      <div className="w-full bg-white p-3 rounded border border-red-100 mb-6 text-left">
        <code className="text-xs text-red-500 break-all font-mono">
          {error.message}
        </code>
      </div>

      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md active:scale-95"
      >
        Try again
      </button>
    </div>
  );
}

export default ErrorFallback;