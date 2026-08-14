import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="font-gondi text-4xl text-forest-600">𑴎</p>
      <h1 className="mt-3 font-display text-3xl">Not found</h1>
      <p className="mt-2 font-deva">यह प्रविष्टि नहीं मिली।</p>
      <Link href="/" className="mt-6 inline-block text-terracotta-600">
        ← Home
      </Link>
    </div>
  );
}
