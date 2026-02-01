import React, { useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import moment from "moment";
import { tr } from 'date-fns/locale';

const FinancialDashboard = ({ info, trend }) => {
    const [time, setTime] = useState('weekly');
    const availableBalance = info.balance;
    const currencySymbol = '₦';
    const lastPaymentDate = 'May 31st, 2025';
    const accountHolder = info.accountName;
    const lastFourDigits = info.accountNumber;
    const earningsValue = trend.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const earningsChange = `${trend.percentChange}%`;
    const branches = ['Restaurant 1 - HQ'];

    const chartData = trend.trends.map(item => ({
        date: moment(item._id).format("MMM D"), // 'Jan 1'
        earnings: item.totalEarnings
    }));
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
    }

    return (
        <div className="flex flex-col lg:flex-row gap-5 mx-auto" >

            {/* 1. Account Summary Panel (Left) */}
            < div className="flex-1 p-5 bg-white rounded-2xl border" >
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h3 className="text-sm text-gray-500 font-medium mb-1">Available Balance</h3>
                        <div className="text-4xl font-extrabold text-gray-800">{currencySymbol}{availableBalance}</div>
                        <p className="text-xs text-gray-400 mt-1">Last payment processed on {lastPaymentDate}</p>
                    </div>
                </div>

                {/* Zenith Bank Card */}
                <div className="bg-[#1E1E1E] h-[178px] flex flex-col justify-between text-white p-4 rounded-lg mb-4" >
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                            <div className='relative w-10 h-10 mr-3'>
                                <img src={info.bankLogo} alt={info.bankName} className='absolute size-full object-contain' />
                            </div>
                            <div>
                                <p className="text-sm font-bold m-0">{info.bankName}</p>
                                <p className="text-xs flex items-center gap-1"> <span className='size-2 flex rounded-full bg-[#37703F]' /> Verified Account</p>
                            </div>
                        </div>
                    </div>
                    <div>

                        <div className="text-xl items-center flex font-medium">{lastFourDigits}</div>
                        <p className="text-sm m-0">{accountHolder}</p>
                    </div>
                </div >
            </div >

            <div className="flex-1 p-5 bg-white rounded-2xl border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Earnings Trends</h3>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-blue-500 cursor-pointer hover:text-blue-600">View All</span>
                        <select value={time} onChange={(e) => setTime(e.target.value)} className="p-1 text-sm border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500">
                            <option>Weekly</option>
                            <option>Monthly</option>
                            <option>Quarterly</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4 flex gap-3">
                    <div>

                        <span className="text-3xl font-extrabold text-gray-800 mr-2">{currencySymbol}{earningsValue}</span>
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
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 5)}
                        />
                        <ChartTooltip
                            cursor={false}
                            formatter={(value) => `₦${value.toLocaleString()}`}
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
                            dataKey="earnings"
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