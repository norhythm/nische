import markdownToHtml from "@/lib/markdownToHtml";
import contactData from "@/data/contact.json";
import ContactForm from "./contact-form";

export default async function ContactPage() {
  const informationHtml = await markdownToHtml(contactData.information || "");

  return <ContactForm informationHtml={informationHtml} />;
}
