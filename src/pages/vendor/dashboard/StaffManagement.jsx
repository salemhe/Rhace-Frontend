import { PeopleIcon } from '@/public/icons/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UniversalLoader from '@/components/user/ui/LogoLoader';
import { staffService } from '@/services/staff.service';
import { ChevronRight, Eye, EyeOff, FileDown, Filter, MoreVertical, Search, Upload, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const StaffManagementSystem = () => {
   const [showModal, setShowModal] = useState(false);
   const [modalStep, setModalStep] = useState(1);
   const [showTabs, setShowTabs] = useState(true);
   const [activeTab, setActiveTab] = useState('All');
   const [searchTerm, setSearchTerm] = useState('');
   const [filterRole, setFilterRole] = useState('all');
   const [currentPage, setCurrentPage] = useState(1);
   const [isLoading, setIsLoading] = useState(false)
   const itemsPerPage = 9;

   const [formData, setFormData] = useState({
      fullName: '',
      phone: '',
      countryCode: '+234',
      email: '',
      staffId: '',
      jobTitle: '',
      branch: '',
      role: 'Manager',
      profilePicture: null
   });

   const [permissions, setPermissions] = useState({
      customPermissions: false,
      modules: {
         Reservations: { view: true, create: true, edit: true, delete: false },
         'Menu Management': { view: true, create: true, edit: true, delete: true },
         'Staff Management': { view: true, create: false, edit: false, delete: false },
         'Payments & Reports': { view: true, create: false, edit: false, delete: false }
      }
   });

   const [staff, setStaff] = useState([
      // { id: 1, name: 'Emily Johnson', phone: '+234701234567', email: 'staffname@gmail.com', role: 'Chef', dateAdded: '25/6/2025', status: 'active' },
      // { id: 2, name: 'Emily Johnson', phone: '+234701234567', email: 'staffname@gmail.com', role: 'Chef', dateAdded: '25/6/2025', status: 'active' },
      // { id: 3, name: 'Emily Johnson', phone: '+234701234567', email: 'staffname@gmail.com', role: 'Chef', dateAdded: '25/6/2025', status: 'active' },
      // { id: 4, name: 'Emily Johnson', phone: '+234701234567', email: 'staffname@gmail.com', role: 'Manager', dateAdded: '25/6/2025', status: 'active' },
      // { id: 5, name: 'Emily Johnson', phone: '+234701234567', email: 'staffname@gmail.com', role: 'Waiter', dateAdded: '25/6/2025', status: 'active' },
      // { id: 6, name: 'Emily Johnson', phone: '+234701234567', email: 'staffname@gmail.com', role: 'Waiter', dateAdded: '25/6/2025', status: 'active' },
      // { id: 7, name: 'Emily Johnson', phone: '+234701234567', email: 'staffname@gmail.com', role: 'Waiter', dateAdded: '25/6/2025', status: 'inactive' },
      // { id: 8, name: 'Emily Johnson', phone: '+234701234567', email: 'staffname@gmail.com', role: 'Waiter', dateAdded: '25/6/2025', status: 'active' },
      // { id: 9, name: 'Emily Johnson', phone: '+234701234567', email: 'staffname@gmail.com', role: 'Waiter', dateAdded: '25/6/2025', status: 'active' }
   ]);

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };

   const handlePermissionToggle = (module, permission) => {
      setPermissions(prev => ({
         ...prev,
         modules: {
            ...prev.modules,
            [module]: {
               ...prev.modules[module],
               [permission]: !prev.modules[module][permission]
            }
         }
      }));
   };

   const handleSelectAll = (checked) => {
      const updated = { ...permissions.modules };
      Object.keys(updated).forEach(module => {
         Object.keys(updated[module]).forEach(perm => {
            updated[module][perm] = checked;
         });
      });
      setPermissions(prev => ({ ...prev, modules: updated }));
   };

   const handleSaveStaff = async () => {
      const newStaff = {
         id: staff.length + 1,
         name: formData.fullName,
         phone: formData.countryCode + formData.phone,
         email: formData.email,
         role: formData.role,
         staffId: formData.staffId,
         status: 'active'
      };

      const res = await staffService.createStaff(newStaff)
      console.log(res)
      setStaff([...staff, res]);
      setShowModal(false);
      setModalStep(1);
      setFormData({
         fullName: '',
         phone: '',
         countryCode: '+234',
         email: '',
         staffId: '',
         jobTitle: '',
         branch: '',
         role: 'Manager',
         profilePicture: null
      });
   };

   const stats = {
      total: staff.length,
      active: staff.filter(s => s.status === 'active').length,
      inactive: staff.filter(s => s.status === 'inactive').length,
      noShow: 1
   };

   useEffect(() => {
      async function fetchStaffs() {
         try {
            setIsLoading(true)
            const items = await staffService.getStaff();
            setStaff(items.docs)
         } catch (error) {
            console.error(error)
            toast.error("Failed to fetch Staffs")
         } finally {
            setIsLoading(false)
         }
      }
      fetchStaffs()
   }, [])

   const filteredStaff = staff.filter(s => {
      const matchesTab = activeTab === 'All' ||
         (activeTab === 'Active' && s.status === 'active') ||
         (activeTab === 'Inactive' && s.status === 'inactive');
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || s.role === filterRole;
      return matchesTab && matchesSearch && matchesRole;
   });

   const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
   const startIdx = (currentPage - 1) * itemsPerPage;
   const paginatedStaff = filteredStaff.slice(startIdx, startIdx + itemsPerPage);

   const StatCard = ({ label, value, change, color, IconColor }) => (
      <div className="p-6 h-full">
         <div className="flex items-start justify-between">
            <div>
               <p className="text-gray-600 text-sm mb-1">{label}</p>
               <p className="text-3xl font-semibold mb-2">{value}</p>
               <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last week
               </p>
            </div>
            <div style={{ borderColor: IconColor }} className={`p-3 rounded-lg border ${color}`}>
               {<PeopleIcon color={IconColor} />}
            </div>
         </div>
      </div>
   );

   if (isLoading) return <UniversalLoader fullscreen />

   return (
      <DashboardLayout>
         <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
               {/* Header */}
               <div className="flex justify-between items-center mb-8">
                  <h1 className="text-2xl font-semibold">Staff List</h1>
                  <div className="flex gap-3">
                     <button
                        onClick={() => setShowTabs(!showTabs)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg  bg-white hover:bg-gray-50"
                     >
                        {showTabs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showTabs ? 'Hide tabs' : 'Show tabs'}
                     </button>
                     <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                        <FileDown className="w-4 h-4" />
                        Export
                     </button>
                     <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                     >
                        + New Staff
                     </button>
                  </div>
               </div>

               {/* Stats Cards */}
               {showTabs && (
                  <div className="flex mb-8 rounded-lg bg-white border border-gray-200">
                     <div className="flex-1">
                        <StatCard label="Total Staff" value={stats.total} change={12} color="bg-blue-100" IconColor="#60A5FA" />
                     </div>

                     {/* Divider */}
                     <div className="w-px bg-gray-200 my-4"></div>

                     <div className="flex-1">
                        <StatCard label="Active Staff" value={stats.active} change={8} color="bg-green-100" IconColor="#06CD02" />
                     </div>

                     <div className="w-px bg-gray-200 my-4"></div>

                     <div className="flex-1">
                        <StatCard label="Inactive Staff" value={stats.inactive} change={8} color="bg-pink-100" IconColor="#CD16C3" />
                     </div>

                     <div className="w-px bg-gray-200 my-4"></div>

                     <div className="flex-1">
                        <StatCard label="No-show Staff" value={stats.noShow} change={-5} color="bg-yellow-100" IconColor="#E1B505" />
                     </div>
                  </div>
               )}


               {/* Tabs */}
               <div className="flex items-center gap-4 mb-6">
                  {['All', 'Active', 'Inactive'].map(tab => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg ${activeTab === tab
                           ? 'bg-teal-50 text-teal-600 border border-teal-200'
                           : 'text-gray-600 hover:bg-gray-100'
                           }`}
                     >
                        {tab}
                     </button>
                  ))}
               </div>

               {/* Search and Filters */}
               <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                     <input
                        type="text"
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                     />
                  </div>
                  <select
                     value={filterRole}
                     onChange={(e) => setFilterRole(e.target.value)}
                     className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                     <option value="all">Filter by role</option>
                     <option value="Chef">Chef</option>
                     <option value="Manager">Manager</option>
                     <option value="Waiter">Waiter</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                     <Filter className="w-4 h-4" />
                     Advanced filter
                  </button>
               </div>

               {/* Staff Table */}
               <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                     <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                           <th className="w-12 px-6 py-3">
                              <input type="checkbox" className="rounded" />
                           </th>
                           <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Staff name</th>
                           <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Phone number</th>
                           <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Email</th>
                           <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Role</th>
                           <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Date Added</th>
                           <th className="w-12"></th>
                        </tr>
                     </thead>
                     <tbody>
                        {paginatedStaff.map((member) => (
                           <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-6 py-4">
                                 <input type="checkbox" className="rounded" />
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                       <Users className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <span className="text-teal-600 font-medium">{member.name}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-gray-700">{member.phone}</td>
                              <td className="px-6 py-4 text-gray-700">{member.email}</td>
                              <td className="px-6 py-4 text-gray-700">{member.role}</td>
                              <td className="px-6 py-4 text-gray-700">{member.createdAt}</td>
                              <td className="px-6 py-4">
                                 <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical className="w-5 h-5" />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                     <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
                     <div className="flex items-center gap-2">
                        {[1, 2, 3, '...', 10, 11, 12].map((page, idx) => (
                           <button
                              key={idx}
                              onClick={() => typeof page === 'number' && setCurrentPage(page)}
                              disabled={page === '...'}
                              className={`w-8 h-8 rounded ${currentPage === page
                                 ? 'bg-teal-600 text-white'
                                 : 'text-gray-600 hover:bg-gray-100'
                                 } ${page === '...' ? 'cursor-default' : ''}`}
                           >
                              {page}
                           </button>
                        ))}
                        <button
                           onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                           className="ml-2 p-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                           <ChevronRight className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               </div>

               {/* Add Staff Modal */}
               {showModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                     <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {modalStep === 1 ? (
                           <div className="p-6">
                              <div className="flex justify-between items-center mb-6">
                                 <h2 className="text-xl font-semibold">Add New Staff</h2>
                                 <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                 </button>
                              </div>

                              <div className="space-y-4">
                                 <div>
                                    <label className="block text-sm font-medium mb-2">Profile Picture</label>
                                    <div className="flex gap-2">
                                       <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                          <Upload className="w-6 h-6 text-gray-400" />
                                       </div>
                                       <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                          Upload
                                       </button>
                                       <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                          Remove
                                       </button>
                                    </div>
                                 </div>

                                 <div>
                                    <label className="block text-sm font-medium mb-2">Full name*</label>
                                    <input
                                       type="text"
                                       name="fullName"
                                       value={formData.fullName}
                                       onChange={handleInputChange}
                                       placeholder="John Doe"
                                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                 </div>

                                 <div>
                                    <label className="block text-sm font-medium mb-2">Phone Number*</label>
                                    <div className="flex gap-2">
                                       <select
                                          name="countryCode"
                                          value={formData.countryCode}
                                          onChange={handleInputChange}
                                          className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                       >
                                          <option>+234</option>
                                          <option>+1</option>
                                          <option>+44</option>
                                       </select>
                                       <input
                                          type="text"
                                          name="phone"
                                          value={formData.phone}
                                          onChange={handleInputChange}
                                          placeholder="7012345678"
                                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                       />
                                    </div>
                                 </div>

                                 <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                       type="email"
                                       name="email"
                                       value={formData.email}
                                       onChange={handleInputChange}
                                       placeholder="John Doe"
                                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                 </div>

                                 <div>
                                    <label className="block text-sm font-medium mb-2">Staff ID</label>
                                    <input
                                       type="text"
                                       name="staffId"
                                       value={formData.staffId}
                                       onChange={handleInputChange}
                                       placeholder="JD12345"
                                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                 </div>

                                 <div>
                                    <label className="block text-sm font-medium mb-2">Job Title</label>
                                    <select
                                       name="jobTitle"
                                       value={formData.jobTitle}
                                       onChange={handleInputChange}
                                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                       <option value="">Enter job Title</option>
                                       <option value="Chef">Chef</option>
                                       <option value="Waiter">Waiter</option>
                                       <option value="Manager">Manager</option>
                                    </select>
                                 </div>

                                 <div>
                                    <label className="block text-sm font-medium mb-2">Assign to Branch</label>
                                    <select
                                       name="branch"
                                       value={formData.branch}
                                       onChange={handleInputChange}
                                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                       <option value="">Select branch from the list</option>
                                       <option value="Main Branch">Main Branch</option>
                                       <option value="Branch 2">Branch 2</option>
                                    </select>
                                 </div>
                              </div>

                              <div className="flex gap-3 mt-6">
                                 <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                 >
                                    Cancel
                                 </button>
                                 <button
                                    onClick={() => setModalStep(2)}
                                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                                 >
                                    Assign Role
                                 </button>
                              </div>
                           </div>
                        ) : (
                           <div className="p-6">
                              <div className="flex justify-between items-center mb-6">
                                 <h2 className="text-xl font-semibold">Add New Staff</h2>
                                 <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                 </button>
                              </div>

                              <div className="space-y-6">
                                 <div>
                                    <h3 className="font-medium mb-4">Assign Roles & Permissions</h3>

                                    <div className="mb-4">
                                       <label className="block text-sm font-medium mb-2">Job Role</label>
                                       <select
                                          name="role"
                                          value={formData.role}
                                          onChange={handleInputChange}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                       >
                                          <option>Manager</option>
                                          <option>Chef</option>
                                          <option>Waiter</option>
                                       </select>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                       <div>
                                          <p className="font-medium">Set Custom Permissions</p>
                                          <p className="text-sm text-gray-600">Override set default permissions</p>
                                       </div>
                                       <button
                                          onClick={() => setPermissions(prev => ({ ...prev, customPermissions: !prev.customPermissions }))}
                                          className={`w-12 h-6 rounded-full transition-colors ${permissions.customPermissions ? 'bg-teal-600' : 'bg-gray-300'
                                             }`}
                                       >
                                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${permissions.customPermissions ? 'translate-x-6' : 'translate-x-0.5'
                                             }`} />
                                       </button>
                                    </div>

                                    {permissions.customPermissions && (
                                       <div className="border border-gray-200 rounded-lg overflow-hidden">
                                          <div className="bg-gray-50 px-4 py-3 grid grid-cols-5 text-sm font-medium text-gray-600">
                                             <div>Modules</div>
                                             <div className="text-center">View</div>
                                             <div className="text-center">Create</div>
                                             <div className="text-center">Edit</div>
                                             <div className="text-center">Delete</div>
                                          </div>

                                          {Object.entries(permissions.modules).map(([module, perms]) => (
                                             <div key={module} className="px-4 py-3 grid grid-cols-5 items-center border-t border-gray-200 ">
                                                <div className="flex items-center gap-2 text-sm">
                                                   {module}
                                                   <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs"></span>
                                                </div>
                                                {['view', 'create', 'edit', 'delete'].map(perm => (
                                                   <div key={perm} className="flex justify-center">
                                                      <input
                                                         type="checkbox"
                                                         checked={perms[perm]}
                                                         onChange={() => handlePermissionToggle(module, perm)}
                                                         className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                      />
                                                   </div>
                                                ))}
                                             </div>
                                          ))}

                                          <div className="px-4 py-3 border-t border-gray-200">
                                             <label className="flex items-center gap-2 text-sm">
                                                <input
                                                   type="checkbox"
                                                   onChange={(e) => handleSelectAll(e.target.checked)}
                                                   className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                />
                                                Select all permissions
                                             </label>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              </div>

                              <div className="flex gap-3 mt-6">
                                 <button
                                    onClick={() => setModalStep(1)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                 >
                                    Back
                                 </button>
                                 <button
                                    onClick={handleSaveStaff}
                                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                                 >
                                    Save Staff
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>
         </div>
      </DashboardLayout>
   );
};

export default StaffManagementSystem;