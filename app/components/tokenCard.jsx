import { FiUser, FiDollarSign, FiHash, FiCheckCircle, FiXCircle, FiClock, FiBox, FiTag } from 'react-icons/fi';

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

export default TokenCard;