import DashboardLayout from "@/components/layout/DashboardLayout";
import RoomsManagementComponent from "./components/RoomsManagement";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DashboardButton from '@/components/dashboard/ui/DashboardButton'
import { useState } from "react";

const RoomsManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 12 items per page (3x4 grid)
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    
    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > maxVisible) {
        pages.push('ellipsis-start');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - maxVisible + 1) {
        pages.push('ellipsis-end');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <DashboardLayout type="hotel">
      <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8">
        <RoomsManagementComponent 
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onTotalItemsChange={setTotalItems}
        />
      </div>
      {totalItems > 0 && (
        <div className='absolute hidden md:flex bottom-0 border-t border-[#E5E7EB] left-0 right-0 bg-white'>
          <div className="flex items-center w-full px-8 justify-between space-x-2 py-4">
            <div className="text-muted-foreground text-sm">
              Page {currentPage} of {totalPages} ({totalItems} total items)
            </div>
            <div className='flex'>
              <Pagination>
                <PaginationContent>
                  {getPageNumbers().map((page, idx) => (
                    <PaginationItem key={idx}>
                      {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                </PaginationContent>
              </Pagination>
            </div>
            <div className="gap-2 flex">
              <DashboardButton
                variant="secondary"
                icon={<ChevronLeft className='size-5' />}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="shadow-md" 
              />
              <DashboardButton
                variant="secondary"
                icon={<ChevronRight className='size-5' />}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="shadow-md" 
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RoomsManagement;