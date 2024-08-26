import React, { useState, useEffect } from "react";
import { FiClock, FiHash, FiUser, FiBox, FiChevronRight } from "react-icons/fi";
import Link from 'next/link';

const BlockTree = () => {
  const [blocks, setBlocks] = useState([]);

  const fetchBlocks = async () => {
    try {
      const response = await fetch("https://opencampus-codex.blockscout.com/api/v2/main-page/blocks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched blocks:", data); // Log the fetched data
      setBlocks(data || []);
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };

  useEffect(() => {
    fetchBlocks();
    const interval = setInterval(fetchBlocks, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const blockTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - blockTime) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec${diffInSeconds !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const BlockCard = ({ block, isLatest }) => (
    <div className={`bg-white rounded-xl shadow-lg p-4 ${isLatest ? 'border-l-8 border-blue-500' : 'border-l-8 border-gray-200'} w-80 transition-all duration-300 hover:shadow-xl hover:scale-102`}>
      <div className="flex justify-between items-center mb-3">
        <Link href={`/block/${block.height}`} passHref>
          <span className={`font-bold ${isLatest ? 'text-3xl text-blue-600' : 'text-2xl text-gray-700'}`}>#{block.height}</span>
        </Link>
        <span className="text-sm bg-gray-100 text-gray-600 py-1 px-2 rounded-full flex items-center">
          <FiClock className="mr-1" />
          {formatTimestamp(block.timestamp)}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center bg-gray-50 p-2 rounded">
          <FiUser className="mr-2 text-blue-500 text-lg" />
          <span className="text-sm font-medium truncate">{block.miner.ens_domain_name || block.miner.hash}</span>
        </div>
        <div className="flex items-center bg-gray-50 p-2 rounded">
          <FiHash className="mr-2 text-blue-500 text-lg" />
          <span className="text-sm font-medium truncate">{block.hash}</span>
        </div>
        <div className="flex items-center bg-gray-50 p-2 rounded">
          <FiBox className="mr-2 text-blue-500 text-lg" />
          <span className="text-sm font-medium">{block.tx_count} transactions</span>
        </div>
      </div>
    </div>
  );

  const getDisplayBlocks = () => {
    let displayBlocks = [...blocks];
    while (displayBlocks.length < 8) {
      displayBlocks = [...displayBlocks, ...blocks];
    }
    return displayBlocks.slice(0, 8);
  };

  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-auto">
      <div className="flex space-x-4 min-w-max">
        {getDisplayBlocks().map((block, index) => (
          <div key={`${block.hash}-${index}`} className="flex items-center">
            <BlockCard block={block} isLatest={index === 0} />
            {index < 7 && (
              <div className="w-6 flex items-center justify-center">
                <FiChevronRight className="text-2xl text-blue-500" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockTree;