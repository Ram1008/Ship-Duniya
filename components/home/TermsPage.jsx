import React from 'react';

const TermsPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      <div className="prose max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using ShipDart's services, you agree to be bound by these Terms and
          Conditions. If you do not agree to these terms, please do not use our
          services.
        </p>

        <h2>2. Use of Services</h2>
        <p>
          You agree to use ShipDart's services only for lawful purposes and in
          accordance with these Terms and Conditions.
        </p>

        <h2>3. Privacy Policy</h2>
        <p>
          Your use of ShipDart's services is also governed by our Privacy
          Policy, which is incorporated into these Terms and Conditions by
          reference.
        </p>

        <h2>4. Limitation of Liability</h2>
        <p>
          ShipDart shall not be liable for any indirect, incidental, special,
          consequential or punitive damages, including without limitation, loss
          of profits, data, use, goodwill, or other intangible losses.
        </p>

        <h2>5. Changes to Terms</h2>
        <p>
          ShipDart reserves the right to modify these Terms and Conditions at
          any time. We will notify users of any significant changes.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
