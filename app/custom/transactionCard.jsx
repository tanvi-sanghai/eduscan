import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FiArrowRight, FiClock, FiFile, FiUser, FiBox, FiCheckCircle, FiHash } from "react-icons/fi";
import Link from 'next/link'; // Import Link from Next.js

const TransactionCard = ({ transaction }) => {
  const formattedTimestamp = formatDistanceToNow(new Date(transaction.timestamp), {
    addSuffix: true,
  });

  const shortenAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const shortenHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
  };

  const getTxTypeLabel = (txTypes) => {
    if (!txTypes || txTypes.length === 0) return 'Unknown';
    return txTypes[0].split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getTxTypeColor = (txTypes) => {
    if (!txTypes || txTypes.length === 0) return 'bg-gray-100 text-gray-800';
    switch (txTypes[0]) {
      case 'contract_call':
        return 'bg-purple-100 text-purple-800';
      case 'transfer':
        return 'bg-blue-100 text-blue-800';
      case 'deploy_contract':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-4 border border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <span className={`text-sm font-medium px-3 py-1 rounded-full flex items-center ${getTxTypeColor(transaction.tx_types)}`}>
          <FiFile className="mr-2" /> {getTxTypeLabel(transaction.tx_types)}
        </span>
        <span className="text-sm font-medium text-green-500 bg-green-100 px-3 py-1 rounded-full flex items-center">
          <FiCheckCircle className="mr-2" /> Success
        </span>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="flex-grow flex justify-between items-center">
          <div className="w-5/12">
            <p className="text-sm text-gray-600 mb-1">From</p>
            <p className="text-base font-medium text-gray-800 flex items-center">
              <FiUser className="mr-2 text-blue-500" />
              {shortenAddress(transaction.from?.hash)}
            </p>
          </div>
          <FiArrowRight className="text-gray-400 text-xl" />
          <div className="w-5/12 text-right">
            <p className="text-sm text-gray-600 mb-1">To</p>
            <p className="text-base font-medium text-gray-800 flex items-center justify-end">
              <FiUser className="mr-2 text-blue-500" />
              {shortenAddress(transaction.to?.hash)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm mb-4">
        <span className="text-gray-600 flex items-center">
          <FiBox className="mr-2 text-blue-500" />
          Block: <span className="font-medium text-gray-800 ml-1">{transaction.block}</span>
        </span>
        <span className="text-gray-600">
          Fee: <span className="font-medium text-gray-800">{transaction.fee?.value || 'N/A'} wei</span>
        </span>
      </div>
      
      <div className="flex items-center mb-4">
        <FiHash className="text-blue-500 mr-2" />
        <span className="text-sm font-medium text-gray-800">{shortenHash(transaction.hash)}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500 flex items-center">
          <FiClock className="mr-2" /> {formattedTimestamp}
        </span>
        <Link href={`/transaction/${transaction.hash}`} passHref>
          <div className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center bg-blue-50 px-3 py-2 rounded-full transition-colors duration-300 hover:bg-blue-100">
            View Details <FiArrowRight className="ml-2" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default TransactionCard;