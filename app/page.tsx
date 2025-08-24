"use client";
import { useState } from "react";

export default function Page() {
  const [accepted, setAccepted] = useState(false);
  const [showDecline, setShowDecline] = useState(false);

  return (
    <main className="mx-auto max-w-xl p-6">
      {/* Price Gate */}
      {!accepted && (
        <section className="rounded-2xl border p-5 shadow-sm">
          <h1 className="mb-1 text-xl font-semibold">Estimated payout range</h1>
          <p className="mb-3 text-base">
            <strong>$175 – $300</strong>{" "}
            <span className="text-gray-600">
              (depends on year, model, condition, location)
            </span>
          </p>
          <p className="mb-4">Do you accept this estimated range?</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAccepted(true)}
              className="rounded-2xl border bg-black px-4 py-2 text-white shadow hover:opacity-90"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setShowDecline(true)}
              className="rounded-2xl border px-4 py-2 shadow"
            >
              No
            </button>
          </div>
          {showDecline && (
            <p className="mt-3 text-sm text-red-600">
              No problem. If your vehicle is not “junk”, please use our{" "}
              <a href="/not-junk" className="underline">
                Not Junk
              </a>{" "}
              page instead.
            </p>
          )}
        </section>
      )}

      {/* Lead Form (shows only after Yes) */}
      {accepted && (
        <form
          action="https://formspree.io/f/xyzplgoz" // 🔄 replace with your Formspree endpoint
          method="POST"
          encType="multipart/form-data"
          className="mt-6 rounded-2xl border p-5 shadow-sm"
        >
          {/* Hidden flag so you know they accepted the range */}
          <input type="hidden" name="accepted_range" value="true" />

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input
              name="phone"
              type="tel"
              required
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">
              Vehicle (Year / Make / Model)
            </label>
            <input
              name="vehicle"
              type="text"
              required
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Pickup ZIP / City</label>
            <input
              name="location"
              type="text"
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium">
              Photos (at least one)
            </label>
            <input
              name="photos"
              type="file"
              accept="image/*"
              multiple
              required
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl border bg-black py-3 text-white shadow hover:opacity-90"
          >
            Get My Offer
          </button>
        </form>
      )}
    </main>
  );
}
