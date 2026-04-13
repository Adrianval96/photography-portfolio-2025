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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContactForm(data: ContactFormData): Promise<SubmitResult> {
  if (!data.name?.trim()) return { success: false, error: 'Name is required.' }
  if (!data.email?.trim() || !EMAIL_RE.test(data.email))
    return { success: false, error: 'A valid email is required.' }
  if (!data.message?.trim()) return { success: false, error: 'Message is required.' }

  try {
    const payload = await getPayload({ config: configPromise })
    const contact = (await payload.findGlobal({ slug: 'contact' })) as Contact
    const { notificationEmail } = contact

    if (!notificationEmail) {
      return { success: false, error: 'Contact form is not configured. Please try again later.' }
    }

    const timeframeRow = data.timeframe
      ? `<p><strong>Timeframe:</strong> ${escapeHtml(data.timeframe)}</p>`
      : ''
    const enquiryRow = data.enquiryType
      ? `<p><strong>Enquiry type:</strong> ${escapeHtml(data.enquiryType)}</p>`
      : ''

    await payload.sendEmail({
      to: notificationEmail,
      subject: `New enquiry from ${data.name.trim().slice(0, 100)}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        ${enquiryRow}
        ${timeframeRow}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br />')}</p>
      `,
    })

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
