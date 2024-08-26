'use client'
import { useEffect, useState } from "react";
import TransactionCard from "@/app/components/transactionCard";

export default function Home() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("https://opencampus-codex.blockscout.com/api/v2/main-page/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
    </div>
  );
}
