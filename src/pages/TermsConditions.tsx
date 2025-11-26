import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsConditions() {
  const lastUpdated = 'December 26, 2024';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full mb-4">
            <FileText className="w-12 h-12 text-violet-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 gradient-rainbow text-gradient">
            Terms & Conditions
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Terms Content */}
        <Card className="max-w-4xl mx-auto p-8 md:p-12">
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using Electro's website, mobile application, and services (collectively, the "Platform"), 
                you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use 
                our Platform.
              </p>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Your continued use of the Platform after changes 
                are posted constitutes your acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
              <p className="text-muted-foreground mb-4">
                To access certain features of the Platform, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="text-muted-foreground">
                You must be at least 18 years old to create an account. By registering, you represent that you meet 
                this age requirement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Conduct</h2>
              <p className="text-muted-foreground mb-4">
                When using our Platform, you agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or engage in hacking</li>
                <li>Harass, threaten, or harm other users</li>
                <li>Post false, misleading, or fraudulent content</li>
                <li>Attempt to manipulate reviews or ratings</li>
                <li>Use automated systems to access the Platform</li>
                <li>Resell or commercialize the Platform without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Marketplace Terms</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Product Listings</h3>
              <p className="text-muted-foreground mb-4">
                Sellers are responsible for the accuracy of their product listings, including descriptions, pricing, and 
                availability. Electro reserves the right to remove listings that violate our policies or applicable laws.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Purchases</h3>
              <p className="text-muted-foreground mb-4">
                All purchases are subject to product availability. We reserve the right to refuse or cancel orders at our 
                discretion. Prices are subject to change without notice. When you place an order, you agree to pay all 
                charges including shipping and applicable taxes.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Payment</h3>
              <p className="text-muted-foreground mb-4">
                Payment processing is handled through secure third-party providers. By providing payment information, 
                you represent that you are authorized to use the payment method. You agree to pay all charges incurred 
                by you or any users of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Service Bookings</h2>
              <p className="text-muted-foreground mb-4">
                When booking repair or technical services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>You agree to provide accurate information about your device and issue</li>
                <li>Service estimates are non-binding and final costs may vary</li>
                <li>Technicians are independent contractors, not Electro employees</li>
                <li>You are responsible for backing up your data before service</li>
                <li>Electro is not liable for data loss during repairs</li>
                <li>Cancellation policies apply as stated at time of booking</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Community Forum</h2>
              <p className="text-muted-foreground mb-4">
                The Community Forum allows users to share information and seek help. By participating, you agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Content you post becomes publicly available</li>
                <li>You grant Electro a license to use your content</li>
                <li>You are responsible for your posts and interactions</li>
                <li>Electro may moderate, edit, or remove content</li>
                <li>Advice from other users is not professional consultation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All content on the Platform, including text, graphics, logos, images, and software, is the property of 
                Electro or its content suppliers and is protected by intellectual property laws. You may not copy, modify, 
                distribute, or create derivative works without explicit permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Privacy</h2>
              <p className="text-muted-foreground mb-4">
                Your use of the Platform is also governed by our Privacy Policy, which describes how we collect, use, 
                and protect your personal information. By using the Platform, you consent to our privacy practices as 
                described in the Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Limitations of Liability</h2>
              <p className="text-muted-foreground mb-4">
                The Platform is provided "as is" without warranties of any kind. We do not guarantee that the Platform 
                will be uninterrupted, secure, or error-free. To the maximum extent permitted by law, Electro shall not 
                be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
              <p className="text-muted-foreground mb-4">
                You agree to indemnify and hold harmless Electro, its affiliates, and their respective officers, 
                directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising 
                from your use of the Platform or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to suspend or terminate your account and access to the Platform at our sole 
                discretion, with or without notice, for conduct that we believe violates these Terms or is harmful 
                to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, 
                United States, without regard to its conflict of law provisions. Any disputes arising from these Terms 
                shall be resolved in the courts of California.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-muted p-4 rounded-lg text-muted-foreground">
                <p className="mb-2"><strong>Email:</strong> legal@electro.com</p>
                <p className="mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Tech Street, Silicon Valley, CA 94025</p>
              </div>
            </section>
          </div>
        </Card>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
