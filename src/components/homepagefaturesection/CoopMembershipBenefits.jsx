import React from 'react';

const benefits = [
  {
    title: 'Reward Points',
    description: 'Earn points on every purchase',
    icon: '🎁'
  },
  {
    title: 'Cashback',
    description: 'Get money back in your wallet',
    icon: '💸'
  },
  {
    title: 'Exclusive Discounts',
    description: 'Special offers just for you',
    icon: '🏷️'
  },
  {
    title: 'Member Pricing',
    description: 'Unlock special lower prices',
    icon: '⭐'
  }
];

const CoopMembershipBenefits = () => {
  return (
    <section className="container mx-auto px-4 my-10">
      <h2 className="text-2xl font-bold text-center mb-6">Coop Membership Benefits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => (
          <div 
            key={index}
            className="flex flex-col items-center p-6 bg-white text-center transition-transform hover:-translate-y-1"
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          >
            <div 
              className="mb-4 flex items-center justify-center"
              style={{ fontSize: '32px', width: '64px', height: '64px', backgroundColor: '#f9fafb', borderRadius: '50%' }}
            >
              {benefit.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
            <p className="text-sm text-gray-500">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoopMembershipBenefits;
