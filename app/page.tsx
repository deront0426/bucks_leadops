"use client";

import { useState, useRef, useEffect } from "react";
import LeadOps from "./components/LeadOps";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [estimate, setEstimate] = useState(0);
  const [displayEstimate, setDisplayEstimate] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const fallbackWeights: Record<string, number> = {
    "Dodge Intrepid": 3000,
    "Ford Econoline": 4500,
    "Toyota Camry": 3300,
    "Honda Accord": 3200,
  };

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

  const fetchAvailableModels = async (make: string, year: string) => {
    try {
      const res = await fetch(
        `https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=${make.toLowerCase()}&year=${year}&sold_in_us=1`
      );
      const text = await res.text();
      const jsonText = text.replace(/^.*?\(/, "").replace(/\);$/, "");
      const data = JSON.parse(jsonText);
      const models = data.Trims.map((t: any) => t.model);
      setAvailableModels(models);
    } catch (err) {
      console.warn("Failed to fetch models");
      setAvailableModels([]);
    }
  };

  useEffect(() => {
    if (make && year) fetchAvailableModels(make, year);
  }, [make, year]);

  const handleModelChange = (input: string) => {
    if (!availableModels.length) {
      setSuggestion("");
      return;
    }
    let closest = "";
    let minDistance = Infinity;
    availableModels.forEach((m) => {
      const distance = levenshteinDistance(input.toLowerCase(), m.toLowerCase());
      if (distance < minDistance) {
        minDistance = distance;
        closest = m;
      }
    });
    if (minDistance <= 3) setSuggestion(`Did you mean: ${closest}?`);
    else setSuggestion("");
  };

  const fetchVehicleWeight = async (make: string, model: string, year: string) => {
    try {
      const res = await fetch(
        `https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=${make.toLowerCase()}&year=${year}&sold_in_us=1`
      );
      const text = await res.text();
      const jsonText = text.replace(/^.*?\(/, "").replace(/\);$/, "");
      const data = JSON.parse(jsonText);
      const match = data.Trims.find(
        (t: any) => t.model.toLowerCase() === model.toLowerCase()
      );
      if (match && match.weight_kg) return parseInt(match.weight_kg) * 2.20462;
    } catch (err) {
      console.warn("API failed, using fallback");
    }
    return fallbackWeights[`${make} ${model}`] || 3500;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const weight = await fetchVehicleWeight(make, model, year);
    const calculatedEstimate = Math.round(weight * 0.07);
    setEstimate(calculatedEstimate);
    setDisplayEstimate(0);
    setModalOpen(true);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    // Count-up animation
    let start = 0;
    const increment = Math.ceil(calculatedEstimate / 50);
    const counter = setInterval(() => {
      start += increment;
      if (start >= calculatedEstimate) {
        start = calculatedEstimate;
        clearInterval(counter);
      }
      setDisplayEstimate(start);
    }, 20);

    setLoading(false);
    setTimeout(() => setModalOpen(false), 5000);
  };

  return (
    <>
      {/* ===== Animated Driving Background ===== */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover filter blur-sm opacity-50"
        >
          <source
            src="https://cdn.pixabay.com/vimeo/504466348/driving-car-1920.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* ===== MODAL ===== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-11/12 max-w-md rounded-3xl overflow-hidden shadow-2xl border border-yellow-400 border-opacity-50 transform animate-scaleUp">
            <div className="relative z-10 bg-black/70 p-10 text-center rounded-3xl">
              <span
                className="absolute top-4 right-4 text-white text-2xl font-bold cursor-pointer hover:text-red-500 transition-colors"
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
                ${displayEstimate}
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

      {/* ===== FORM ===== */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex flex-col gap-3 max-w-md mx-auto mt-10 p-6 bg-black/30 rounded-xl backdrop-blur-md"
      >
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
              setModel(suggestion.replace("Did you mean: ", ""));
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
          {loading ? "Loading..." : "Get Estimate"}
        </button>
      </form>

      {/* ===== LeadOps Component ===== */}
      <LeadOps />

      {/* ===== Tailwind Animations ===== */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes scaleUp {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleUp {
          animation: scaleUp 0.6s ease-out forwards;
        }

        @keyframes glow {
          0% { text-shadow: 0 0 10px #fff, 0 0 20px #ffdd00; }
          100% { text-shadow: 0 0 20px #fff, 0 0 40px #ffdd00; }
        }
        .animate-glow {
          animation: glow 1.5s infinite alternate;
        }

        @keyframes pulse {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        .animate-pulse {
          animation: pulse 1s infinite alternate;
        }
      `}</style>
    </>
  );
}
