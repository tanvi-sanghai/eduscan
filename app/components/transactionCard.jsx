import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FiArrowRight, FiClock, FiFile, FiUser, FiBox, FiCheckCircle, FiHash } from "react-icons/fi";
import Link from 'next/link';

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
    <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTxTypeColor(transaction.tx_types)}`}>
            <FiFile className="inline mr-1" /> {getTxTypeLabel(transaction.tx_types)}
          </span>
          <span className="text-xs font-medium text-green-500 bg-green-100 px-2 py-1 rounded-full">
            <FiCheckCircle className="inline mr-1" /> Success
          </span>
        </div>
        <span className="text-xs text-gray-500">
          <FiClock className="inline mr-1" /> {formattedTimestamp}
        </span>
      </div>

      <div className="flex items-center justify-between mb-2 text-sm">
        <div className="flex items-center">
          <FiUser className="text-blue-500 mr-1" />
          <Link href={`/account/${transaction.from?.hash}`}>
            <span className="text-blue-600 hover:text-blue-800 hover:underline">{shortenAddress(transaction.from?.hash)}</span>
          </Link>
        </div>
        <FiArrowRight className="text-gray-400 mx-2" />
        <div className="flex items-center">
          <FiUser className="text-blue-500 mr-1" />
          <Link href={`/account/${transaction.to?.hash}`}>
            <span className="text-blue-600 hover:text-blue-800 hover:underline">{shortenAddress(transaction.to?.hash)}</span>
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">
            <FiBox className="inline text-blue-500 mr-1" />
            Block: 
            <Link href={`/block/${transaction.block}`}>
              <span className="font-medium text-blue-600 hover:text-blue-800 hover:underline ml-1">{transaction.block}</span>
            </Link>
          </span>
          <span className="text-gray-600">
            Fee: <span className="font-medium text-gray-800">{transaction.fee?.value || 'N/A'} wei</span>
          </span>
        </div>
        <Link href={`/transaction/${transaction.hash}`}>
          <span className="text-blue-600 hover:text-blue-800 hover:underline flex items-center">
            <FiHash className="mr-1" />
            {shortenHash(transaction.hash)}
            <FiArrowRight className="ml-1" />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default TransactionCard;