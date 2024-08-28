import React from 'react';
import { FiClock, FiHash, FiUser, FiPackage } from 'react-icons/fi';

const BlockDetails = ({ block }) => {
  const truncate = (str, n) => {
    if (typeof str === 'string') {
      return str.length > n ? str.substr(0, n-1) + '...' : str;
    }
    return 'N/A';
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Block #{block.height || 'N/A'}</h2>
        <span className="text-sm text-gray-500">
          <FiClock className="inline mr-1" />
          {block.timestamp ? new Date(block.timestamp).toLocaleString() : 'N/A'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">
            <FiHash className="inline mr-1" />
            Hash: <span className="font-mono">{truncate(block.hash, 20)}</span>
          </p>
          <p className="text-sm text-gray-600">
            <FiUser className="inline mr-1" />
            Miner: <span className="font-mono">{truncate(block.miner, 20)}</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">
            <FiPackage className="inline mr-1" />
            Size: {block.size ? `${block.size} bytes` : 'N/A'}
          </p>
          <p className="text-sm text-gray-600">
            Transactions: {block.transactionsCount || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockDetails;