"use client";
import { useState } from "react";
import data from "@/app/dapps.json";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import illustration from "@/app/assets/dApp3.png";
import sampleimage from "@/app/assets/sample.png";

const Hero = () => (
  <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex flex-col md:flex-row items-center justify-between">
    <div className="md:w-1/2 lg:w-5/12 mb-8 md:mb-0 text-center md:text-left">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
        <span className="text-gray-900">dApp</span>{" "}
        <span className="text-blue-600">Ecosystem</span>
      </h1>
      <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto md:mx-0">
        Explore a decentralized network of dApps, institutions, and innovators
        driving the future of global education on EDU Chain.
      </p>
      <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
        <button className="bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-blue-700 transition duration-300 text-base sm:text-lg font-semibold">
          Apply to be listed
        </button>
        <button className="border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-blue-50 transition duration-300 text-base sm:text-lg font-semibold">
          Learn more
        </button>
      </div>
    </div>
    <div className="md:w-1/2 lg:w-7/12 flex justify-center">
      <Image
        src={illustration}
        alt="dApp Ecosystem Illustration"
        width={600}
        height={480}
        className="max-w-full h-auto"
        priority
      />
    </div>
  </section>
);

const DAppCard = ({ dapp }) => {
  const [logotrue, setLogotrue] = useState(true);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full mb-3 sm:mb-4 overflow-hidden">
        {logotrue ? (
          <Image
            src={sampleimage}
            alt={`${dapp["Project name"]} logo`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg sm:text-xl">
            {dapp["Project name"].charAt(0)}
          </div>
        )}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{dapp["Project name"]}</h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
        {dapp["Project description"]?.slice(0, 100)}
        {dapp["Project description"]?.length > 100 ? '...' : ''}
      </p>
      <span className="text-blue-600 text-xs sm:text-sm">{dapp["Project category tag"]}</span>
    </div>
  );
};

const AllDApps = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredDApps = data.filter(
    (dapp) =>
      dapp["Project name"].toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || dapp["Project category tag"] === selectedCategory)
  );

  const categories = [...new Set(data.map((dapp) => dapp["Project category tag"]))];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-28 mt-10 sm:mt-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-blue-600">All dApps</h2>
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <select
          className="border rounded-md px-3 sm:px-4 py-2 w-full sm:w-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Browse by category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="flex w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by keyword"
            className="border rounded-l-md px-3 sm:px-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-r-md">
            <Search size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredDApps.map((dapp, index) => (
          <DAppCard key={index} dapp={dapp} />
        ))}
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <AllDApps />
    </div>
  );
}