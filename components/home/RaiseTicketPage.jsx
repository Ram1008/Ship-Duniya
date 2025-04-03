import React from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"

const RaiseTicketPage = () => {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-16">
          <h1 className="text-4xl font-bold mb-8 text-center">Raise a Support Ticket</h1>
          <form className="max-w-lg mx-auto space-y-4">
            <Input type="text" placeholder="Your Name" />
            <Input type="email" placeholder="Your Email" />
            <Select>
              <option value="">Select Issue Type</option>
              <option value="shipping">Shipping Problem</option>
              <option value="tracking">Tracking Issue</option>
              <option value="billing">Billing Question</option>
              <option value="other">Other</option>
            </Select>
            <Input type="text" placeholder="Ticket Subject" />
            <Textarea placeholder="Describe your issue" />
            <Button type="submit" className='bg-blue-600'>Submit Ticket</Button>
          </form>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Track Your Ticket</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Input type="text" placeholder="Ticket Number" />
              <Button className='bg-blue-600'>Track Ticket</Button>
            </div>
          </div>
        </div>
      )
}

export default RaiseTicketPage