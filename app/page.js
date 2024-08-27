'use client'
import { useEffect, useState } from "react";
import TransactionCard from "@/app/components/transactionCard";
import BlockTree from "./components/blockTree";
import StatsBox from "./components/statsBox";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("https://opencampus-codex.blockscout.com/api/v2/main-page/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }

      const data = await response.json();
      console.log(data);
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }


  useEffect(() => {
    fetchTransactions();
    
    const interval = setInterval(() => {
      fetchTransactions();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="max-w-7xl mx-auto mb-12">
           <BlockTree />
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <StatsBox/ >

          <section className="md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Latest Transactions</h2>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <TransactionCard key={index} transaction={transaction} />
                ))
              ) : (
                <p className="text-center text-gray-500 bg-white p-4 rounded-lg shadow-md">No transactions available.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}