import { Grid3x3, List } from 'lucide-react';

const ViewToggle = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center gap-2 px-2 py-2 rounded-md transition-all ${
          view === 'grid'
            ? 'bg-white text-teal-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Grid3x3 size={18} />
        {/* <span className="text-sm font-medium">Grid</span> */}
      </button>
      <button
        onClick={() => onViewChange('table')}
        className={`flex items-center gap-2 px-2 py-2 rounded-md transition-all ${
          view === 'table'
            ? 'bg-white text-teal-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List size={18} />
        {/* <span className="text-sm font-medium">Table</span> */}
      </button>
    </div>
  );
};

export default ViewToggle;
