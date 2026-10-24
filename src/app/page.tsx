import Link from 'next/link';
import { supabase } from './lib/supabase';

// This is a Server Component. It runs on the server, not in the browser!
export default async function Home() {
  // Fetch data from the 'services' table
  const { data: services, error } = await supabase
    .from('services')
    .select('*');

  if (error) {
    return <div className="p-8 text-red-500">Error loading services: {error.message}</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">BookApp</h1>
        <p className="text-slate-600 mb-8">Select a service to book an appointment.</p>

        <div className="grid gap-4">
         {services?.map((service) => (
  <Link href={`/book/${service.id}`} key={service.id} className="block group">
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group-hover:border-blue-500 transition-colors">
      <h2 className="text-xl font-semibold text-slate-900">{service.name}</h2>
      <p className="text-slate-500 mt-1">{service.description}</p>
      <div className="mt-4 flex gap-4 text-sm font-medium text-slate-700">
        <span>⏱ {service.duration_minutes} mins</span>
        <span>💰 ₱{(service.price / 100).toFixed(2)}</span>
      </div>
    </div>
  </Link>
))}
        </div>
      </div>
    </main>
  );
}