import React from 'react'

const PrivacyPage = () => {
    return ( 
        <div className="container mx-auto py-12 px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose max-w-none">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, request a quote, or contact us for support.</p>
    
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you.</p>
    
            <h2>3. Information Sharing and Disclosure</h2>
            <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>
    
            <h2>4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect the security of your personal information.</p>
    
            <h2>5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. Please contact us to exercise these rights.</p>
    
            <h2>6. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </div>
        </div>
      )
}

export default PrivacyPage