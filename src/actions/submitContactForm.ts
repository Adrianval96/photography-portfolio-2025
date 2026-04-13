'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Contact } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

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

    const siteUrl = getServerSideURL()

    const typeRow = data.enquiryType ? `<p>Type: ${escapeHtml(data.enquiryType)}</p>` : ''
    const timeframeRow = data.timeframe ? `<p>Timeframe: ${escapeHtml(data.timeframe)}</p>` : ''

    const notificationHtml = `
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      ${data.enquiryType ? `<p><strong>Type:</strong> ${escapeHtml(data.enquiryType)}</p>` : ''}
      ${data.timeframe ? `<p><strong>Timeframe:</strong> ${escapeHtml(data.timeframe)}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, '<br />')}</p>
    `

    const confirmationHtml = `
      <p>I'll get back to you within 48 hours.</p>
      <br />
      <p>Here's a copy of what you sent:</p>
      <br />
      <p>Name: ${escapeHtml(data.name)}</p>
      ${typeRow}
      ${timeframeRow}
      <p>Message: ${escapeHtml(data.message).replace(/\n/g, '<br />')}</p>
      <br />
      <p><a href="${siteUrl}/portfolio">Browse the portfolio →</a></p>
      <br />
      <p>— Adrián<br />Cinematic State Photography</p>
    `

    await Promise.all([
      payload.sendEmail({
        to: notificationEmail,
        subject: `New enquiry from ${data.name.trim().slice(0, 100)}`,
        html: notificationHtml,
      }),
      payload.sendEmail({
        to: data.email,
        subject: 'CSP - Your enquiry was received.',
        html: confirmationHtml,
      }),
    ])

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
