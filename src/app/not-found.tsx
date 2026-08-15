import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="font-gondi text-4xl text-gold-400">𑴎</p>
      <h1 className="mt-3 font-display text-3xl text-cream-50">Not found</h1>
      <p className="mt-2 font-deva text-cream-200/80">यह प्रविष्टि नहीं मिली।</p>
      <Link href="/" className="mt-6 inline-block text-gold-300 underline-offset-2 hover:underline">
        ← Home
      </Link>
    </div>
  );
}
