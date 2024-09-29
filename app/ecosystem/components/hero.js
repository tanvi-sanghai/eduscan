"use client";
import Image from "next/image";
import illustration from "@/public/assets/dapp3.png";

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

export default Hero;