import { useState, useEffect } from 'react';
import { Search, ChevronDown, MoreVertical, Plus, Upload } from 'lucide-react';
// import { supabase, Drink } from '../lib/supabase';
import { AddDrinkModal } from './AddDrinkModal';
import DashboardLayout from '@/components/layout/DashboardLayout';
// import dummyDrinks from '@/services/rest.services';
// import AddBottleSetModal from './AddBottleSet';
import { ca } from 'date-fns/locale';
import { clubService } from '@/services/club.service';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

export function DrinksTable() {
  const [drinks, setDrinks] = useState([]);

  const [filteredDrinks, setFilteredDrinks] = useState([]);
  const [selectedTab, setSelectedTab] = useState('drinks');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('Today');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Payment Status');
  const [selectedDrinks, setSelectedDrinks] = useState(new Set());
  const [showAddDrinkModal, setShowAddDrinkModal] = useState(false);
  const [showAddBottleSetModal, setShowAddBottleSetModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const vendor = useSelector((state) => state.auth.vendor);
  const navigate = useNavigate();

  useEffect(() => {
    loadDrinks();
  }, []);

  useEffect(() => {
    filterDrinks();
  }, [drinks, searchQuery]);

  const loadDrinks = async () => {
    //  const { data, error } = await supabase
    //    .from('drinks')
    //    .select('*')
    //    .order('created_at', { ascending: false });

    //  if (error) {
    //    console.error('Error loading drinks:', error);
    //  } else if (data) {
    //    setDrinks(data);
    //  }
  };

  const filterDrinks = () => {
    let filtered = drinks;

    if (searchQuery) {
      filtered = filtered.filter(drink =>
        drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drink.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDrinks(filtered);
  };

  const toggleDrinkSelection = (id) => {
    const newSelected = new Set(selectedDrinks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDrinks(newSelected);
  };

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const data = await clubService.getDrinks(vendor._id);
        setDrinks(data.drinks);
        console.log('Fetched drinks:', data);
      } catch (error) {
        console.error('Error fetching drinks:', error);
      } finally {
        setIsLoading(false)
      }
    }
    fetchDrinks();
  }, [])

  const toggleAllDrinks = () => {
    if (selectedDrinks.size === filteredDrinks.length) {
      setSelectedDrinks(new Set());
    } else {
      setSelectedDrinks(new Set(filteredDrinks.map(d => d.id)));
    }
  };

  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <p className='animate-pulse text-lg'>Loading...</p>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">All Drinks</h1>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <Upload size={18} />
                <span>Export</span>
              </button>
              <button
                onClick={() => navigate('/dashboard/club/add-drinks')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <Plus size={18} />
                <span>Add Bottle Set</span>
              </button>
              <button
                onClick={() => setShowAddDrinkModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
              >
                <Plus size={18} />
                <span>Add New Drink</span>
              </button>
            </div>
          </div>

          {/* Tabs and Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedTab('drinks')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${selectedTab === 'drinks'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Drinks
              </button>
              <button
                onClick={() => setSelectedTab('sets')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${selectedTab === 'sets'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Drinks Sets
              </button>
              <button
                onClick={() => setSelectedTab('packages')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${selectedTab === 'packages'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Party Packages
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search drinks"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                <span>{dateFilter}</span>
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                <span>{statusFilter}</span>
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                <span>Advanced filter</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedDrinks.size === filteredDrinks.length && filteredDrinks.length > 0}
                      onChange={toggleAllDrinks}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drink name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price (₦)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDrinks.map((drink) => (
                  <tr key={drink._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDrinks.has(drink._id)}
                        onChange={() => toggleDrinkSelection(drink._id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <img
                        src={drink.images[0]}
                        alt={drink.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{drink.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{drink.category}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{drink.volume}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">₦{drink.price.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{drink.quantity}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${drink.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}>
                        {drink.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">Page 1 of 30</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded ${currentPage === page
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}
              <span className="px-2 text-gray-500">...</span>
              {[10, 11, 12].map((page) => (
                <button
                  key={page}
                  className="w-8 h-8 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showAddDrinkModal && (
          <AddDrinkModal
            onClose={() => setShowAddDrinkModal(false)}
            onSuccess={() => {
              loadDrinks();
              setShowAddDrinkModal(false);
            }}
          />
        )}

        {/* {showAddBottleSetModal && (
          <AddBottleSetModal
            onClose={() => setShowAddBottleSetModal(false)}
            onSuccess={() => {
              setShowAddBottleSetModal(false);
            }}
          />
        )} */}
      </div>
    </DashboardLayout>
  );
}
