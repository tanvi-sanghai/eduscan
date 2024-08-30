"use client"
import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const popupRef = useRef(null);
  const searchBarRef = useRef(null);

  useEffect(() => {
    if (searchResult) {
      document.body.classList.add('dimmed');
    } else {
      document.body.classList.remove('dimmed');
    }

    return () => {
      document.body.classList.remove('dimmed');
    };
  }, [searchResult]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSearchResult(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://opencampus-codex.blockscout.com/api/v2/search?q=${searchTerm}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const result = data.items[0];
        console.log(result.type);  
        setSearchResult(result);
      } else {
        console.log("No results found");
        setSearchResult(null);
      }
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  const getResultLink = () => {
    if (!searchResult) return '#';

    switch (searchResult.type) {
      case 'address':
        return `/account/${searchResult.address}`;
      case 'transaction':
        return `/transaction/${searchResult.tx_hash}`;
      case 'block':
        return `/block/${searchResult.block_hash}`;
      default:
        return '#';
    }
  };

  const getResultTypeColor = () => {
    switch (searchResult?.type) {
      case 'address':
        return 'bg-green-100 text-green-800';
      case 'transaction':
        return 'bg-blue-100 text-blue-800';
      case 'block':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-white font-bold text-3xl cursor-pointer tracking-tight">
                Edu<span className="text-blue-300">Scan</span>
              </span>
            </Link>
          </div>
          <div className="flex-grow max-w-3xl mx-4 relative">
            <div className="relative flex items-center" ref={searchBarRef}>
              <input
                type="text"
                placeholder="Search by Address / Txn Hash / Block / Token"
                className="w-full bg-white bg-opacity-10 text-white placeholder-blue-200 rounded-l-md py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-opacity-20 transition duration-300 ease-in-out text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-blue-200" />
              </div>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-r-md transition duration-300 ease-in-out"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            {searchResult && (
              <Link href={getResultLink()} onClick={() => setSearchResult(null)}>
                <div 
                  ref={popupRef} 
                  className="absolute mt-2 bg-white rounded-lg shadow-xl z-20 cursor-pointer"
                  style={{ 
                    width: searchBarRef.current ? `${searchBarRef.current.offsetWidth}px` : '100%',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getResultTypeColor()}`}>
                        {searchResult.type.charAt(0).toUpperCase() + searchResult.type.slice(1)}
                      </span>
                      <FiExternalLink className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1 truncate">
                      {searchResult.address || searchResult.tx_hash || searchResult.block_hash}
                    </p>
                    {searchResult.name && (
                      <p className="text-xs text-gray-500">{searchResult.name}</p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-b-lg">
                    <p className="text-xs text-gray-500">Click to view details</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;