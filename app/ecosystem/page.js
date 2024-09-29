"use client";
import { useState, useMemo } from "react";
import data from "@/app/dapps.json";
import Image from "next/image";
import { Search, ExternalLink, X } from "lucide-react";

import Hero from "@/app/ecosystem/components/hero";
import DAppPopup from "@/app/ecosystem/components/dappPopup";

const DAppCard = ({ dapp, onViewMore }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full mb-3 sm:mb-4 overflow-hidden">
        {!logoError ? (
          <Image
            src={dapp["Project logo"]}
            alt={`${dapp["Project name"]} logo`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg sm:text-xl font-bold">
            {dapp["Project name"].charAt(0)}
          </div>
        )}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{dapp["Project name"]}</h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 flex-grow">
        {dapp["Project description"]?.slice(0, 100)}
        {dapp["Project description"]?.length > 100 ? '...' : ''}
      </p>
      <div className="flex justify-between items-center">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
          {dapp["Project category tag"]}
        </span>
        <button
          onClick={() => onViewMore(dapp)}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center text-sm"
        >
          View More
        </button>
      </div>
    </div>
  );
};

const AllDApps = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDApp, setSelectedDApp] = useState(null);
  const itemsPerPage = 8;

  const categories = useMemo(() => [...new Set(data.map((dapp) => dapp["Project category tag"]))], []);

  const filteredDApps = useMemo(() => {
    return data.filter(
      (dapp) =>
        dapp["Project name"].toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "" || dapp["Project category tag"] === selectedCategory)
    );
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredDApps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDApps = filteredDApps.slice(startIndex, endIndex);

  const handleViewMore = (dapp) => {
    setSelectedDApp(dapp);
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-28 mt-10 sm:mt-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-blue-600">All dApps</h2>
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <select
          className="border rounded-md px-3 sm:px-4 py-2 w-full sm:w-auto bg-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="flex w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by keyword"
            className="border rounded-l-md px-3 sm:px-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors duration-300">
            <Search size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {currentDApps.map((dapp, index) => (
          <DAppCard key={index} dapp={dapp} onViewMore={handleViewMore} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-200 text-gray-600 disabled:opacity-50"
          >
            &lt;
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-gray-200 text-gray-600 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
      {selectedDApp && (
        <DAppPopup dapp={selectedDApp} onClose={() => setSelectedDApp(null)} />
      )}
    </section>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <AllDApps />
    </div>
  );
}