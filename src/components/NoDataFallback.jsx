import React from 'react';
import { PackageOpen } from 'lucide-react';

const NoDataFallback = ({
  title = "No Data Available",
  message = "There’s nothing to show here yet.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center text-gray-600 animate-fadeUp">
      <PackageOpen size={80} className="text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">{message}</p>

      {actionLabel && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default NoDataFallback;
