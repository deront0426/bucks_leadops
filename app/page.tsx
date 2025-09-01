import { useState, useRef } from 'react';
import LeadOps from "./components/LeadOps";

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Bucks4Buckets</h1>
      <p>Click below to see the typical junk-car range.</p>

      <LeadOps />
    </main>
  );
}

    )}

    {/* Your existing form stays here exactly as it is */}
    <form>...</form>
  </>
);
"use client";
import { useState, useRef } from "react";

export default function Page() {
  // === Modal & Estimate State ===
  const [modalOpen, setModalOpen] = useState(false);
  const [estimate, setEstimate] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fallback weights
  const fallbackWeights: Record<string, number> = {
    "Dodge Intrepid": 3000,
    "Ford Econoline": 4500,
    "Toyota Camry": 3300,
    "Honda Accord": 3200,
  };

  // === Levenshtein for suggestions ===
  const levenshteinDistance = (a: string, b: string) => {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + (b[i - 1] === a[j - 1] ? 0 : 1)
        );
      }
    }
    return matrix[b.length][a.length];
  };

  const handleModelChange = (input: string) => {
    let closest = "";
    let minDistance = Infinity;
    Object.keys(fallbackWeights).forEach((key) => {
      const modelPart = key.split(" ")[1].toLowerCase();
      const distance = levenshteinDistance(input.toLowerCase(), modelPart);
      if (distance < minDistance) {
        minDistance = distance;
        closest = key;
      }
    });
    if (minDistance <= 3) setSuggestion(`Did you mean: ${closest}?`);
    else setSuggestion("");
  };

  // === Form Submit ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = `${make} ${model}`;
    const weight = fallbackWeights[key] || 3500;
    const calculatedEstimate = Math.round(weight * 0.07);
    setEstimate(calculatedEstimate);
    setModalOpen(true);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    setTimeout(() => setModalOpen(false), 5000);
  };

  return (
    <>
      {/* ===== MODAL (added above your form) ===== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-11/12 max-w-md rounded-2xl overflow-hidden shadow-2xl transform animate-slideUp">
            <video
              autoPlay
              muted
              loop
              className="absolute w-full h-full object-cover z-0"
            >
              <source
                src="https://cdn.pixabay.com/vimeo/504466348/driving-car-1920.mp4"
                type="video/mp4"
              />
            </video>
            <div className="relative z-10 bg-black/60 text-center p-10">
              <span
                className="absolute top-4 right-4 text-white text-2xl font-bold cursor-pointer"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </span>
              <img
                src="https://i.imgur.com/yourlogo.png"
                alt="Bucks for Buckets"
                className="mx-auto mb-4 w-28"
              />
              <h2 className="text-white text-2xl font-bold mb-4">
                Your Junk Car Estimate
              </h2>
              <p className="text-yellow-400 text-4xl font-extrabold mb-2 animate-glow">
                ${estimate}
              </p>
              <p className="text-yellow-300 text-base animate-pulse">
                Your offer may vary ±$20
              </p>
              <audio
                ref={audioRef}
                src="https://freesound.org/data/previews/522/522667_6341666-lq.mp3"
                preload="auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* ===== YOUR EXISTING FORM (kept as-is) ===== */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto mt-10">
        <input
          type="text"
          placeholder="Make"
          required
          className="p-3 rounded-lg border border-gray-300"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
        <input
          type="text"
          placeholder="Model"
          required
          className="p-3 rounded-lg border border-gray-300"
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            handleModelChange(e.target.value);
          }}
        />
        {suggestion && (
          <p
            className="text-yellow-400 cursor-pointer"
            onClick={() => {
              const parts = suggestion.replace("Did you mean: ", "").split(" ");
              setMake(parts[0]);
              setModel(parts[1]);
              setSuggestion("");
              handleSubmit(new Event("submit") as any);
            }}
          >
            {suggestion}
          </p>
        )}
        <input
          type="number"
          placeholder="Year"
          required
          className="p-3 rounded-lg border border-gray-300"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Get Estimate
        </button>
      </form>

      {/* ===== Tailwind Animations ===== */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.7s forwards;
        }
        @keyframes glow {
          0% {
            text-shadow: 0 0 10px #fff, 0 0 20px #ffdd00;
          }
          100% {
            text-shadow: 0 0 20px #fff, 0 0 40px #ffdd00;
          }
        }
        .animate-glow {
          animation: glow 1.5s infinite alternate;
        }
        @keyframes pulse {
          0% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-pulse {
          animation: pulse 1s infinite alternate;
        }
      `}</style>
    </>
  );
}
