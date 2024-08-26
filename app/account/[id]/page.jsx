'use client'
import { useEffect, useState } from 'react';
import { FiUser, FiDollarSign, FiHash, FiCheckCircle, FiXCircle, FiClock, FiBox, FiTag } from 'react-icons/fi';
import TransactionCard from '@/app/components/transactionCard';

export default function AccountPage({ params }) {
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchAccount = async () => {
          try {
            const response = await fetch(`https://opencampus-codex.blockscout.com/api/v2/addresses/${params.id}`);
            if (!response.ok) throw new Error('Failed to fetch account');
            const data = await response.json();
            setAccount(data);
          } catch (error) {
            console.error('Error fetching account:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchAccount();
      }, [params.id]);
    
      useEffect(() => {
        const fetchTransactions = async () => {
          if (activeTab === 'transactions') {
            try {
              const response = await fetch(`https://opencampus-codex.blockscout.com/api/v2/addresses/${params.id}/transactions?filter=to%20%7C%20from`);
              if (!response.ok) throw new Error('Failed to fetch transactions');
              const data = await response.json();
              setTransactions(data.items || []);
            } catch (error) {
              console.error('Error fetching transactions:', error);
            }
          }
        };
    
        fetchTransactions();
      }, [params.id, activeTab]);
    
      useEffect(() => {
        const fetchTokens = async () => {
          if (activeTab === 'tokens') {
            try {
              const response = await fetch(`https://opencampus-codex.blockscout.com/api/v2/addresses/${params.id}/tokens?type=ERC-20%2CERC-721%2CERC-1155`);
              if (!response.ok) throw new Error('Failed to fetch tokens');
              const data = await response.json();
              setTokens(data.items || []);
            } catch (error) {
              console.error('Error fetching tokens:', error);
            }
          }
        };
    
        fetchTokens();
      }, [params.id, activeTab]);
    
      if (loading) return <LoadingSpinner />;
      if (!account) return <ErrorMessage message="Account not found" />;
    
      const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'tokens', label: 'Tokens' },
        { id: 'tokenTransfers', label: 'Token Transfers' },
        { id: 'coinBalanceHistory', label: 'Coin Balance History' },
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
          <InfoItem
            icon={FiDollarSign}
            label="Balance"
            value={`${parseFloat(account.coin_balance) / 1e18} ETH`}
          />
          <InfoItem
            icon={FiUser}
            label="Account Type"
            value={account.is_contract ? 'Contract' : 'EOA'}
          />
          <InfoItem
            icon={account.is_verified ? FiCheckCircle : FiXCircle}
            label="Verified"
            value={account.is_verified ? 'Yes' : 'No'}
          />
          <InfoItem
            icon={FiClock}
            label="Last Balance Update"
            value={`Block #${account.block_number_balance_updated_at}`}
          />
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
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab account={account} />}
          {activeTab === 'transactions' && <TransactionsTab transactions={transactions} />}
          {activeTab === 'tokens' && <TokensTab tokens={tokens} />}
          {activeTab === 'tokenTransfers' && <p>Token transfers data will be shown here.</p>}
          {activeTab === 'coinBalanceHistory' && <p>Coin balance history will be shown here.</p>}
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

const OverviewTab = ({ account }) => (
  <div className="space-y-4">
    <p className="text-gray-700">
      This account {account.has_token_transfers ? 'has' : 'does not have'} token transfers.
    </p>
    <p className="text-gray-700">
      This account {account.has_tokens ? 'holds' : 'does not hold'} tokens.
    </p>
    {account.ens_domain_name && (
      <p className="text-gray-700">ENS Domain: {account.ens_domain_name}</p>
    )}
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
      <p className="text-center text-gray-500 bg-white p-4 rounded-lg shadow-md">No transactions available.</p>
    )}
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
          <TokenCard key={index} token={tokenItem.token} value={tokenItem.value} />
        ))
      ) : (
        <p className="text-center text-gray-500 bg-white p-4 rounded-lg shadow-md">No tokens available.</p>
      )}
    </div>
  );
  
  const TokenCard = ({ token, value }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FiBox className="text-blue-500 mr-2" />
          <span className="font-semibold text-lg">{token.name} ({token.symbol})</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          token.type === 'ERC-20' ? 'bg-green-100 text-green-800' :
          token.type === 'ERC-721' ? 'bg-purple-100 text-purple-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {token.type}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Balance</p>
          <p className="font-medium">{parseFloat(value) / Math.pow(10, parseInt(token.decimals))} {token.symbol}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Supply</p>
          <p className="font-medium">{parseFloat(token.total_supply) / Math.pow(10, parseInt(token.decimals))}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Holders</p>
          <p className="font-medium">{token.holders}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Contract Address</p>
          <p className="font-medium text-sm truncate">{token.address}</p>
        </div>
      </div>
    </div>
  );
  