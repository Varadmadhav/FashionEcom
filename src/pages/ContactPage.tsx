"use client";

import React, { useState } from "react";
import { Plus, Minus, Send, Check } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqItems: FaqItem[] = [
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, we will email you a tracking link. You can also view shipping details by logging into your account or contacting support with your order number.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer simple and transparent returns within 7 days of delivery. Items must be unworn, unwashed, and in their original packaging with tags intact. Contact customer care to schedule a return pickup.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping across India takes 3 to 5 business days. Express shipping options are available at checkout. International shipping times range from 7 to 10 business days.",
    },
    {
      question: "How do I choose my size?",
      answer:
        "Please refer to our Size Guide on each product page, which lists exact garment measurements. If you fall between sizes or need custom styling advice, contact our care team.",
    },
    {
      question: "How can I contact customer care?",
      answer:
        "You can email us directly at hello@aurelie.com, call us at our helpline Monday through Saturday from 10:00 to 18:00 IST, or submit a message using the contact form on this page.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: "", email: "", orderNumber: "", message: "" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-fg pt-28 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8">
        
        {/* Page Hero */}
        <div className="max-w-2xl mb-12 md:mb-20 space-y-4">
          <span className="font-serif italic text-xs text-brand-muted uppercase tracking-wider block">
            Customer Care
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-light tracking-wide uppercase text-brand-espresso">
            LET'S TALK.
          </h1>
          <p className="font-sans text-xs md:text-sm text-brand-muted tracking-wider leading-relaxed max-w-lg font-light">
            Questions about your order, a piece you are considering, or simply want to know more about the studio? We are here to help.
          </p>
        </div>

        {/* Core Layout Split */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start border-b border-brand-border/30 pb-16">
          
          {/* Left Column: Contact info */}
          <div className="w-full lg:w-[45%] space-y-12">
            
            {/* Details panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-brand-border/40 pb-8">
              <div className="space-y-2">
                <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                  General Contact
                </h3>
                <a
                  href="mailto:hello@aurelie.com"
                  className="font-serif text-base italic hover:text-brand-muted transition-colors text-brand-espresso"
                >
                  hello@aurelie.com
                </a>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                  Customer Care Hours
                </h3>
                <p className="font-sans text-xxs tracking-wider uppercase text-brand-espresso">
                  Monday — Saturday
                </p>
                <p className="font-sans text-xxs tracking-wider text-brand-muted">
                  10:00 — 18:00 IST
                </p>
              </div>
            </div>

            {/* Studio location / details */}
            <div className="space-y-4">
              <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Our Location
              </h3>
              <p className="font-sans text-xs text-brand-muted tracking-wide font-light leading-relaxed">
                Aurelie Studio Headquarters <br />
                Level 4, Designer District, Lower Parel <br />
                Mumbai, MH 400013, India
              </p>
            </div>

          </div>

          {/* Right Column: Form Panel */}
          <div className="w-full lg:w-[55%] bg-brand-surface/20 border border-brand-border p-8 md:p-12">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in flex flex-col items-center">
                <div className="h-10 w-10 bg-brand-espresso text-brand-bg rounded-full flex items-center justify-center mb-2">
                  <Check className="h-5 w-5 stroke-[2]" />
                </div>
                <h2 className="font-serif text-lg italic text-brand-espresso">
                  Message Sent
                </h2>
                <p className="font-sans text-xs text-brand-muted tracking-wide max-w-xs leading-relaxed">
                  Thank you for writing to us. Our customer care team will review your message and reach back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 border border-brand-border bg-brand-bg text-brand-fg px-5 py-2.5 font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-brand-surface transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Name */}
                <div className="relative border-b border-brand-border focus-within:border-brand-espresso transition-colors duration-300 pb-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="peer w-full bg-transparent border-none py-1.5 text-xs tracking-wider text-brand-fg placeholder-transparent focus:outline-none focus:ring-0"
                    placeholder="NAME"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 top-1.5 pointer-events-none font-sans text-xxs uppercase tracking-widest text-brand-muted transition-all duration-300 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-xxs peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-brand-fg peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[9px]"
                  >
                    NAME
                  </label>
                </div>

                {/* Email */}
                <div className="relative border-b border-brand-border focus-within:border-brand-espresso transition-colors duration-300 pb-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="peer w-full bg-transparent border-none py-1.5 text-xs tracking-wider text-brand-fg placeholder-transparent focus:outline-none focus:ring-0"
                    placeholder="EMAIL"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 top-1.5 pointer-events-none font-sans text-xxs uppercase tracking-widest text-brand-muted transition-all duration-300 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-xxs peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-brand-fg peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[9px]"
                  >
                    EMAIL
                  </label>
                </div>

                {/* Order Number */}
                <div className="relative border-b border-brand-border focus-within:border-brand-espresso transition-colors duration-300 pb-2">
                  <input
                    type="text"
                    name="orderNumber"
                    id="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleInputChange}
                    className="peer w-full bg-transparent border-none py-1.5 text-xs tracking-wider text-brand-fg placeholder-transparent focus:outline-none focus:ring-0"
                    placeholder="ORDER NUMBER (OPTIONAL)"
                  />
                  <label
                    htmlFor="orderNumber"
                    className="absolute left-0 top-1.5 pointer-events-none font-sans text-xxs uppercase tracking-widest text-brand-muted transition-all duration-300 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-xxs peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-brand-fg peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[9px]"
                  >
                    ORDER NUMBER (OPTIONAL)
                  </label>
                </div>

                {/* Message */}
                <div className="relative border-b border-brand-border focus-within:border-brand-espresso transition-colors duration-300 pb-2">
                  <textarea
                    name="message"
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="peer w-full bg-transparent border-none py-1.5 text-xs tracking-wider text-brand-fg placeholder-transparent focus:outline-none focus:ring-0 resize-none"
                    placeholder="MESSAGE"
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-0 top-1.5 pointer-events-none font-sans text-xxs uppercase tracking-widest text-brand-muted transition-all duration-300 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-xxs peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-brand-fg peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[9px]"
                  >
                    MESSAGE
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-2 bg-brand-espresso text-brand-bg px-8 py-4 text-xxs font-bold uppercase tracking-widest hover:bg-brand-black transition-colors duration-300 font-sans"
                  >
                    <span>Send Message</span>
                    <Send className="h-3 w-3 stroke-[1.5] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="pt-16 max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl italic tracking-wide text-brand-espresso">
              Frequently Asked Questions
            </h2>
            <p className="font-sans text-xxs text-brand-muted uppercase tracking-widest">
              Quick answers about orders and services
            </p>
          </div>

          <div className="border-t border-brand-border/40 divide-y divide-brand-border/40">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between text-left py-2 focus:outline-none"
                  >
                    <span className="font-sans text-xs uppercase tracking-wider font-semibold text-brand-espresso">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <Minus className="h-4 w-4 stroke-[1.25] text-brand-muted" />
                    ) : (
                      <Plus className="h-4 w-4 stroke-[1.25] text-brand-muted" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="font-sans text-xs text-brand-muted tracking-wide font-light leading-relaxed pb-2 pl-0.5">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
