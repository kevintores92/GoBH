'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function Features() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground py-4 px-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">GOBH Investments</span>
          </div>
          <div className="space-x-6 flex items-center">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/features" className="hover:text-accent transition-colors">Features</Link>
            <Link href="/portfolio" className="hover:text-accent transition-colors">Portfolio</Link>
            <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90 border-0">
              Get Offer
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-accent mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-primary mb-8">Features</h1>
          <p className="text-xl text-muted-foreground">
            This is the Features page. Content coming soon...
          </p>
        </div>
      </section>
    </div>
  )
}