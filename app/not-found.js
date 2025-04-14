'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-[#7FA15A]">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mt-4 text-lg text-gray-600">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#7FA15A] text-white rounded-lg hover:bg-[#6a8c4f] transition-colors"
          >
            Go Back
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-[#7FA15A] border border-[#7FA15A] rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link href="/contact" className="text-[#7FA15A] hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 