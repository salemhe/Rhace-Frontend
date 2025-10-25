import React from 'react';
import { Search, Bell, Menu, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from '@/components/dashboard/ui/svg';
import logo from '@/assets/Rhace-11.png';

const Header2 = ({ title }) => {
    const navigate = useNavigate()
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 relative">
            {/* Mobile menu button */}
            {/* Logo */}
            <div className='flex items-center h-full gap-4'>
                <div className="flex items-center h-16 px-4">
                    <div className="flex items-center">
                        <a href="/dashboard/restaurant">
                            <img 
                                src={logo} 
                                alt="Rhace Logo" 
                                className="h-6 w-auto object-contain transition-all duration-300"
                            />
                        </a>
                    </div>
                </div>
                <div className='h-2/5 w-[1px] bg-accent' />
                <div className='flex gap-3 items-center'>
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors z-10"
                    >
                        <ArrowLeft fill="#111827" className="w-6 h-6" />
                    </button>
                    <div className='font-semibold text-[#111827] text-lg'>
                        {title}
                    </div>
                </div>
            </div>





            {/* Right side items */}
            <div className="ml-auto flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User profile */}
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden md:block">
                        <div className="text-sm font-medium text-gray-900">Joseph Eyebiokin</div>
                        <div className="text-xs text-gray-500">Admin</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
            </div>
        </header>
    );
};

export default Header2;
