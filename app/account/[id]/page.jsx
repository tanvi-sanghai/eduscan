"use client";

import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiDollarSign,
  FiHash,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBox,
  FiTag,
} from "react-icons/fi";
import LoadingSpinner from "@/app/components/loadingSpinner";
import TransactionCard from "@/app/components/transactionCard";
import TokenCard from "@/app/components/tokenCard";
import TokenTransfersTab from "@/app/components/tokenTransferTab";

const API_BASE_URL = "https://opencampus-codex.blockscout.com/api/v2";

export default function AccountPage({ params }) {
  const [accountData, setAccountData] = useState({
    account: null,
    transactions: [],
    tokens: [],
    tokenTransfers: [],
    
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("transactions");

  useEffect(() => {
    const fetchAllData = async () => {
      const endpoints = {
        account: `/addresses/${params.id}`,
        transactions: `/addresses/${params.id}/transactions?filter=to%20%7C%20from`,
        tokens: `/addresses/${params.id}/tokens?type=ERC-20%2CERC-721%2CERC-1155`,
        tokenTransfers: `/addresses/${params.id}/token-transfers?type=ERC-20%2CERC-721%2CERC-1155&filter=to%20%7C%20from`,
        internalTransactions: `/addresses/${params.id}/internal-transactions`,
        coinBalanceHistory: `/addresses/${params.id}/coin-balance-history`
      };

      try {
        const results = await Promise.all(
          Object.entries(endpoints).map(async ([key, endpoint]) => {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) throw new Error(`Failed to fetch ${key}`);
            const data = await response.json();
            return [key, key === 'account' ? data : data.items || []];
          })
        );

        setAccountData(Object.fromEntries(results));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [params.id]);

  if (loading) return <LoadingSpinner />;
  if (!accountData.account) return <ErrorMessage message="Account not found" />;

  const { account } = accountData;

  const tabs = [
    { id: "transactions", label: "Transactions" },
    { id: "tokens", label: "Tokens" },
    { id: "tokenTransfers", label: "Token Transfers" },
  ];

  const accountInfo = [
    {
      icon: FiDollarSign,
      label: "Balance",
      value: `${parseFloat(account.coin_balance) / 1e18} ETH`,
    },
    {
      icon: FiUser,
      label: "Account Type",
      value: account.is_contract ? "Contract" : "EOA",
    },
    {
      icon: account.is_verified ? FiCheckCircle : FiXCircle,
      label: "Verified",
      value: account.is_verified ? "Yes" : "No",
    },
    {
      icon: FiClock,
      label: "Last Balance Update",
      value: `Block #${account.block_number_balance_updated_at}`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
        <div className="bg-blue-500 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">Account Details</h1>
          <div className="flex items-center space-x-2">
            <FiHash className="text-blue-200" />
            <p className="text-sm break-all">{account.hash}</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {accountInfo.map((item, index) => (
            <InfoItem key={index} {...item} />
          ))}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "transactions" && (
            <TransactionsTab transactions={accountData.transactions} />
          )}
          {activeTab === "tokens" && <TokensTab tokens={accountData.tokens} />}
          {activeTab === "tokenTransfers" && (
            console.log(accountData.tokenTransfers),
            <TokenTransfersTab transfers={accountData.tokenTransfers} currentAddress={params.id} />
          )}
          
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center bg-gray-50 p-4 rounded-lg">
    <Icon className="text-blue-500 mr-3 text-xl" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

const TransactionsTab = ({ transactions }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Transactions</h2>
    {transactions.length > 0 ? (
      transactions.map((transaction, index) => (
        <TransactionCard key={index} transaction={transaction} />
      ))
    ) : (
      <p className="text-center text-gray-500 bg-white p-4 rounded-lg shadow-md">
        No transactions available.
      </p>
    )}
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-center mt-20 text-red-600 text-xl">{message}</div>
);

const TokensTab = ({ tokens }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Tokens</h2>
    {tokens.length > 0 ? (
      tokens.map((tokenItem, index) => (
        <TokenCard
          key={index}
          token={tokenItem.token}
          value={tokenItem.value}
        />
      ))
    ) : (
      <p className="text-center text-gray-500 bg-white p-4 rounded-lg shadow-md">
        No tokens available.
      </p>
    )}
  </div>
);

