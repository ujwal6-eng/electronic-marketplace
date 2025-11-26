import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: "Orders & Purchases",
      questions: [
        {
          q: "How do I place an order?",
          a: "Browse our marketplace, add items to your cart, and proceed to checkout. You'll need to create an account or sign in to complete your purchase."
        },
        {
          q: "Can I modify my order after placing it?",
          a: "You can modify your order within 1 hour of placing it by contacting our support team. After that, the order enters processing and cannot be modified."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, debit cards, PayPal, and Apple Pay. All payments are processed securely through our encrypted payment gateway."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) and overnight shipping options are also available at checkout."
        },
        {
          q: "Do you ship internationally?",
          a: "Yes, we ship to over 100 countries worldwide. International shipping times vary by destination, typically 7-14 business days."
        },
        {
          q: "How can I track my order?",
          a: "Once your order ships, you'll receive a tracking number via email. You can also track your order in the 'Orders' section of your account."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer a 30-day return policy for most items. Products must be in original condition with all packaging and accessories."
        },
        {
          q: "How do I initiate a return?",
          a: "Go to your Orders page, select the item you want to return, and click 'Request Return'. Follow the prompts to complete your return request."
        },
        {
          q: "When will I receive my refund?",
          a: "Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method."
        }
      ]
    },
    {
      category: "Services & Repairs",
      questions: [
        {
          q: "How do I book a repair service?",
          a: "Visit our Services page, select your device type and issue, choose a technician, and schedule an appointment. You'll receive a confirmation email with all details."
        },
        {
          q: "Are your technicians certified?",
          a: "Yes, all our technicians are certified professionals with verified credentials and extensive experience in electronics repair."
        },
        {
          q: "Do you offer warranty on repairs?",
          a: "All repairs come with a 90-day warranty covering parts and labor. If the same issue occurs within this period, we'll fix it free of charge."
        }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        {
          q: "How do I reset my password?",
          a: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions in the reset email we'll send you."
        },
        {
          q: "Is my payment information secure?",
          a: "Yes, we use industry-standard SSL encryption and PCI DSS compliant payment processing. We never store your full credit card details on our servers."
        },
        {
          q: "How do I delete my account?",
          a: "Go to Profile > Settings > Account and select 'Delete Account'. Note that this action is permanent and will remove all your data."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full mb-4">
            <HelpCircle className="w-12 h-12 text-violet-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 gradient-rainbow text-gradient">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Search our knowledge base or browse frequently asked questions
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground">
                Get instant help from our support team
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Mon-Fri, 9am-6pm EST
              </p>
              <p className="text-sm font-medium">+1 (555) 123-4567</p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-violet-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-2">
                We'll respond within 24 hours
              </p>
              <p className="text-sm font-medium">support@electro.com</p>
            </div>
          </Card>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          {faqs.map((category, idx) => (
            <Card key={idx} className="mb-6 p-6">
              <h3 className="text-xl font-semibold mb-4 gradient-rainbow text-gradient">
                {category.category}
              </h3>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((item, qIdx) => (
                  <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                    <AccordionTrigger className="text-left hover:text-violet-500">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
