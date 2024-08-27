import React from 'react';
import { FiArrowRight, FiClock, FiFile, FiUser, FiBox, FiCheckCircle, FiHash } from "react-icons/fi";
import Link from 'next/link';

const TokenTransfersTab = ({ transfers, currentAddress }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Token Transfers</h2>
    {transfers.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transfers.map((transfer, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img 
                    className="h-10 w-10 rounded-full mr-3" 
                    src={`https://via.placeholder.com/40/4F46E5/FFFFFF?text=${transfer.token.symbol[0]}`} 
                    alt={transfer.token.symbol} 
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{transfer.token.symbol}</h3>
                    <p className="text-sm text-gray-500">{transfer.token.name}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transfer.token.type)}`}>
                    {transfer.token.type}
                  </span>
                  <span className={`mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    transfer.from.hash.toLowerCase() === currentAddress.toLowerCase() ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {transfer.from.hash.toLowerCase() === currentAddress.toLowerCase() ? 'Sent' : 'Received'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm">
                  <p className="text-gray-500">From</p>
                  <p className="font-medium text-gray-800">{shortenAddress(transfer.from.hash)}</p>
                </div>
                <FiArrowRight className="text-gray-400" />
                <div className="text-sm text-right">
                  <p className="text-gray-500">To</p>
                  <p className="font-medium text-gray-800">{shortenAddress(transfer.to.hash)}</p>
                </div>
              </div>
              <div className="flex justify-between items-end mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <FiHash className="mr-2" />
                  <Link href={`/transaction/${transfer.tx_hash}`} passHref>
                  <p className="font-medium text-blue-500">{shortenHash(transfer.tx_hash)}</p>
                  </Link>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formatTokenAmount(transfer.total.value, transfer.token.decimals)} {transfer.token.symbol}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="mr-2" />
                <p>{formatTimeAgo(transfer.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <FiBox className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No token transfers</h3>
        <p className="mt-1 text-sm text-gray-500">There are no token transfers available for this account.</p>
      </div>
    )}
  </div>
);

const getTypeColor = (type) => {
  switch (type) {
    case 'ERC-20':
      return 'bg-blue-100 text-blue-800';
    case 'ERC-721':
      return 'bg-green-100 text-green-800';
    case 'ERC-1155':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const shortenHash = (hash) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const formatTokenAmount = (value, decimals) => {
  const amount = parseFloat(value) / Math.pow(10, decimals);
  return amount.toLocaleString(undefined, { maximumFractionDigits: 6 });
};

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const transferDate = new Date(timestamp);
  const secondsPast = (now.getTime() - transferDate.getTime()) / 1000;

  if (secondsPast < 60) {
    return `${Math.round(secondsPast)}s ago`;
  }
  if (secondsPast < 3600) {
    return `${Math.round(secondsPast / 60)}m ago`;
  }
  if (secondsPast <= 86400) {
    return `${Math.round(secondsPast / 3600)}h ago`;
  }
  if (secondsPast > 86400) {
    const daysPast = Math.round(secondsPast / 86400);
    return daysPast === 1 ? `${daysPast} day ago` : `${daysPast} days ago`;
  }
};

export default TokenTransfersTab;