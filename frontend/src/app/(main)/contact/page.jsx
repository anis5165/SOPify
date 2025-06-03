'use client';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import Footer from "@/components/Footer";

export default function ContactPage() {
  useEffect(() => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-xl">SOPify</span>
                </div>
                <Badge variant="secondary">Contact Us</Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Get in Touch
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Have questions or feedback? We'd love to hear from you. Our team is here to help.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="w-full md:px-16 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Contact Information</h2>
                  <p className="text-gray-500">
                    Choose the most convenient way to reach us. We're here to help you with any questions about SOPify.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-500">support@sopify.com</p>
                      <p className="text-sm text-gray-400">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-gray-500">+1 (555) 123-4567</p>
                      <p className="text-sm text-gray-400">Mon-Fri, 9am-5pm EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Office</h3>
                      <p className="text-gray-500">123 Innovation Street</p>
                      <p className="text-gray-500">Tech City, TC 12345</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="w-full">
                <CardContent className="pt-6">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium leading-none">
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium leading-none">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium leading-none">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="Enter subject"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium leading-none">
                        Message
                      </label>
                      <textarea
                        id="message"
                        placeholder="Enter your message"
                        className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">FAQ</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Find quick answers to common questions about SOPify
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-3xl gap-6 py-12">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">How does SOPify work?</h3>
                  <p className="text-gray-500">
                    SOPify uses AI to automatically capture and document your workflow processes, creating professional SOPs in minutes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Is there a free trial available?</h3>
                  <p className="text-gray-500">
                    Yes, we offer a 14-day free trial with full access to all features. No credit card required.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Can I export my SOPs to different formats?</h3>
                  <p className="text-gray-500">
                    Yes, SOPify supports multiple export formats including PDF, Word, and HTML.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}