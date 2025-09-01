"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [estimate, setEstimate] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fallback weights
  const fallbackWeights: Record<string, number> = {
    "Dodge Intrepid": 3000,
    "Ford Econoline": 4500,
    "Toyota Camry": 3300,
    "Honda Accord": 3200,
  };

  // Levenshtein distance for suggestions
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = `${make} ${model}`;
    const weight = fallbackWeights[key] || 3500;
    const calculatedEstimate = Math.round(weight * 0.07);
    setEstimate(calculatedEstimate);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bucks4Buckets</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
          className="bg-orange-500 text-white p-3 rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Get Estimate
        </button>
      </form>

      {estimate > 0 && (
        <p className="mt-4 text-xl font-bold text-yellow-500">
          Estimated Offer: ${estimate}
        </p>
      )}

      <audio
        ref={audioRef}
        src="https://freesound.org/data/previews/522/522667_6341666-lq.mp3"
        preload="auto"
      />
    </main>
  );
}
