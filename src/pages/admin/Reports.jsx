import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { BarChart3, Download, FileText, Loader2, Calendar as CalendarIcon, Search, Filter, Zap, Clock, CheckCircle, XCircle, AlertCircle, FileSpreadsheet, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  generateReservationsReport,
  generateVendorEarningsReport,
  generatePaymentsReport,
  generateUsersReport,
  generateVendorsReport,
  getReportStatus,
  downloadReport,
  getVendors,
} from "@/services/admin.service";
import { useWebSocket } from "@/contexts/WebSocketContext";

const extractArray = (p) => {
  if (Array.isArray(p)) return p;
  const candidates = [
    p?.data, p?.items, p?.results, p?.docs, p?.rows, p?.vendors, p?.list,
    p?.data?.data, p?.data?.items, p?.data?.results, p?.data?.docs, p?.data?.rows, p?.data?.vendors,
  ];
  for (const c of candidates) if (Array.isArray(c)) return c;
  return [];
};

export default function Reports() {
  const [reportJobs, setReportJobs] = useState(() => {
    const savedJobs = localStorage.getItem("reportJobs");
    return savedJobs ? JSON.parse(savedJobs) : [];
  });
  const [selectedReportType, setSelectedReportType] = useState("");
  const [generating, setGenerating] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [filters, setFilters] = useState({});
  const [date, setDate] = useState({ from: new Date(), to: new Date() });

  // New state for enhanced features
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const { subscribe, unsubscribe, sendMessage } = useWebSocket();

  const handleReportTypeChange = (type) => {
    setSelectedReportType(type);
    setFilters({});
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateJobStatus = useCallback((jobId, status) => {
    setReportJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status } : job
    ));
  }, []);

  useEffect(() => {
    localStorage.setItem("reportJobs", JSON.stringify(reportJobs));
  }, [reportJobs]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await getVendors({ limit: 1000 });
        const vendorData = extractArray(response.data);
        setVendors(vendorData);
      } catch (error) {
        console.error("Failed to fetch vendors", error);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    const checkJobStatus = async (jobId) => {
      try {
        const response = await getReportStatus(jobId);
        const status = response.data?.status;
        if (status) {
          updateJobStatus(jobId, status);
          return status;
        }
      } catch (error) {
        console.error(`Failed to get status for job ${jobId}`, error);
        // Stop polling on error
        return "failed";
      }
      return "pending"; // Keep polling if status not retrieved
    };

    const pendingJobs = reportJobs.filter(job => job.status === "pending" || job.status === "processing");

    if (pendingJobs.length === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      pendingJobs.forEach(job => {
        checkJobStatus(job.id).then(status => {
          if (status === "completed" || status === "failed") {
            // The job is done, no need to check it anymore in this interval loop.
            // A new interval will be set up on the next render if there are still pending jobs.
          }
        });
      });
    }, 2000); // Poll every 2 seconds for faster updates

    return () => clearInterval(intervalId);
  }, [reportJobs, updateJobStatus]);

  const reportTypes = [
    { value: "reservations", label: "Reservations Report", generateFn: generateReservationsReport },
    { value: "vendor-earnings", label: "Vendor Earnings Report", generateFn: generateVendorEarningsReport },
    { value: "payments", label: "Payments Report", generateFn: generatePaymentsReport },
    { value: "users", label: "Users Report", generateFn: generateUsersReport },
    { value: "vendors", label: "Vendors Report", generateFn: generateVendorsReport },
  ];

  const generateReport = async () => {
    if (!selectedReportType) return;

    try {
      setGenerating(true);
      const reportType = reportTypes.find((rt) => rt.value === selectedReportType);
      const params = { ...filters };
      if (date?.from) {
        params.dateFrom = format(date.from, "yyyy-MM-dd");
      }
      if (date?.to) {
        params.dateTo = format(date.to, "yyyy-MM-dd");
      }

      console.log("Generating report with params:", params);
      const response = await reportType.generateFn(params);
      console.log("Report generation response:", response);
      console.log("Response data:", response?.data);
      console.log("Response status:", response?.status);
      const jobId = response.data?._id;

      if (jobId) {
        setReportJobs(prev => [...prev, {
          id: jobId,
          type: selectedReportType,
          status: "pending",
          createdAt: new Date().toISOString(),
        }]);
        setSelectedReportType("");
      } else {
        console.error("No jobId in response", response.data);
      }
    } catch (error) {
      console.error("Failed to generate report", error);
      // Optionally, show user-friendly error message
      alert(`Failed to generate report: ${error.response?.data?.message || error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (jobId) => {
    try {
      // First check if the job is actually completed
      const statusResponse = await getReportStatus(jobId);
      const status = statusResponse.data?.status;

      if (status !== 'completed') {
        toast.error(`Report is not ready yet. Current status: ${status}. Please wait for completion.`);
        return;
      }

      const response = await downloadReport(jobId);

      // Check if response is valid
      if (!response.data || response.data.size === 0) {
        throw new Error('Empty response received from server');
      }

      // Check if it's actually a blob/file response
      if (!(response.data instanceof Blob)) {
        throw new Error('Invalid response format - expected file data');
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${jobId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Show success message
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error("Failed to download report", error);

      // More specific error messages
      let errorMessage = 'Download failed';
      if (error.response?.status === 404) {
        errorMessage = 'Report not found. It may have been deleted or expired.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. You may not have permission to download this report.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = `Download failed: ${error.message}`;
      }

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const handleReportUpdate = (data) => {
      console.log("WebSocket report-update data:", data);
      const jobId = data._id || data.id || data.jobId;
      if (jobId && data.status) {
        updateJobStatus(jobId, data.status);
      }
    };

    const handleReportJobDeleted = (data) => {
      console.log("WebSocket report-job-deleted data:", data);
      const jobId = data.id || data.jobId;
      if (jobId) {
        setReportJobs(prev => prev.filter(job => job.id !== jobId));
      }
    };

    subscribe("report-update", handleReportUpdate);
    subscribe("report-job-deleted", handleReportJobDeleted);

    return () => {
      unsubscribe("report-update");
      unsubscribe("report-job-deleted");
    };
  }, [subscribe, unsubscribe, updateJobStatus]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  const isGenerateButtonDisabled = () => {
    if (!selectedReportType || generating) return true;
    if (selectedReportType === 'vendor-earnings' && !filters.vendorId) return true;
    return false;
  };

  // Quick Report Templates
  const reportTemplates = [
    {
      id: 'weekly-summary',
      name: 'Weekly Summary',
      description: 'Overview of reservations, payments, and user activity for the past week',
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      config: {
        type: 'reservations',
        dateRange: 'week',
        filters: {}
      }
    },
    {
      id: 'monthly-performance',
      name: 'Monthly Performance',
      description: 'Detailed performance metrics for all vendors in the current month',
      icon: <BarChart3 className="h-5 w-5 text-green-500" />,
      config: {
        type: 'vendor-earnings',
        dateRange: 'month',
        filters: {}
      }
    },
    {
      id: 'user-activity',
      name: 'User Activity Report',
      description: 'Comprehensive report on user registrations and activity patterns',
      icon: <CheckCircle className="h-5 w-5 text-purple-500" />,
      config: {
        type: 'users',
        dateRange: 'month',
        filters: { status: 'active' }
      }
    }
  ];

  const applyTemplate = (template) => {
    const now = new Date();
    let fromDate, toDate;

    switch (template.config.dateRange) {
      case 'week':
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        toDate = now;
        break;
      case 'month':
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        toDate = now;
        break;
      default:
        fromDate = now;
        toDate = now;
    }

    setSelectedReportType(template.config.type);
    setDate({ from: fromDate, to: toDate });
    setFilters(template.config.filters || {});
    toast.success(`Applied ${template.name} template`);
  };

  // Enhanced Jobs List Functions
  const filteredJobs = reportJobs.filter(job => {
    const matchesSearch = job.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportJobsToCSV = () => {
    const csvContent = [
      ['Job ID', 'Type', 'Status', 'Created At'],
      ...filteredJobs.map(job => [
        job.id,
        reportTypes.find(rt => rt.value === job.type)?.label || job.type,
        job.status,
        new Date(job.createdAt).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report-jobs.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success('Jobs exported to CSV');
  };

  const deleteReportJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this report job? This action cannot be undone.')) {
      setReportJobs(prev => prev.filter(job => job.id !== jobId));
      sendMessage("report-job-deleted", { id: jobId });
      toast.success('Report job deleted successfully');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Reports</h1>
        </div>
      </div>

      {/* Quick Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Report Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                onClick={() => applyTemplate(template)}
              >
                <div className="flex items-center gap-3 mb-2">
                  {template.icon}
                  <h3 className="font-medium">{template.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={selectedReportType} onValueChange={handleReportTypeChange}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedReportType && (
              <>
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Vendor Earnings Report */}
                {selectedReportType === 'vendor-earnings' && (
                  <div className="space-y-2">
                    <Label htmlFor="vendor-id">Vendor</Label>
                    <Select onValueChange={(value) => handleFilterChange('vendorId', value)}>
                      <SelectTrigger id="vendor-id">
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor._id} value={vendor._id}>{vendor.businessName || vendor.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Reservations Report */}
                {selectedReportType === 'reservations' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="vendor-id-reservations">Vendor (optional)</Label>
                      <Select onValueChange={(value) => handleFilterChange('vendorId', value)}>
                        <SelectTrigger id="vendor-id-reservations"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                        <SelectContent>
                          {vendors.map((vendor) => (
                            <SelectItem key={vendor._id} value={vendor._id}>{vendor.businessName || vendor.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reservation-status">Status (optional)</Label>
                      <Select onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger id="reservation-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Payments Report */}
                {selectedReportType === 'payments' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="vendor-id-payments">Vendor (optional)</Label>
                      <Select onValueChange={(value) => handleFilterChange('vendorId', value)}>
                        <SelectTrigger id="vendor-id-payments"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                        <SelectContent>
                          {vendors.map((vendor) => (
                            <SelectItem key={vendor._id} value={vendor._id}>{vendor.businessName || vendor.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-status">Status (optional)</Label>
                      <Select onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger id="payment-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="succeeded">Succeeded</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Users Report */}
                {selectedReportType === 'users' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="user-role">Role (optional)</Label>
                      <Select onValueChange={(value) => handleFilterChange('role', value)}>
                        <SelectTrigger id="user-role"><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                          <SelectItem value="superadmin">Superadmin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-status">Status (optional)</Label>
                      <Select onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger id="user-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Vendors Report */}
                {selectedReportType === 'vendors' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="vendor-type">Vendor Type (optional)</Label>
                      <Select onValueChange={(value) => handleFilterChange('vendorType', value)}>
                        <SelectTrigger id="vendor-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="club">Club</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendor-status">Status (optional)</Label>
                      <Select onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger id="vendor-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="is-verified">Verified (optional)</Label>
                      <Select onValueChange={(value) => handleFilterChange('isVerified', value)}>
                        <SelectTrigger id="is-verified"><SelectValue placeholder="Select verification status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Verified</SelectItem>
                          <SelectItem value="false">Not Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={generateReport} disabled={isGenerateButtonDisabled()}>
              {generating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Report Jobs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Jobs ({filteredJobs.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportJobsToCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job ID or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {reportJobs.length === 0 ? "No reports generated yet." : "No reports match your filters."}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {job.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : job.status === "processing" ? (
                        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                      ) : job.status === "failed" ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {reportTypes.find(rt => rt.value === job.type)?.label || job.type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {job.id} • Created: {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(job.status)}
                      {job.status === "completed" && (
                        <Button size="sm" onClick={() => handleDownload(job.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteReportJob(job.id)}
                        title="Delete report job"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}