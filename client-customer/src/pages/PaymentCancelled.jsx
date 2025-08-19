import React from 'react';

const PaymentCancelled = () => {
  return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h2>❌ Payment Cancelled</h2>
      <p>You can try again or contact support if needed.</p>
      <a href="/services">Back to Services</a>
    </div>
  );
};

export default PaymentCancelled;
