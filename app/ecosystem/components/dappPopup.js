"use client";
import Image from "next/image";
import { ExternalLink, X } from "lucide-react";
import sampleimage from "@/app/assets/sample.png";


const DAppPopup = ({ dapp, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{dapp["Project name"]}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <Image
            src={sampleimage}
            alt={`${dapp["Project name"]} logo`}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <p className="text-gray-600 mb-4">{dapp["Project description"]}</p>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Category</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {dapp["Project category tag"]}
          </span>
        </div>
        {dapp["Project Description"] && dapp["Project Description"] !== "#N/A" && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Detailed Description</h3>
            <p className="text-gray-600">{dapp["Project Description"]}</p>
          </div>
        )}
        {dapp["dApp URL"] && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">dApp URL</h3>
            <a href={dapp["dApp URL"]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
              {dapp["dApp URL"]} <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        )}
        {dapp["X link"] && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">X (Twitter) Link</h3>
            <a href={dapp["X link"]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
              {dapp["X link"]} <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        )}
        {dapp["Testnet Contract Address"] && dapp["Testnet Contract Address"] !== "#N/A" && (
          <div>
            <h3 className="font-semibold mb-2">Testnet Contract Address</h3>
            <p className="text-gray-600 break-all">{dapp["Testnet Contract Address"]}</p>
          </div>
        )}
      </div>
    </div>
  );
  
export default DAppPopup;