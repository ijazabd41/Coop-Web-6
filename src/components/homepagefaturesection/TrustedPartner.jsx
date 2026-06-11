import React from 'react';

const TrustedPartner = () => {
  return (
    <section style={{ background: '#f9fafb', padding: '40px 0', borderTop: '1px solid #eee' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#111' }}>Secure & Trusted Checkout</h3>
          <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '14px' }}>Your payment information is processed securely.</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', gap: '8px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* 1. SSL Secure */}
          <div style={{ flex: '1 1 0', minWidth: '90px', height: '70px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', padding: '8px' }}>
            <div style={{ background: '#d1fae5', color: '#065f46', padding: '6px 10px', borderRadius: '50px', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🔒 SSL
            </div>
          </div>
          
          {/* 2. VISA */}
          <div style={{ flex: '1 1 0', minWidth: '90px', height: '70px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', padding: '8px' }}>
            <div style={{ color: '#1a1a5c', fontStyle: 'italic', fontWeight: 900, fontSize: '26px' }}>VISA</div>
          </div>
          
          {/* 3. Mastercard */}
          <div style={{ flex: '1 1 0', minWidth: '90px', height: '70px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', padding: '8px' }}>
            <div style={{ color: '#eb001b', fontWeight: 900, fontSize: '22px', letterSpacing: '-1px' }}>Mastercard</div>
          </div>
          
          {/* 4. Apple Pay */}
          <div style={{ flex: '1 1 0', minWidth: '90px', height: '70px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', padding: '8px' }}>
            <div style={{ color: '#000', fontWeight: 800, fontSize: '22px' }}> Pay</div>
          </div>
          
          {/* 5. Google Pay */}
          <div style={{ flex: '1 1 0', minWidth: '90px', height: '70px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', padding: '8px' }}>
            <div style={{ color: '#5f6368', fontWeight: 800, fontSize: '22px' }}>G Pay</div>
          </div>
          
          {/* 6. tabby */}
          <div style={{ flex: '1 1 0', minWidth: '90px', height: '70px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', padding: '8px' }}>
            <div style={{ background: '#000', color: '#3eedbf', padding: '4px 10px', borderRadius: '8px', fontWeight: 900, fontSize: '20px', letterSpacing: '-1px' }}>tabby</div>
          </div>
          
          {/* 7. tamara */}
          <div style={{ flex: '1 1 0', minWidth: '90px', height: '70px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', padding: '8px' }}>
            <div style={{ background: '#f36c50', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontWeight: 900, fontSize: '20px', letterSpacing: '-1px' }}>tamara</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartner;
