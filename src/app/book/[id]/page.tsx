"use client"; // <-- This tells Next.js this is an interactive component

import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Fetch the service data when the page loads
  useEffect(() => {
    async function fetchService() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error && data) setService(data);
      setIsLoading(false);
    }
    fetchService();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    // Combine date and time into a single ISO string
    const startTime = new Date(`${date}T${time}`);
    // Calculate the end time based on the service duration
    const endTime = new Date(startTime.getTime() + service.duration_minutes * 60000);

    const { error } = await supabase.from('appointments').insert({
      service_id: service.id,
      customer_name: customerName,
      customer_email: customerEmail,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    });

    if (error) {
      alert("Error booking: Sorry, this time slot is already booked. Please choose another time." + error.message);
      setIsSubmitting(false);
    } else {
      // Redirect to a success page (we'll build this next)
      router.push('/success');
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!service) return <div className="p-8 text-center">Service not found.</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to services
        </Link>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Book {service.name}</h1>
          <p className="text-slate-500 mb-6">{service.description}</p>
          
          <div className="bg-slate-50 p-4 rounded-lg mb-6 flex justify-between text-slate-700 font-medium">
            <span>⏱ {service.duration_minutes} mins</span>
            <span>💰 ₱{(service.price / 100).toFixed(2)}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <input 
                type="text" 
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Email</label>
              <input 
                type="email" 
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                placeholder="john@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <input 
                  type="time" 
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 font-medium"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}