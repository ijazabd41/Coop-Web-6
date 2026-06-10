import React from 'react';

const TrustedPartner = () => {
  return (
    <section className="container mx-auto px-4 my-8">
      <div className="flex flex-col items-center py-6 border-t border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Secure & Trusted Checkout</h3>
        <div className="flex flex-wrap justify-center items-center gap-[20px]">
          
          {/* SSL Secure */}
          <div className="px-4 py-2 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-sm flex items-center gap-1 shadow-sm">
            🔒 SSL Secure
          </div>

          {/* VISA */}
          <div className="px-4 py-2 bg-white border border-gray-200 text-blue-700 font-bold italic rounded-md shadow-sm">
            VISA
          </div>

          {/* Mastercard */}
          <div className="px-4 py-2 bg-white border border-gray-200 text-red-600 font-bold rounded-md shadow-sm flex items-center">
            <span className="w-4 h-4 bg-red-500 rounded-full inline-block mr-[-6px] opacity-80 mix-blend-multiply"></span>
            <span className="w-4 h-4 bg-yellow-500 rounded-full inline-block mr-1 opacity-80 mix-blend-multiply"></span>
            mastercard
          </div>

          {/* Pay & G Pay */}
          <div className="px-4 py-2 bg-white border border-gray-200 text-gray-800 font-semibold rounded-md shadow-sm">
            Pay & G Pay
          </div>

          {/* tabby */}
          <div className="px-4 py-2 bg-black text-cyan-400 font-bold rounded-full shadow-sm">
            tabby
          </div>

          {/* tamara */}
          <div className="px-4 py-2 bg-[#ff6b6b] text-white font-bold rounded-full shadow-sm">
            tamara
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrustedPartner;
