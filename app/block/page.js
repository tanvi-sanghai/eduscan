'use client'
import React, { useState, useEffect } from 'react';
import BlockTree from "@/app/components/blockTree";
import { FiChevronDown, FiRefreshCw } from 'react-icons/fi';
import BlockDetails from '@/app/components/BlockDetails';

export default function Home() {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mined');
    const [filters, setFilters] = useState({
        type: [],
        method: []
    });
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const blocksPerPage = 50;

    const fetchBlocks = async () => {
        setLoading(true);
        const queryParams = new URLSearchParams({
            filter: activeTab === 'mined' ? 'validated' : 'pending',
            ...(filters.type.length && { type: filters.type.join(',') }),
            ...(filters.method.length && { method: filters.method.join(',') }),
            page: currentPage,
            limit: blocksPerPage
        });
        const url = `https://opencampus-codex.blockscout.com/api/v2/blocks?type=block${queryParams}`;

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
    }, [activeTab, filters, currentPage]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

    const DropdownMenu = ({ title, options, filterType }) => (
        <div className="relative inline-block text-left">
            <div>
                <button type="button" onClick={() => setOpenDropdown(openDropdown === filterType ? null : filterType)}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                        id="options-menu" aria-haspopup="true" aria-expanded="true">
                    {title}
                    <FiChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            {openDropdown === filterType && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options.map(option => (
                            <label key={option} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-indigo-600"
                                    checked={filters[filterType].includes(option)}
                                    onChange={(e) => {
                                        const newFilters = e.target.checked
                                            ? [...filters[filterType], option]
                                            : filters[filterType].filter(item => item !== option);
                                        handleFilterChange(filterType, newFilters);
                                    }}
                                />
                                <span className="ml-2">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const handleNextPage = () => setCurrentPage(prevPage => prevPage + 1);
    const handlePreviousPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Blocks</h1>
                <div className="flex space-x-4">
                    <DropdownMenu
                        title="Type"
                        options={['token_transfer', 'contract_creation', 'contract_call', 'coin_transfer', 'token_creation']}
                        filterType="type"
                    />
                    <DropdownMenu
                        title="Method"
                        options={['approve', 'transfer', 'multicall', 'mint', 'commit']}
                        filterType="method"
                    />
                    <button 
                        onClick={fetchBlocks}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
                    >
                        <FiRefreshCw className="mr-2" />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <a
                            href="#"
                            className={`${
                                activeTab === 'mined'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            onClick={() => setActiveTab('mined')}
                        >
                            Mined
                        </a>
                        <a
                            href="#"
                            className={`${
                                activeTab === 'pending'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-8`}
                            onClick={() => setActiveTab('pending')}
                        >
                            Pending
                        </a>
                    </nav>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mb-4">
                <button 
                    onClick={handlePreviousPage}
                    className={`bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-gray-700">Page {currentPage}</span>
                <button 
                    onClick={handleNextPage}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                    Next
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {blocks.length > 0 ? (
                        blocks.map((block, index) => (
                            <BlockDetails key={index} block={block} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md text-xl">No blocks available.</p>
                    )}
                </div>
            )}
        </div>
    );
}