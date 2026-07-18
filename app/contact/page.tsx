"use client"

import React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  CheckCircle,
  User,
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the form data to a server
    setIsSubmitted(true)
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "+974 5025 6775",
      href: "tel:+97450256775",
    },
    {
      icon: Mail,
      title: "Email",
      value: "infinitymarbledesign@gmail.com",
      href: "mailto:infinitymarbledesign@gmail.com",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Doha, Qatar",
      href: null,
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: "Sat - Thu: 8AM - 6PM",
      href: null,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 lg:pt-24 pb-20">
        {/* Hero */}
        <section className="py-12 lg:py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-sm font-medium text-gold tracking-wider uppercase">
                Get In Touch
              </span>
              <h1 className="mt-2 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold">
                Contact Us
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
                Ready to transform your space? Contact our team for a free consultation and quotation.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-gold" />
                      Send us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-12">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="font-serif text-2xl font-bold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground mb-6">
                          Thank you for contacting us. We{"'"}ll get back to you within 24 hours.
                        </p>
                        <Button
                          onClick={() => setIsSubmitted(false)}
                          className="bg-gold text-background hover:bg-gold-light"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              required
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              className="mt-1 bg-secondary border-border"
                              placeholder="Your name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              className="mt-1 bg-secondary border-border"
                              placeholder="your@email.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                              }
                              className="mt-1 bg-secondary border-border"
                              placeholder="+974 XXXX XXXX"
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Company (Optional)</Label>
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) =>
                                setFormData({ ...formData, company: e.target.value })
                              }
                              className="mt-1 bg-secondary border-border"
                              placeholder="Your company name"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            required
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({ ...formData, subject: e.target.value })
                            }
                            className="mt-1 bg-secondary border-border"
                            placeholder="How can we help you?"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            required
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                            className="mt-1 bg-secondary border-border"
                            rows={6}
                            placeholder="Tell us about your project, requirements, or any questions you have..."
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gold text-background hover:bg-gold-light min-h-[48px]"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Key Contacts */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <User className="h-5 w-5 text-gold" />
                      Key Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="font-medium text-foreground">Mr. Saeed El Shaibani</p>
                      <p className="text-sm text-muted-foreground">Director</p>
                      <a
                        href="tel:+97466625661"
                        className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-light transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        +974 6662 5661
                      </a>
                    </div>
                    <div className="border-t border-border pt-6">
                      <p className="font-medium text-foreground">Mr. B. Sajeeth</p>
                      <p className="text-sm text-muted-foreground">Project Manager</p>
                      <a
                        href="tel:+97450256775"
                        className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-light transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        +974 5025 6775
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-gold" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {contactInfo.map((info) => (
                      <div key={info.title} className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                          <info.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{info.title}</p>
                          {info.href ? (
                            <a
                              href={info.href}
                              className="font-medium text-foreground hover:text-gold transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="font-medium">{info.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* WhatsApp CTA */}
                <Card className="bg-green-600/10 border-green-600/30">
                  <CardContent className="p-6">
                    <h3 className="font-serif text-lg font-semibold text-green-500 mb-2">
                      Quick Response via WhatsApp
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get instant responses by messaging us on WhatsApp during business hours.
                    </p>
                    <Button
                      asChild
                      className="w-full bg-green-600 text-white hover:bg-green-700"
                    >
                      <a
                        href="https://wa.me/97450256775"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat on WhatsApp
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                {/* Services */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-serif">Our Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-gold" />
                        Free Consultation & Site Visit
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-gold" />
                        Material Selection Assistance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-gold" />
                        AI Design Visualization
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-gold" />
                        Custom Cutting & Finishing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-gold" />
                        Professional Installation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-gold" />
                        After-Sales Support
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
