"use client";

export default function Page() {
  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bucks4Buckets</h1>
      <p className="mb-6">Fill out the form below and we’ll get back to you!</p>

      <form
        action="https://formspree.io/f/your-form-id"
        method="POST"
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          className="p-3 rounded-lg border border-gray-300"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          className="p-3 rounded-lg border border-gray-300"
        />

        <input
          type="text"
          name="carMake"
          placeholder="Car Make"
          required
          className="p-3 rounded-lg border border-gray-300"
        />

        <input
          type="text"
          name="carModel"
          placeholder="Car Model"
          required
          className="p-3 rounded-lg border border-gray-300"
        />

        <input
          type="number"
          name="carYear"
          placeholder="Car Year"
          required
          className="p-3 rounded-lg border border-gray-300"
        />

        <textarea
          name="message"
          placeholder="Additional Info (optional)"
          className="p-3 rounded-lg border border-gray-300"
        />

        <button
          type="submit"
          className="bg-orange-500 text-white p-3 rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
