import React from 'react';

const perks = [
  { icon: '🎁', title: 'Reward Points', description: 'Earn points on every purchase.' },
  { icon: '💸', title: 'Cashback', description: 'Get money back on selected items.' },
  { icon: '🏷️', title: 'Exclusive Discounts', description: 'Access deals only for members.' },
  { icon: '⭐', title: 'Member Pricing', description: 'Special pricing on everyday goods.' },
];

const CoopMembershipBenefits = () => {
  return (
    <section style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#111' }}>💎 Coop Membership Benefits</h2>
          <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '14px' }}>Most cooperative shoppers look for these exclusive perks.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {perks.map((perk, idx) => (
            <div key={idx} style={{ background: '#fff', padding: '24px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{perk.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: '16px', marginBottom: '6px', color: '#111' }}>{perk.title}</h3>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>{perk.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoopMembershipBenefits;
