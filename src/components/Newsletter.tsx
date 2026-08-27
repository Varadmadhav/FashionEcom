"use client";

import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 md:py-32 bg-brand-bg text-brand-fg border-b border-brand-border/30">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 text-center flex flex-col items-center">
        
        <div className="max-w-md space-y-4 md:space-y-6">
          <span className="font-serif italic text-xs text-brand-muted uppercase tracking-wider block">
            Studio Newsletter
          </span>
          
          <h2 className="font-sans text-lg md:text-xl font-bold uppercase tracking-[0.2em] text-brand-espresso">
            STAY IN THE KNOW
          </h2>
          
          <p className="font-sans text-xs md:text-sm tracking-wider leading-relaxed text-brand-muted font-light max-w-sm mx-auto">
            Discover new collections, stories, and considered wardrobe pieces from the studio.
          </p>

          {submitted ? (
            <div className="py-4 animate-fade-in">
              <p className="font-serif italic text-sm text-brand-espresso">
                Thank you. You have been added to our studio register.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-6 w-full max-w-sm mx-auto">
              <div className="relative flex items-center border-b border-brand-border focus-within:border-brand-espresso transition-colors duration-300 pb-2">
                <input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none py-2 text-xxs uppercase tracking-widest text-brand-fg placeholder:text-brand-muted focus:outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  className="font-sans text-xxs font-bold uppercase tracking-widest text-brand-espresso hover:text-brand-muted pl-4 transition-colors duration-300 flex items-center gap-1"
                >
                  <span>Join</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}

