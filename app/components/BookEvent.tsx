'use client'
import { createBooking } from '@/lib/actions/booking.actions';
import posthog from 'posthog-js';
import React, { useState } from 'react'

const BookEvent = ({eventId, slug}: {eventId: string; slug: string}) => {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e : React.FormEvent) =>{
        const {success} = await createBooking({eventId, slug, email});

        if(success){
            setSubmitted(true);
            posthog.capture('event_booked', {eventId, slug, email} );
        }
        else{
            console.error('Booking failed');
            posthog.captureException('Booking failed:');
        }
        
    }
  return (
    <div id="book-event">
        {submitted ? (
            <p className='text-sm'>Thank you for booking!</p>
        ) : (
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
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