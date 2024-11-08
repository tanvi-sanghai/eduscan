'use client'
import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiClock, FiHash, FiUser, FiBox, FiArrowRight, FiZap, FiDollarSign, FiDatabase } from 'react-icons/fi';
import Link from 'next/link';

export default function Home() {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlocks = async () => {
        setLoading(true);
        const url = 'https://edu-chain-testnet.blockscout.com/api/v2/blocks?type=block&limit=50';

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setBlocks(data.items || []);
        } catch (error) {
            console.error("Error fetching blocks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlocks();
        const interval = setInterval(fetchBlocks, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const shortenAddress = (address) => {
        if (!address) return 'N/A';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const shortenHash = (hash) => {
        if (!hash) return 'N/A';
        return `${hash.slice(0, 18)}...${hash.slice(-18)}`;
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const blockTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - blockTime) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes === 1) return '1 minute ago';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours === 1) return '1 hour ago';
        if (diffInHours < 24) return `${diffInHours} hours ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return '1 day ago';
        return `${diffInDays} days ago`;
    };

    const formatNumber = (num, decimals = 2) => {
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(num);
    };

    const BlockCard = ({ block }) => {
        return (
            <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <span className="text-xl font-medium text-blue-600 mr-4">
                            Block #{block.height}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                            <FiClock className="inline mr-1" /> {getTimeAgo(block.timestamp)}
                        </span>
                    </div>
                    <Link href={`/block/${block.height}`}>
                        <span className="text-blue-600 hover:text-blue-800 hover:underline flex items-center">
                            View Details
                            <FiArrowRight className="ml-1" />
                        </span>
                    </Link>
                </div>
                <div className="text-sm mb-4">
                    <FiHash className="text-blue-500 mr-2 inline" />
                    <span className="mr-2">Block Hash:</span>
                    <span className="font-medium text-gray-700">{shortenHash(block.hash)}</span>
                </div>
                <div className="flex justify-between mb-4">
                    <div className="space-y-2">
                        <div className="flex items-center text-sm">
                            <FiUser className="text-blue-500 mr-2 flex-shrink-0" />
                            <span className="mr-2">Miner:</span>
                            <Link href={`/account/${block.miner?.hash}`}>
                                <span className="text-blue-600 hover:text-blue-800 hover:underline font-medium">{block.miner?.hash}</span>
                            </Link>
                        </div>
                        <div className="flex items-center text-sm">
                            <FiBox className="text-blue-500 mr-2 flex-shrink-0" />
                            <span>Transactions: <span className="font-medium">{block.tx_count}</span></span>
                        </div>
                        <div className="flex items-center text-sm">
                            <FiDatabase className="text-blue-500 mr-2 flex-shrink-0" />
                            <span>Size: <span className="font-medium">{formatNumber(block.size)} bytes</span></span>
                        </div>
                    </div>
                    <div className="space-y-2 text-right">
                        <div className="flex items-center justify-end text-sm">
                            <FiZap className="text-blue-500 mr-2 flex-shrink-0" />
                            <span>Gas Used: <span className="font-medium">{formatNumber(block.gas_used)}</span></span>
                        </div>
                        <div className="flex items-center justify-end text-sm">
                            <FiDollarSign className="text-blue-500 mr-2 flex-shrink-0" />
                            <span>Mining Reward: <span className="font-medium">{formatNumber(block.rewards)} EDU</span></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="container mx-auto max-w-8xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Blocks Explorer</h1>
                    <button 
                        onClick={fetchBlocks}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center transition duration-300 ease-in-out"
                    >
                        <FiRefreshCw className="mr-2" />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {blocks.length > 0 ? (
                            blocks.map((block, index) => (
                                <BlockCard key={index} block={block} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md text-xl">No blocks available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}