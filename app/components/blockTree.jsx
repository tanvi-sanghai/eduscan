import React, { useState, useEffect } from "react";
import { FiClock, FiHash, FiUser, FiBox, FiChevronRight } from "react-icons/fi";
import Link from 'next/link';

const BlockTree = () => {
  const [blocks, setBlocks] = useState([]);
  const [predictedBlocks, setPredictedBlocks] = useState([]);
  const [animatingBlock, setAnimatingBlock] = useState(null);

  const fetchBlocks = async () => {
    try {
      const response = await fetch("https://opencampus-codex.blockscout.com/api/v2/blocks?type=block", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const newBlocks = data.items || [];
      setBlocks(newBlocks);

      // Check if any predicted block has become an actual block
      predictedBlocks.forEach(predictedBlock => {
        const matchingBlock = newBlocks.find(block => block.height === predictedBlock.height);
        if (matchingBlock) {
          setAnimatingBlock(matchingBlock.height);
          setTimeout(() => setAnimatingBlock(null), 1000); // Reset after animation
        }
      });

      // Update predictions
      const latestHeight = newBlocks[0]?.height || 0;
      setPredictedBlocks([
        { height: latestHeight + 2 },
        { height: latestHeight + 1 },
      ]);
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
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const BlockCard = ({ block, isPredicted, isAnimating }) => (
    <div className={`w-48 h-48 rounded-lg shadow-md border-2 
                    transform transition-all duration-300 ease-in-out
                    flex flex-col justify-between p-4 relative overflow-hidden
                    ${isPredicted ? 'bg-indigo-100 border-indigo-300' : 'bg-white border-gray-200'}
                    ${isAnimating ? 'animate-pulse' : ''}
                    ${isAnimating ? 'translate-x-[100px]' : ''}`}>
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className={`font-bold text-lg ${isPredicted ? 'text-indigo-600' : 'text-gray-700'}`}>
            <Link href={`/block/${block.height}`}>
            #{block.height}
            </Link>
          </span>
          {!isPredicted && (
            <span className="text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded-full flex items-center">
              <FiClock className="mr-1" />
              {formatTimestamp(block.timestamp)}
            </span>
          )}
        </div>
        {isPredicted ? (
          <div className="text-sm text-indigo-600 font-medium">
            Incoming
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="flex items-center bg-gray-50 p-1 rounded">
              <FiUser className="mr-1 text-blue-500" />
              <span className="font-medium truncate">{block.miner.ens_domain_name || block.miner.hash.slice(0, 10) + '...'}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-1 rounded">
              <FiHash className="mr-1 text-blue-500" />
              <span className="font-medium truncate">{block.hash.slice(0, 10) + '...'}</span>
            </div>
          </div>
        )}
      </div>
      {!isPredicted && (
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded mt-2">
          <FiBox className="text-blue-500" />
          <span className="font-medium text-sm">{block.tx_count} transactions</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-8 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-auto">
      <div className="flex space-x-6 min-w-max items-end relative">
        {predictedBlocks.map((block) => (
          <BlockCard key={block.height} block={block} isPredicted={true} isAnimating={animatingBlock === block.height} />
        ))}
        <div className="mx-4 h-48 border-l-2 border-dashed border-gray-300"></div>
        {blocks.slice(0, 50).map((block, index) => (
          <div key={block.hash} className="flex items-center">
            <BlockCard block={block} isAnimating={animatingBlock === block.height} />
            {index < 50 && (
              <div className="w-6 flex items-center ml-4 justify-center">
                <FiChevronRight className="text-4xl text-blue-500" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockTree;