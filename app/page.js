'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CheckCircle, Clock, DollarSign, Home, Users, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

function ContactForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    agreeToTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage('Thank you! We\'ll contact you shortly.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          agreeToTerms: false
        })
        if (onSubmitSuccess) {
          setTimeout(() => onSubmitSuccess(), 2000)
        }
      } else {
        setSubmitMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Full Name *</label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleInputChange}
          placeholder="John Doe"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email Address *</label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder="john@example.com"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">Phone Number *</label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="(555) 123-4567"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">Property Address *</label>
        <Input
          id="address"
          name="address"
          type="text"
          required
          value={formData.address}
          onChange={handleInputChange}
          placeholder="123 Main St, New York, NY"
          className="w-full"
        />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={formData.agreeToTerms}
          onCheckedChange={handleCheckboxChange}
          required
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
          I have read and agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> and <a href="#" className="text-primary hover:underline">Terms and Conditions</a>. By submitting this form, you consent to receive communications from GOBH Investments. Message frequency varies. You can unsubscribe anytime.
        </label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
        disabled={isSubmitting || !formData.agreeToTerms}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </Button>

      {submitMessage && (
        <p className={`text-center font-medium text-sm ${
          submitMessage.includes('Thank you') ? 'text-green-600' : 'text-red-600'
        }`}>
          {submitMessage}
        </p>
      )}

      <p className="text-center text-xs text-muted-foreground">Free consultation with no obligation</p>
    </form>
  )
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground py-4 px-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image 
              src="https://customer-assets.emergentagent.com/job_5e89f1c6-64dd-4398-ada5-9822b321289d/artifacts/twotmn5y_teal_icons-removebg-preview.png"
              alt="GOBH Investments"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold">GOBH Investments</span>
          </div>
          <div className="space-x-6 flex items-center">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/features" className="hover:text-accent transition-colors">Features</Link>
            <Link href="/portfolio" className="hover:text-accent transition-colors">Portfolio</Link>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90 border-0">
                  Get Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary">Request Your Cash Offer</DialogTitle>
                  <DialogDescription>
                    Fill out the form below and we'll contact you within 24 hours with a no-obligation offer.
                  </DialogDescription>
                </DialogHeader>
                <ContactForm onSubmitSuccess={() => setIsModalOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-20 px-6" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(30, 58, 138, 0.85), rgba(30, 58, 138, 0.85)), url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwaW52ZXN0bWVudHxlbnwwfHx8fDE3NjQ1OTQ0MzZ8MA&ixlib=rb-4.1.0&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left side - Hero content */}
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Your Trusted Property Acquisition Partner
              </h1>
              <p className="text-2xl md:text-3xl mb-4">We purchase homes in any condition, anywhere</p>
              <div className="space-y-3 text-lg mb-8">
                <p>Direct property acquisitions from owners - completed within 21 days or less</p>
                <p>Zero commissions, zero closing fees, zero hidden charges - pure cash offers</p>
                <p className="font-bold text-accent text-xl">Over Two Decades of Market Excellence</p>
                <p>Straightforward, personal service - no middlemen, no listings, no complications</p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
                    Request Your Cash Offer Today
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            {/* Right side - Contact form */}
            <div>
              <Card className="shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-primary">Get Your Cash Offer Today</CardTitle>
                  <CardDescription>Please keep your line open, we'll contact you within 24 hours!</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Why Partner With GOBH Investments?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience seamless property transactions with transparent communication and personalized service designed to maximize your satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Rapid Closing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Complete your sale in as little as 7 days, or select a timeline that suits your needs perfectly.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl">100% Cash Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No financing delays or contingencies. Receive immediate cash payment with complete transparency.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Home className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl">As-Is Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Zero repairs required. We acquire properties in their current condition, eliminating renovation costs and hassles.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl">20+ Years Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Established expertise and integrity. We maintain unwavering commitment to fair dealing with every client.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Simple Process</h2>
            <p className="text-lg text-muted-foreground">Straightforward, transparent, and completely hassle-free</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Receive Your Offer</h3>
              <p className="text-muted-foreground">
                Connect with us directly - no commissions, no extra charges. Receive your competitive cash quote within 48 hours.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Property Walkthrough</h3>
              <p className="text-muted-foreground">
                Schedule a convenient property inspection with our professional team. We'll present a compelling cash offer with zero obligation.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Close & Get Paid</h3>
              <p className="text-muted-foreground">
                We'll finalize your home purchase within three weeks or less, completely hassle-free. Select the closing date that works best for your schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">All Properties, Every Condition</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Regardless of your situation, we have a customized solution for you. No strings attached. No open houses. No last-minute letdowns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { title: 'Single Family', icon: Home },
              { title: 'Town Houses', icon: Home },
              { title: 'Condominium', icon: Home },
              { title: 'Mobile Home', icon: Home },
              { title: 'Multi Family', icon: Home }
            ].map((property, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow hover:border-accent">
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                    <property.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">{property.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-secondary">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about selling your property to us</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg px-6 border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                How does selling to GOBH Investments differ from traditional real estate sales?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                With GOBH Investments, you bypass the lengthy conventional process. No agent fees, no repairs, no staging, and no waiting for buyer financing. We provide direct cash offers and close on your preferred timeline.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg px-6 border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                What is the typical timeline for completing a sale?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We can finalize transactions in as little as 7 days, or you may choose your preferred closing date. Most deals are completed within three weeks or less.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg px-6 border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                Are repairs necessary before selling?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely not! We acquire properties in any condition. Whether your home requires extensive repairs or is move-in ready, we'll present you with a fair cash offer as-is.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-lg px-6 border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                How do I request a cash offer from GOBH Investments?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Simply complete our contact form above with your property information. We'll contact you within 48 hours with a no-obligation cash offer.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white rounded-lg px-6 border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                Can I select my own closing date?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely! We operate on your schedule. Whether you need to close immediately or require additional time to relocate, we'll accommodate your timeline preferences.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white rounded-lg px-6 border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                Are there any costs associated with selling to GOBH Investments?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                None whatsoever! There are no commissions, no closing costs, and no hidden fees. The offer we present is the exact amount you receive.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-white rounded-lg px-6 border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                Do I need to clean out my property before selling?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Not at all. We'll purchase your property exactly as it stands. If you prefer to leave items behind, we'll handle the complete clean-out for you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-white rounded-lg px-6 border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                May I keep my appliances when I move?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Certainly! You may take whatever you wish with you. Simply inform us of what you're taking and what will remain with the property.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="bg-white rounded-lg px-6 border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                What property types does GOBH Investments purchase?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We acquire all property types including single-family homes, townhouses, condominiums, mobile homes, and multi-family properties throughout New York and surrounding areas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="bg-white rounded-lg px-6 border">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                What are the advantages of selling directly to you?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Selling directly to us eliminates agent commissions (typically 6%), repair costs, closing expenses, and guaranteed sale with no financing contingencies. For many property owners, this results in more money retained and a significantly faster, stress-free transaction.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">GOBH Investments</h3>
              </div>
              <p className="text-primary-foreground/80">New York's trusted property acquisition partner since 2003</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li><Link href="/features" className="hover:text-accent transition-colors">Features</Link></li>
                <li><Link href="/portfolio" className="hover:text-accent transition-colors">Portfolio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> (555) 123-4567</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@gobhinvestments.com</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> New York, NY</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2025 GOBH Investments. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}