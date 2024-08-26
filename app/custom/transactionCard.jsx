import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FiArrowRight, FiClock, FiFile } from "react-icons/fi";

const TransactionCard = ({ transaction }) => {
  const formattedTimestamp = formatDistanceToNow(new Date(transaction.timestamp), {
    addSuffix: true,
  });

  const shortenAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
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
    <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md max-w-md">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-medium text-gray-500 flex items-center">
          <FiClock className="mr-1" /> {formattedTimestamp}
        </span>
        <span className="text-xs font-medium text-green-500 bg-green-100 px-2 py-1 rounded-full">
          Success
        </span>
      </div>
      
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold mr-2 text-xs">
          TX
        </div>
        <div className="flex-grow flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-600">From</p>
            <p className="text-sm font-medium text-gray-800">
              {shortenAddress(transaction.from?.hash)}
            </p>
          </div>
          <FiArrowRight className="text-gray-400 mx-2" />
          <div>
            <p className="text-xs text-gray-600">To</p>
            <p className="text-sm font-medium text-gray-800">
              {shortenAddress(transaction.to?.hash)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs mb-3">
        <span className="text-gray-600">
          Block: <span className="font-medium text-gray-800">{transaction.block}</span>
        </span>
        <span className="text-gray-600">
          Fee: <span className="font-medium text-gray-800">{transaction.fee?.value || 'N/A'} wei</span>
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${getTxTypeColor(transaction.tx_types)}`}>
          <FiFile className="mr-1" /> {getTxTypeLabel(transaction.tx_types)}
        </span>
        <a href={`/transaction/${transaction.hash}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center">
          View Details <FiArrowRight className="ml-1" />
        </a>
      </div>
    </div>
  );
}

export default TransactionCard;