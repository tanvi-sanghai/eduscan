import React, { useState, useEffect } from "react";
import {FiCpu, FiClock, FiHash, FiUsers, FiZap, FiDollarSign, FiTrendingUp, FiBox, FiChevronRight } from "react-icons/fi";
import Link from 'next/link';

const StatsBox = () => {
  const [stats, setStats] = useState({});

  const fetchStats = async () => {
    try {
      const response = await fetch("https://opencampus-codex.blockscout.com/api/v2/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setStats(data || {});
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon, title, value }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-sm font-semibold text-gray-600 ml-2">{title}</h3>
      </div>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  );

  return (
    <section className="md:w-1/3">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Network Analytics</h2>
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<FiCpu className="text-blue-500" />} title="Total Blocks" value={stats.total_blocks} />
        <StatCard icon={<FiUsers className="text-green-500" />} title="Total Addresses" value={stats.total_addresses} />
        <StatCard icon={<FiZap className="text-yellow-500" />} title="Total Transactions" value={stats.total_transactions} />
        <StatCard icon={<FiClock className="text-purple-500" />} title="Avg Block Time" value={`${stats.average_block_time / 1000}s`} />
        <StatCard icon={<FiDollarSign className="text-red-500" />} title="Coin Price" value={`$${parseFloat(stats.coin_price || 0).toFixed(5)}`} />
        <StatCard icon={<FiTrendingUp className="text-indigo-500" />} title="Network Utilization" value={`${(stats.network_utilization_percentage || 0).toFixed(2)}%`} />
      </div>
    </section>
  );
};

export default StatsBox;
