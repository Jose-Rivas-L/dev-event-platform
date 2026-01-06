'use client'
import React, { useState } from 'react'

const BookEvent = () => {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e : React.FormEvent) =>{
        e.preventDefault();
        // Here you can handle the booking logic, e.g., send the email to the server
        setSubmitted(true);
    }
  return (
    <div id="book-event">
        {submitted ? (
            <p className='text-sm'>Thank you for booking!</p>
        ) : (
            <form onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
            }}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        id="email"
                        required
                    />
                </div>
                <button type="submit" className="button-submit">Book Now</button>
            </form>
        )}
    </div>
  )
}

export default BookEvent