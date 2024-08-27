import React from 'react';
import { FiSearch } from 'react-icons/fi';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-white font-bold text-3xl cursor-pointer tracking-tight">
                Edu<span className="text-blue-200">Scan</span>
              </span>
            </Link>
          </div>
          <div className="flex-grow max-w-3xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Address / Txn Hash / Block / Token"
                className="w-full bg-white bg-opacity-10 text-white placeholder-blue-200 rounded-md py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-opacity-20 transition duration-300 ease-in-out text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-blue-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;