"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50">
      <Card className="max-w-4xl w-full bg-white shadow-lg rounded-xl overflow-auto">
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          <p className="text-gray-500">Effective Date: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="px-6 py-4 space-y-6">
          <section>
            <p>
              At ShipDuniya ("we," "us," "our," or "Company"), we are committed
              to protecting your privacy and ensuring the security of your
              personal information. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use
              our website, mobile application, and services (collectively, the
              "Services"). By accessing or using our Services, you agree to the
              terms of this Privacy Policy. If you do not agree with the terms,
              please do not use our Services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
            <p>
              We collect various types of information to provide and improve our
              Services. This includes personal information such as your name,
              email address, phone number, shipping and billing addresses, GST
              number, PAN number, Aadhar card details (if required for KYC), bank
              account details, and government-issued identification documents. We
              may also collect non-personal information such as your device
              information (e.g., IP address, browser type, operating system),
              usage data (e.g., pages visited, time spent on the website), and
              location data (if you enable location services). Additionally, we
              may collect sensitive personal data such as financial information
              (e.g., credit/debit card details, wallet balance), passwords, and
              biometric data (if required for advanced verification).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
            <p>
              We use the information we collect for several purposes, including
              processing and fulfilling your orders, providing customer support,
              and improving the functionality and user experience of our
              Services. We also use your information to communicate with you,
              such as sending order confirmations, shipping updates, invoices, and
              promotional offers (with your consent). Additionally, we use your
              information for verification and compliance purposes, such as
              completing KYC processes and complying with legal and regulatory
              requirements. We also use your information to enhance security by
              detecting and preventing fraud, unauthorized access, or misuse of
              our Services. Furthermore, we may use your information for legal and
              contractual obligations, such as enforcing our terms and conditions
              or defending against legal claims.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. How We Share Your Information</h2>
            <p>
              We may share your information with third-party service providers,
              such as logistics partners (e.g., Xpressbees, Delhivery, Ecom Express)
              for order fulfillment, payment gateways (e.g., Razorpay) for processing
              payments, and IT service providers for maintaining our website and
              systems. We may also share your information for legal and regulatory
              purposes, such as complying with applicable laws, responding to government
              authorities, or protecting the rights, property, or safety of ShipDuniya,
              our users, or the public. With your explicit consent, we may share your
              information with third parties for specific purposes. In the event of a
              business transfer, such as a merger, acquisition, or sale of assets, your
              information may be transferred as part of the transaction, and we will
              notify you of any such change. We may also share aggregated or anonymized
              data that does not identify you personally for research, marketing, or other
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a longer
              retention period is required or permitted by law. For example, order
              information is retained for 7 years to comply with tax and accounting
              regulations, while KYC documents are retained for 10 years as per regulatory
              requirements. Marketing data is retained until you withdraw your consent or
              opt out. After the retention period, your data will be securely deleted or
              anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your user
              experience, analyze website traffic and usage patterns, and deliver
              targeted advertisements (with your consent). Cookies are small text files
              stored on your device that help us recognize you and remember your
              preferences. You can manage your cookie preferences through your browser
              settings, but disabling cookies may affect the functionality of our Services.
              We use essential cookies for the functioning of our Services (e.g., login,
              payment processing), analytics cookies to track website performance, and
              advertising cookies to deliver personalized ads based on your interests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
            <p>
              We implement robust security measures to protect your information from
              unauthorized access, alteration, disclosure, or destruction. These
              measures include encryption of sensitive data during transmission and
              storage, strict access controls and authentication mechanisms, regular
              security audits and vulnerability assessments, and employee training on
              data protection best practices. Despite our efforts, no method of
              transmission over the internet or electronic storage is 100% secure, so we
              cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Your Rights and Choices</h2>
            <p>
              You have several rights regarding your personal information. You may
              access, update, or correct your personal information by logging into your
              account or contacting us. You may withdraw your consent for marketing
              communications at any time by clicking the "unsubscribe" link in our emails
              or contacting us. You may also request the deletion of your personal
              information, subject to legal and contractual obligations. Additionally,
              you may request a copy of your data in a structured, machine-readable format
              (data portability) or request that we restrict the processing of your data
              under certain circumstances. If you have any concerns about our use of your
              information, you may contact our Grievance Officer (details provided in Section
              11 of this policy).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Third-Party Links</h2>
            <p>
              Our Services may contain links to third-party websites or services. This
              Privacy Policy does not apply to such third-party sites, and we are not
              responsible for their privacy practices. We encourage you to review the
              privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. International Data Transfers</h2>
            <p>
              If you are accessing our Services from outside India, please note that your
              data may be transferred to, stored, and processed in India, where our servers
              are located. By using our Services, you consent to such transfers. We will take
              all necessary steps to ensure that your data is treated securely and in
              accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our
              practices or legal requirements. We will notify you of any material changes by
              posting the updated policy on our website or through other communication channels.
              Your continued use of our Services after such changes constitutes your acceptance
              of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or
              our data practices, please contact our Grievance Officer:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Name: ______________________</li>
              <li>Email: ______________________</li>
              <li>Phone: ______________________</li>
              <li>
                Address: C-45, Ground Floor, Sector 10, Noida, Uttar Pradesh, 201301
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">12. Governing Law</h2>
            <p>
              This Privacy Policy is governed by the laws of India. Any disputes arising out
              of or related to this policy shall be subject to the exclusive jurisdiction of
              the courts in Noida, Uttar Pradesh.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">13. Additional Provisions for International Users</h2>
            <p>
              If you are a user from the European Union (EU) or other regions with specific data
              protection laws, the following additional provisions apply. We process your data
              based on your consent, contractual necessity, or legitimate interests, as permitted
              under the General Data Protection Regulation (GDPR). For GDPR compliance, you may
              contact our Data Protection Officer at ______________________. If you believe that
              your data protection rights have been violated, you have the right to lodge a
              complaint with a supervisory authority in your jurisdiction.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
