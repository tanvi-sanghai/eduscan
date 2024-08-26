'use client'
import { useEffect, useState } from 'react';
import { FiClock, FiHash, FiUser, FiBox, FiCpu, FiDollarSign, FiLayers, FiServer } from 'react-icons/fi';

export default function BlockPage({ params }) {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const response = await fetch(`https://opencampus-codex.blockscout.com/api/v2/blocks/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch block');
        const data = await response.json();
        setBlock(data);
      } catch (error) {
        console.error('Error fetching block:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlock();
  }, [params.id]);

  if (loading) return <LoadingSpinner />;
  if (!block) return <ErrorMessage message="Block not found" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Block #{block.height}</h1>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm flex items-center">
              <FiClock className="mr-2" />
              {new Date(block.timestamp).toLocaleString()}
            </span>
            <span className="text-sm font-medium bg-blue-400 px-3 py-1 rounded-full">
              {block.tx_count} Transactions
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FiHash className="text-blue-200" />
            <p className="text-sm break-all">{block.hash}</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <Section title="Block Info">
            <InfoGrid>
              <InfoItem icon={FiLayers} label="Height" value={block.height} />
              <InfoItem icon={FiServer} label="Size" value={`${block.size} bytes`} />
              <InfoItem icon={FiHash} label="Parent Hash" value={block.parent_hash.slice(0, 10) + '...'} />
              <InfoItem icon={FiUser} label="Miner" value={block.miner.hash.slice(0, 10) + '...'} />
            </InfoGrid>
          </Section>

          <Section title="Gas & Fees">
            <InfoGrid>
              <InfoItem icon={FiCpu} label="Gas Used" value={block.gas_used} />
              <InfoItem icon={FiCpu} label="Gas Limit" value={block.gas_limit} />
              <InfoItem icon={FiDollarSign} label="Base Fee" value={`${block.base_fee_per_gas} wei`} />
              <InfoItem icon={FiDollarSign} label="Burnt Fees" value={`${block.burnt_fees} wei`} />
            </InfoGrid>
          </Section>

          <Section title="Additional Info">
            <InfoGrid>
              <InfoItem icon={FiBox} label="Difficulty" value={block.difficulty} />
              <InfoItem icon={FiBox} label="Total Difficulty" value={block.total_difficulty} />
              <InfoItem icon={FiHash} label="Nonce" value={block.nonce} />
              <InfoItem icon={FiLayers} label="Type" value={block.type} />
            </InfoGrid>
          </Section>
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
    {children}
  </div>
);

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {children}
  </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
    <Icon className="text-blue-500 mr-3" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
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