import React, { useState, useEffect } from "react";
import { FiClock, FiHash, FiUser, FiBox, FiChevronUp } from "react-icons/fi";
import Link from 'next/link'; // Import Link from Next.js

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
    <div className={`bg-white rounded-xl shadow-lg p-6  ${isLatest ? 'border-l-8 border-blue-500' : 'border-l-8 border-gray-200'} w-full max-w-5xl mx-auto transition-all duration-300 hover:shadow-xl hover:scale-102`}>
      <div className="flex justify-between items-center mb-4 gap-4">
      <Link href={`/block/${block.height}`} passHref>
        <span className={`font-bold ${isLatest ? 'text-4xl text-blue-600' : 'text-3xl text-gray-700'}`}>#{block.height}</span>
      </Link>
        <span className="text-sm bg-gray-100 text-gray-600 py-1 px-3 rounded-full flex items-center">
          <FiClock className="mr-2" />
          {formatTimestamp(block.timestamp)}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center bg-gray-50 p-3 rounded">
          <FiUser className="mr-3 text-blue-500 text-xl" />
          <span className="text-sm font-medium truncate">{block.miner.ens_domain_name || block.miner.hash}</span>
        </div>
        <div className="flex items-center bg-gray-50 p-3 rounded">
          <FiHash className="mr-3 text-blue-500 text-xl" />
          <span className="text-sm font-medium truncate">{block.hash}</span>
        </div>
        <div className="flex items-center bg-gray-50 p-3 rounded">
          <FiBox className="mr-3 text-blue-500 text-xl" />
          <span className="text-sm font-medium">{block.tx_count} transactions</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
   <div className="space-y-2">
        {blocks.slice(0, 4).map((block, index) => (
          <div key={block.hash} className="flex flex-col items-center">
            <BlockCard block={block} isLatest={index === 0} />
            {index < 3 && (
              <div className="h-10 flex items-center justify-center mt-2">
                <FiChevronUp className="text-3xl text-blue-500" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockTree;