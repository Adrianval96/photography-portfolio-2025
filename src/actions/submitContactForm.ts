'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Contact } from '@/payload-types'

type ContactFormData = {
  name: string
  email: string
  enquiryType?: string
  timeframe?: string
  message: string
}

type SubmitResult = { success: true } | { success: false; error: string }

export async function submitContactForm(data: ContactFormData): Promise<SubmitResult> {
  try {
    const payload = await getPayload({ config: configPromise })
    const contact = (await payload.findGlobal({ slug: 'contact' })) as Contact
    const { notificationEmail } = contact

    if (notificationEmail) {
      const timeframeRow = data.timeframe
        ? `<p><strong>Timeframe:</strong> ${data.timeframe}</p>`
        : ''
      const enquiryRow = data.enquiryType
        ? `<p><strong>Enquiry type:</strong> ${data.enquiryType}</p>`
        : ''

      await payload.sendEmail({
        to: notificationEmail,
        subject: `New enquiry from ${data.name}`,
        html: `
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${enquiryRow}
          ${timeframeRow}
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br />')}</p>
        `,
      })
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
