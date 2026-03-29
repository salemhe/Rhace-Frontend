import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import UniversalLoader from '@/components/user/ui/LogoLoader';
import { staffService } from '@/services/staff.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Eye, EyeOff, FileDown, Filter, MoreVertical, Search, X, Users, Download } from 'lucide-react';
import { PeopleIcon } from '@/public/icons/icons.jsx';
import { StatCard } from '@/components/Statcard';
import { formatDate } from '@/utils/formatDate.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const StaffManagementSystem = () => {
  const [showModal, setShowModal] = useState(false);
  const [showTabs, setShowTabs] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    countryCode: '+234',
    email: '',
    staffId: '',
    role: 'Manager',
  });

  const [staff, setStaff] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveStaff = async () => {
    const newStaff = {
      name: formData.fullName,
      phone: formData.countryCode + formData.phone,
      email: formData.email,
      role: formData.role,
      staffId: formData.staffId,
      status: 'active'
    };

    try {
      const res = await staffService.createStaff(newStaff);
      setStaff(prev => [...prev, res]);
      toast.success("Staff added successfully");
      setShowModal(false);
      setFormData({
        fullName: '',
        phone: '',
        countryCode: '+234',
        email: '',
        staffId: '',
        role: 'Manager',
      });
    } catch (error) {
      toast.error("Failed to add staff");
    }
  };


  useEffect(() => {
    async function fetchStaffs() {
      try {
        setIsLoading(true);
        const items = await staffService.getStaff();
        setStaff(items.docs || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch Staffs");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStaffs();
  }, []);

  const filteredStaff = staff.filter(s => {
    const matchesTab = activeTab === 'All' ||
      (activeTab === 'Active' && s.status === 'active') ||
      (activeTab === 'Inactive' && s.status === 'inactive');
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || s.role === filterRole;
    return matchesTab && matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    inactive: staff.filter(s => s.status === 'inactive').length,
    noShow: staff.filter(s => s.status === 'no-show').length || 0
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case 'active': return "default" 
      case 'inactive': return "secondary"
      case 'no-show': return "destructive"
      default: return "outline"
    }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '';

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight">Staff List</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowTabs(!showTabs)}>
                {showTabs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                <Users className="w-4 h-4 mr-1" />
                + New Staff
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        {showTabs && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  title="Total Staff" 
                  value={stats.total} 
                  change={12} 
                  trend="up"
                  icon={PeopleIcon}
                  iconBg="bg-blue-100"
                  iconColor="text-blue-600"
                />
                <StatCard 
                  title="Active Staff" 
                  value={stats.active} 
                  change={8} 
                  trend="up"
                  icon={PeopleIcon}
                  iconBg="bg-green-100"
                  iconColor="text-green-600"
                />
                <StatCard 
                  title="Inactive Staff" 
                  value={stats.inactive} 
                  change={8} 
                  trend="up"
                  icon={PeopleIcon}
                  iconBg="bg-orange-100"
                  iconColor="text-orange-600"
                />
                <StatCard 
                  title="No-show Staff" 
                  value={stats.noShow} 
                  change={5} 
                  trend="down"
                  icon={PeopleIcon}
                  iconBg="bg-yellow-100"
                  iconColor="text-yellow-600"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: 'All', label: `All (${stats.total})` },
            { key: 'Active', label: `Active (${stats.active})` },
            { key: 'Inactive', label: `Inactive (${stats.inactive})` }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={activeTab === key ? "default" : "outline"}
              onClick={() => setActiveTab(key)}
              className="px-6"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="Chef">Chef</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Waiter">Waiter</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Advanced filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            {paginatedStaff.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No staff found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria.</p>
                <Button onClick={() => setShowModal(true)}>
                  + Add your first staff
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStaff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <input type="checkbox" className="rounded border-gray-300" />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                              {getInitials(member.name)}
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.staffId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{member.phone}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={member.email}>
                            {member.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(member.status)}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(member.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/50">
                  <div className="text-sm text-muted-foreground">
                    {filteredStaff.length} of {staff.length} staff
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      {totalPages > 5 && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages}>
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Add New Staff</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-2 -m-2 rounded-lg">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-6">
                  <Input 
                    placeholder="Full Name" 
                    name="fullName"
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                  />
                  <div className="flex gap-2">
                    <Input placeholder="+234" value={formData.countryCode} className="w-24" />
                    <Input placeholder="Phone" name="phone" value={formData.phone} />
                  </div>
                  <Input 
                    placeholder="Email" 
                    name="email"
                    type="email"
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                  <Input 
                    placeholder="Staff ID" 
                    name="staffId"
                    value={formData.staffId} 
                    onChange={handleInputChange} 
                  />
                  <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Chef">Chef</SelectItem>
                      <SelectItem value="Waiter">Waiter</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleSaveStaff}>
                      Save Staff
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StaffManagementSystem;

