import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-md text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
        <p className="text-slate-600 mb-6">
          Your appointment has been successfully booked. We will send a confirmation to your email shortly.
        </p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Back to Home
        </Link>
      </div>
    </main>
  );
}