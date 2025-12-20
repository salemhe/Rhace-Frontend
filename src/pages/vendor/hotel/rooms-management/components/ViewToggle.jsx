import { ListCheck3 } from "@/components/dashboard/ui/svg";
import { Grid3x3, LayoutGrid, List } from "lucide-react";

const ViewToggle = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => onViewChange("grid")}
        className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all ${
          view === "grid"
            ? "bg-white group-data-[state=active]:text-[#111827] text-[#606368] shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <LayoutGrid className=" size-4" />
        {/* <span className="text-sm font-medium">Grid</span> */}
      </button>
      <button
        onClick={() => onViewChange("table")}
        className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all ${
          view === "table"
            ? "bg-white group-data-[state=active]:text-[#111827] text-[#606368] shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <ListCheck3 className=" size-4" />
        {/* <span className="text-sm font-medium">Table</span> */}
      </button>
    </div>
  );
};

export default ViewToggle;
