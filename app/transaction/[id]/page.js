'use client'
import React, { useState, useEffect } from "react";
import { FiClock, FiCheck, FiX, FiArrowRight, FiUser, FiBox, FiFileText, FiDollarSign, FiCpu, FiHash, FiExternalLink, FiLayers, FiCode } from "react-icons/fi";
import LoadingSpinner from "@/app/components/loadingSpinner";
import Link from "next/link";

export default function TransactionPage({ params }) {
  const { id } = params;
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`https://opencampus-codex.blockscout.com/api/v2/transactions/${id}`);
        if (!response.ok) throw new Error('Failed to fetch transaction');
        const data = await response.json();
        setTransaction(data);
      } catch (error) {
        console.error('Error fetching transaction:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!transaction) return <ErrorMessage message="Transaction not found" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12  min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Transaction Details</h1>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <TransactionHeader transaction={transaction} />
        <div className="p-6 space-y-8">
          <TransactionInfo transaction={transaction} />
          <AddressesInfo transaction={transaction} />
          <FeeDetails transaction={transaction} />
        </div>
      </div>
    </div>
  );
}

const TransactionHeader = ({ transaction }) => (
  <div className="bg-blue-500 text-white p-6">
    <div className="flex justify-between items-center mb-4">
      <StatusBadge status={transaction.status} />
      <span className="text-sm flex items-center">
        <FiClock className="mr-2" />
        {new Date(transaction.timestamp).toLocaleString()}
      </span>
    </div>
    <div className="flex items-center space-x-2">
      <FiHash className="text-blue-200" />
      <p className="text-sm break-all">{transaction.hash}</p>
      
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
    status === 'ok' ? 'bg-green-400 text-white' : 'bg-red-400 text-white'
  }`}>
    {status === 'ok' ? <FiCheck className="mr-1" /> : <FiX className="mr-1" />}
    {status === 'ok' ? 'Success' : 'Failed'}
  </span>
);

const TransactionInfo = ({ transaction }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Transaction Info</h2>
    <div className="grid grid-cols-2 gap-4">
      <InfoItem icon={FiBox} label="Block" value={transaction.block} />
      <InfoItem icon={FiFileText} label="Type" value={transaction.tx_types.join(', ')} />
      <InfoItem icon={FiDollarSign} label="Value" value={`${transaction.value} WEI`} />
      <InfoItem icon={FiCpu} label="Gas Used" value={transaction.gas_used} />
      <InfoItem icon={FiLayers} label="Confirmations" value={transaction.confirmations} />
      {transaction.method && (
        <InfoItem icon={FiCode} label="Method" value={transaction.method} />
      )}
    </div>
  </div>
);

const AddressesInfo = ({ transaction }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Addresses</h2>
    <div className="space-y-4">
     <AddressItem label="From" address={transaction.from} />
      <AddressItem label="To" address={transaction.to || transaction.created_contract} />
    </div>
  </div>
);

const FeeDetails = ({ transaction }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Fee Details</h2>
    <div className="grid grid-cols-2 gap-4">
      <InfoItem icon={FiDollarSign} label="Fee" value={`${transaction.fee.value} wei`} />
      <InfoItem icon={FiDollarSign} label="Gas Price" value={`${transaction.gas_price} wei`} />
      <InfoItem icon={FiDollarSign} label="Max Fee Per Gas" value={`${transaction.max_fee_per_gas} wei`} />
      <InfoItem icon={FiDollarSign} label="Priority Fee" value={`${transaction.priority_fee} wei`} />
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center">
    <Icon className="text-blue-500 mr-2" />
    <div>
      <span className="text-xs text-gray-500">{label}</span>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

const AddressItem = ({ label, address }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <div className="flex items-center bg-gray-100 p-3 rounded">
      <FiUser className="text-blue-500 mr-2" />
      <span className="text-sm font-medium text-blue-700 break-all">
        <Link href={`/account/${address ? (address.hash || 'N/A') : 'N/A'}`}>
        {address ? (address.hash || 'N/A') : 'N/A'}
        </Link>
      </span>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-center mt-20 text-red-600 text-xl">{message}</div>
);