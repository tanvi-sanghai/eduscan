import React, { useState, useEffect, useRef } from "react";
import { FiClock, FiHash, FiUser, FiBox, FiChevronRight, FiArrowRight } from "react-icons/fi";
import Link from 'next/link';

const BlockTree = () => {
  const [blocks, setBlocks] = useState([]);
  const [predictedBlocks, setPredictedBlocks] = useState([]);
  const [animatingBlock, setAnimatingBlock] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const containerRef = useRef(null);

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

      // Check if any predicted block has become an actual block
      predictedBlocks.forEach(predictedBlock => {
        const matchingBlock = newBlocks.find(block => block.height === predictedBlock.height);
        if (matchingBlock) {
          setAnimatingBlock(matchingBlock);
          setTimeout(() => {
            setAnimationComplete(true);
            setTimeout(() => {
              setAnimatingBlock(null);
              setAnimationComplete(false);
              setBlocks(newBlocks);
            }, 500);
          }, 1000);
        }
      });

      if (!animatingBlock) {
        setBlocks(newBlocks);
      }

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
    const interval = setInterval(fetchBlocks, 5000); // Fetch every 5 seconds
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

  const BlockCard = ({ block, isPredicted, isAnimating, isLatest }) => (
    <div className="relative pt-6"> {/* Added pt-6 for space above the square */}
      {isLatest && !isPredicted && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white text-xs font-bold py-1 px-3 rounded-t-lg z-10">
          Latest Block
        </div>
      )}
      <div className={`w-48 h-48 rounded-lg shadow-md border-2 mx-4
                      transition-all duration-1000 ease-in-out
                      flex flex-col justify-center items-center p-4 relative overflow-hidden
                      ${isPredicted ? 'bg-blue-800 border-blue-600 text-white' : 'bg-white border-gray-200'}
                      ${isLatest && !isPredicted ? 'border-blue-800 border-4 rounded-t-none' : ''}
                      ${isAnimating ? 'transform translate-x-[calc(100%+2rem)]' : ''}`}>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        {isPredicted ? (
          <div className="text-center">
            <span className="font-bold text-2xl mb-2 block">#{block.height}</span>
            <div className="text-lg font-medium">
              Incoming
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-2 w-full">
              <span className="font-bold text-lg text-blue-600">
                <Link href={`/block/${block.height}`}>
                  #{block.height}
                </Link>
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded-full flex items-center">
                <FiClock className="mr-1" />
                {formatTimestamp(block.timestamp)}
              </span>
            </div>
            <div className="space-y-2 text-xs w-full">
              <div className="flex items-center bg-gray-50 p-1 rounded">
                <FiUser className="mr-1 text-blue-500" />
                <span className="font-medium truncate">{block.miner?.ens_domain_name || block.miner?.hash.slice(0, 10) + '...'}</span>
              </div>
              <div className="flex items-center bg-gray-50 p-1 rounded">
                <FiHash className="mr-1 text-blue-500" />
                <span className="font-medium truncate">{block.hash?.slice(0, 10) + '...'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded mt-2 w-full">
              <FiBox className="text-blue-500" />
              <span className="font-medium text-sm">{block.tx_count} transactions</span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative p-8 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden" ref={containerRef}>
      <div className="absolute top-4 right-8 z-10">
        <Link href="/block" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 font-medium">
          View All Blocks
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <div className="flex items-center min-w-max">
          {predictedBlocks.map((block, index) => (
            <React.Fragment key={block.height}>
              <BlockCard 
                block={block} 
                isPredicted={true} 
                isAnimating={animatingBlock?.height === block.height && !animationComplete} 
                isLatest={false}
              />
            </React.Fragment>
          ))}
          <div className="mx-4 h-48 border-l-4 border-dashed border-blue-500 shadow-lg"></div>
          {blocks.map((block, index) => (
            <React.Fragment key={block.hash}>
              <BlockCard 
                block={block} 
                isAnimating={animatingBlock?.height === block.height && animationComplete} 
                isLatest={index === 0}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockTree;