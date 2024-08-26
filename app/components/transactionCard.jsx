import React from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const TransactionCard = ({ transaction }) => {
  // Format timestamp for a more readable display
  const formattedTimestamp = formatDistanceToNow(new Date(transaction.timestamp), {
    addSuffix: true,
  });

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Transaction Details</h2>
      <div className="mb-4">
        <p className="text-gray-700 mb-2"><strong>Hash:</strong> {transaction.hash}</p>
        <p className="text-gray-700 mb-2"><strong>From:</strong> {transaction.from?.hash || 'N/A'}</p>
        <p className="text-gray-700 mb-2"><strong>To:</strong> {transaction.to?.hash || 'N/A'}</p>
        <p className="text-gray-700 mb-2"><strong>Block:</strong> {transaction.block}</p>
        <p className="text-gray-700 mb-2"><strong>Fee:</strong> {transaction.fee?.value || 'N/A'} wei</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-700">
          <strong>Timestamp:</strong>
        </span>
        <span className="text-gray-500">{formattedTimestamp}</span>
      </div>
     
        <a className="text-blue-600 hover:underline mt-4 block">View Full Details</a>
    
    </div>
  );
}

export default TransactionCard;
