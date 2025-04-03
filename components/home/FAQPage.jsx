import React from 'react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const FAQPage = () => {
    const faqs = [
        {
          question: "How can I track my shipment?",
          answer: "You can track your shipment by entering your tracking number on our homepage or in the tracking section of our website."
        },
        {
          question: "What shipping options do you offer?",
          answer: "We offer various shipping options including standard, express, and overnight delivery. The available options depend on your location and destination."
        },
        {
          question: "How do I change my delivery address?",
          answer: "To change your delivery address, please contact our customer support team as soon as possible with your tracking number and the new address details."
        },
        {
          question: "What should I do if my package is damaged?",
          answer: "If your package is damaged, please take photos of the damage and contact our customer support team immediately. We'll guide you through the next steps."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we offer international shipping to many countries. Rates and delivery times vary depending on the destination."
        }
      ]
    
      return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-16">
          <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )
}

export default FAQPage