'use server'

import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Contact } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const EMAILS_DIR = path.join(process.cwd(), 'src/actions/emails')

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

function loadTemplate(filename: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (html, [key, val]) => html.replace(`{{${key}}}`, val),
    fs.readFileSync(path.join(EMAILS_DIR, filename), 'utf-8'),
  )
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

    const escapedName = escapeHtml(data.name)
    const escapedMessage = escapeHtml(data.message).replace(/\n/g, '<br />')
    const typeRow = data.enquiryType
      ? `<p><strong>Type:</strong> ${escapeHtml(data.enquiryType)}</p>`
      : ''
    const timeframeRow = data.timeframe
      ? `<p><strong>Timeframe:</strong> ${escapeHtml(data.timeframe)}</p>`
      : ''

    const [notificationHtml, confirmationHtml] = [
      loadTemplate('contact-notification.html', {
        name: escapedName,
        email: escapeHtml(data.email),
        typeRow,
        timeframeRow,
        message: escapedMessage,
      }),
      loadTemplate('contact-confirmation.html', {
        name: escapedName,
        typeRow,
        timeframeRow,
        message: escapedMessage,
        portfolioUrl: `${getServerSideURL()}/portfolio`,
      }),
    ]

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
