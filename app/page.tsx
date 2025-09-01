{modalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
    <div className="relative w-11/12 max-w-md rounded-3xl overflow-hidden shadow-2xl border border-yellow-400 border-opacity-50 transform animate-scaleUp">
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
        {/* Optional: floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-yellow-400/10 via-red-400/10 to-transparent animate-floatParticles"></div>
        </div>
      </div>
    </div>
  </div>
)}

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

  @keyframes floatParticles {
    0% { background-position: 0 0; }
    100% { background-position: 100% -100%; }
  }
  .animate-floatParticles {
    animation: floatParticles 10s linear infinite;
  }
`}</style>
