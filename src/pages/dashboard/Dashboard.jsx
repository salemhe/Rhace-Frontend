
import DashboardLayout from '@/components/layout/DashboardLayout'
import React from 'react'

import { TrendingUp, Calendar, Users, DollarSign, User } from 'lucide-react';
const VendorDashboard = () => {
    const stats = [
    {
      title: 'Reservations made today',
      value: '32',
      change: '↑ 12% vs last week',
      changeType: 'positive',
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Prepaid Reservations',
      value: '16',
      change: '↑ 8% vs last week',
      changeType: 'positive',
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Expected Guests Today',
      value: '80',
      change: '↑ 8% vs last week',
      changeType: 'positive',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Pending Payments',
      value: '$2,546.00',
      change: '↓ 5% vs last week',
      changeType: 'negative',
      icon: DollarSign,
      color: 'orange'
    }
  ];
  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Welcome message */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <div className="flex items-center">
          <div className="w-6 h-6 text-yellow-600 mr-3">⚠️</div>
          <p className="text-yellow-800">3 Reservations commencing in the next 30 minutes</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back, Joseph!</h1>
          <p className="text-gray-600">Here's what is happening today.</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center">
          <span className="mr-2">+</span>
          New Reservation
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Reservations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Today's Reservations</h3>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium">Emily Johnson</p>
                    <p className="text-sm text-gray-500">Time: 7:30 pm</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">4 Guests</p>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Upcoming</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reservations Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Reservations Trends</h3>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">This week</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Last week</span>
            </div>
          </div>
          <p className="text-2xl font-bold mb-1">104</p>
          <p className="text-sm text-green-600">↑ 8% vs last week</p>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}

export default VendorDashboard
