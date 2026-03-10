"use client";

import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: `${form.message}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Success! Thank you! Please wait for reply.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus(data.error || "Sending failed, please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      {/* Contact Content */}
      <section className="w-full xl:max-w-screen-xl mx-auto px-4 md:px-[8%] xl:px-[102px] pt-0 mb-20 md:pt-0 md:px-8">
        <div className="mx-auto">
          <h1 className="text-lg md:text-2xl tracking-wider mb-8 capitalize">
            Contact
          </h1>

          <div className="my-12">
            <h2 className="mb-4 text-lg">Information</h2>
            <p className="mb-2 text-sm md:text-base">
              If you get more information,{" "}
              <a
                className="decoration-underline"
                href="mailto:tsukasa.kikuchi@arte-refact.com"
              >
                please send a message directly (tsukasa.kikuchi@arte-refact.com)
              </a>{" "}
              <br />
              or through the inquiry form below.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block mb-2 text-sm">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full md:w-80 p-2 border border-gray-[#ddd] focus:outline-none focus:ring-1 focus:ring-gray-400"
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
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full md:w-80 p-2 border border-gray-[#ddd] focus:outline-none focus:ring-1 focus:ring-gray-400"
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
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full md:w-80 p-2 border border-gray-[#ddd] focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-sm">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                className="w-full md:w-2/3 p-2 border border-gray-[#ddd] focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-color border-gray-[#ddd] transition-colors hover:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
          {status && <p className="pt-4 text-sm md:text-base">{status}</p>}
        </div>
      </section>
    </>
  );
}
