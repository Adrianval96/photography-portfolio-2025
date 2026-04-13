'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { submitContactForm } from '@/actions/submitContactForm'
import './styles.css'

type EnquiryType = {
  id: number
  title: string
}

type FormValues = {
  name: string
  email: string
  enquiryType: string
  timeframe: string
  message: string
}

type Props = {
  enquiryTypes: EnquiryType[]
}

export function ContactForm({ enquiryTypes }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>()

  const enquiryTypeValue = watch('enquiryType')

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null)
    const result = await submitContactForm(data)
    if (result.success) {
      setSubmitted(true)
    } else {
      setSubmitError(result.error)
    }
  }

  if (submitted) {
    return (
      <div className="contact-form__success" aria-live="polite">
        <p className="contact-form__success-mark">✦</p>
        <p className="contact-form__success-headline">Message received.</p>
        <p className="contact-form__success-sub">I&apos;ll be in touch within a couple of days.</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="contact-form__row">
        <div className="contact-form__group">
          <label className="contact-form__label" htmlFor="name">
            Name
          </label>
          <input
            className="contact-form__input"
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            {...register('name', { required: 'Name is required.' })}
          />
          {errors.name && <p className="contact-form__field-error">{errors.name.message}</p>}
        </div>
        <div className="contact-form__group">
          <label className="contact-form__label" htmlFor="email">
            Email
          </label>
          <input
            className="contact-form__input"
            id="email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            {...register('email', {
              required: 'Email is required.',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email.' },
            })}
          />
          {errors.email && <p className="contact-form__field-error">{errors.email.message}</p>}
        </div>
      </div>

      <div className="contact-form__group">
        <label className="contact-form__label" htmlFor="enquiryType">
          Type of enquiry <span>(optional)</span>
        </label>
        <select
          className={`contact-form__select${enquiryTypeValue ? ' contact-form__select--has-value' : ''}`}
          id="enquiryType"
          {...register('enquiryType')}
        >
          <option value="">Select one</option>
          {enquiryTypes.map(({ id, title }) => (
            <option key={id} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      <div className="contact-form__group">
        <label className="contact-form__label" htmlFor="timeframe">
          Timeframe <span>(optional)</span>
        </label>
        <input
          className="contact-form__input"
          id="timeframe"
          type="text"
          placeholder="e.g. Late May, flexible, ASAP"
          {...register('timeframe')}
        />
      </div>

      <div className="contact-form__group">
        <label className="contact-form__label" htmlFor="message">
          Tell me about the project
        </label>
        <textarea
          className="contact-form__textarea"
          id="message"
          placeholder="What are you shooting for, what matters, what would make this good?"
          {...register('message', { required: 'Please tell me about the project.' })}
        />
        {errors.message && <p className="contact-form__field-error">{errors.message.message}</p>}
      </div>

      {submitError && <p className="contact-form__submit-error">{submitError}</p>}

      <div className="contact-form__submit-row">
        <p className="contact-form__submit-note">I&apos;ll reply within 48 hours.</p>
        <button type="submit" className="contact-form__submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send enquiry →'}
        </button>
      </div>
    </form>
  )
}
