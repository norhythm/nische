"use client";

import Link from "next/link";

export default function Contact() {
  return (
    <main className="min-h-screen">
      {/* Contact Content */}
      <section className="container mx-auto px-4 md:px-8 pt-8 md:pt-0 mb-20">
        <div className="mx-auto">
          <h1 className="text-2xl tracking-wider mb-1">CONTACT</h1>
          <p className="text-xl tracking-wider mb-8">Note & Form</p>

          <div className="my-12">
            <h2 className="text-lg mb-4">Contact Information</h2>
            <p className="mb-2">tsukasa.kikuchi@arte-refact.com</p>
            <p className="mb-2">
              If you get more information, please send a message directly
              through the inquiry form below.
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block mb-2 text-sm">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-sm">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="px-6 py-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
