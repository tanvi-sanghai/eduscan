"use client";

import React, { useEffect, useState } from "react";
import TransactionCard from "@/app/components/TransactionCard";
import BlockCard from "@/app/components/BlockCard";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("https://opencampus-codex.blockscout.com/api/v2/main-page/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) { throw new Error(HTTP error! Status: ${response.status}); }

      const data = await response.json();
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error.message);
    }
  }

  const fetchBlocks = async () => {
    try {
      const response = await fetch("https://opencampus-codex.blockscout.com/api/v2/main-page/blocks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) { throw new Error(HTTP error! Status: ${response.status}); }

      const data = await response.json();
      console.log("Blocks data:", data);  // Add this line to debug
      setBlocks(data || []);
    } catch (error) {
      console.error("Error fetching blocks:", error);
      setError(error.message);
    }
  }

  useEffect(() => {
    fetchTransactions();
    fetchBlocks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {error && <p className="text-red-500 text-center">Error: {error}</p>}

      <h1 className="text-3xl font-bold text-center mb-8">Latest Transactions</h1>
      <div className="max-w-4xl mx-auto">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <TransactionCard key={index} transaction={transaction} />
          ))
        ) : (
          <p className="text-center text-gray-500">No transactions available.</p>
        )}
      </div>

      <h1 className="text-3xl font-bold text-center mb-8 mt-12">Latest Blocks</h1>
      <div className="max-w-4xl mx-auto">
        {blocks.length > 0 ? (
          blocks.map((block, index) => (
            <BlockCard key={index} block={block} />
          ))
        ) : (
          <p className="text-center text-gray-500">No blocks available.</p>
        )}
      </div>
    </div>
  );
}