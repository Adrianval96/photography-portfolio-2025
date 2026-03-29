'use client'

import type { ServiceItem } from '@/payload-types'
import { FormEvent, useState } from 'react'
import './styles.css'

type Props = {
  serviceItems: Pick<ServiceItem, 'id' | 'title'>[]
}

export function ContactForm({ serviceItems }: Props) {
  const [inquiryType, setInquiryType] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }
  return (
    <section className="contact-form-section">
      <form id="contact-form" noValidate onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              className="form-input"
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-input"
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="inquiry-type">
            Type of enquiry <span>(optional)</span>
          </label>
          <select
            className={`form-select${inquiryType ? ' has-value' : ''}`}
            id="inquiry-type"
            name="inquiry_type"
            value={inquiryType}
            onChange={(event) => setInquiryType(event.target.value)}
          >
            <option value="" disabled>
              Select one
            </option>
            {serviceItems.map(({ id, title }) => (
              <option key={id} value={title}>
                {title}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="timeframe">
            Timeframe <span>(optional)</span>
          </label>
          <input
            className="form-input"
            type="text"
            id="timeframe"
            name="timeframe"
            placeholder="e.g. Late May, flexible, ASAP"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="message">
            Tell me about the project
          </label>
          <textarea
            className="form-textarea"
            id="message"
            name="message"
            placeholder="What are you shooting for, what matters, what would make this good?"
            required
          />
        </div>

        <div className="form-submit-row">
          <button type="submit" className="btn-submit">
            Send enquiry -&gt;
          </button>
        </div>
      </form>
    </section>
  )
}
