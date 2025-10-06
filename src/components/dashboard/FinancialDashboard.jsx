import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import DashboardButton from './ui/DashboardButton';
import { Add } from './ui/svg';

const FinancialDashboard = () => {
    // Mock data to populate the dashboard
    const availableBalance = '567,456.00';
    const currencySymbol = '#';
    const lastPaymentDate = 'May 31st, 2025';
    const accountHolder = 'Joseph Eyebiokin';
    const lastFourDigits = '123456';
    const earningsValue = '104';
    const earningsChange = '8%';
    const branches = ['Restaurant 1 - HQ'];

    const chartData = [
        { month: "January", desktop: 186 },
        { month: "February", desktop: 305 },
        { month: "March", desktop: 237 },
        { month: "April", desktop: 73 },
        { month: "May", desktop: 209 },
        { month: "June", desktop: 214 },
    ]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
    }

    return (
        <div className="flex flex-col lg:flex-row gap-5 max-w-5xl mx-auto p-4" >

            {/* 1. Account Summary Panel (Left) */}
            < div className="flex-1 p-5 bg-white rounded-xl shadow-lg" >
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h3 className="text-sm text-gray-500 font-medium mb-1">Available Balance</h3>
                        <div className="text-4xl font-extrabold text-gray-800">{currencySymbol}{availableBalance}</div>
                        <p className="text-xs text-gray-400 mt-1">Last payment processed on {lastPaymentDate}</p>
                    </div>
                    <DashboardButton text="Withdraw" variant="primary" icon={<Add className="text-white size-5" />} />
                </div>

                {/* Zenith Bank Card */}
                <div className="bg-gray-800 h-[200px] text-white p-4 rounded-lg mb-4" >
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                            <span className="text-3xl font-black mr-2 text-red-600">Z</span> {/* Zenith logo color */}
                            <div>
                                <p className="text-sm font-bold m-0">Zenith Bank</p>
                                <p className="text-xs text-green-400 m-0">✓ Verified Account</p>
                            </div>
                        </div>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded-md transition duration-150 ease-in-out">
                            Edit
                        </button>
                    </div>
                    <div className="text-xl font-medium my-4">*****{lastFourDigits}</div>
                    <p className="text-sm m-0">{accountHolder}</p>
                </div >
            </div >

            <div className="flex-1 p-5 bg-white rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Earnings Trends</h3>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-blue-500 cursor-pointer hover:text-blue-600">View All</span>
                        <select className="p-1 text-sm border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500">
                            <option>Weekly</option>
                            <option>Monthly</option>
                            <option>Quarterly</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4 flex gap-3">
                    <div>

                        <span className="text-3xl font-extrabold text-gray-800 mr-2">{earningsValue}</span>
                        <span className="text-sm text-emerald-600 font-semibold">
                            ↑{earningsChange} vs last week
                        </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
                        {branches.map((branch, index) => (
                            <span key={index} className="flex items-center">
                                <span
                                    className={`text-lg mr-1 size-2 rounded-full ${index === 0 ? 'bg-emerald-500' : 'bg-gray-400'}`}
                                />
                                {branch}
                            </span>
                        ))}
                    </div>
                </div>

                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#60A5FA"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="4C98F1"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            fillOpacity={0.4}
                            stroke="#60A5FA"
                        />
                    </AreaChart>
                </ChartContainer>
            </div>
        </div >
    );
};

export default FinancialDashboard;