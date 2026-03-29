'use client'

import { FormEvent, useState } from 'react'
import './styles.css'

export function ContactForm() {
  const [inquiryType, setInquiryType] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <section className="contact-form-section">
        <div className="form-success visible" aria-live="polite">
          <p className="form-success-mark">*</p>
          <p className="form-success-headline">Message received.</p>
          <p className="form-success-sub">I&apos;ll be in touch within a couple of days.</p>
        </div>
      </section>
    )
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
            <option value="portrait">Portrait session</option>
            <option value="performance">Live event / performance</option>
            <option value="print">Print or custom order</option>
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
          <p className="form-submit-note">I&apos;ll reply within 48 hours.</p>
          <button type="submit" className="btn-submit">
            Send enquiry -&gt;
          </button>
        </div>
      </form>
    </section>
  )
}
