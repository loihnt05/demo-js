import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Jumpscare, { ErrorScreen } from "./jumpscare";

function BitcoinBackground() {
  const bitcoins = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    duration: `${8 + Math.random() * 8}s`,
    size: `${50 + Math.random() * 60}px`,
    opacity: 0.08 + Math.random() * 0.12, // More visible
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Clean white/light background similar to bitcoin.org */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-orange-50/20 to-white" />

      {/* Floating Bitcoin symbols with more visible animations */}
      {bitcoins.map((bitcoin) => (
        <motion.div
          key={bitcoin.id}
          className="absolute font-bold pointer-events-none"
          style={{
            left: bitcoin.left,
            top: bitcoin.top,
            fontSize: bitcoin.size,
            color: "#f7931a", // Bitcoin orange color
            opacity: bitcoin.opacity,
          }}
          animate={{
            y: [-40, 40], // Larger movement
            x: [-30, 30], // Larger movement
            rotate: [-15, 15], // More visible rotation
            scale: [0.9, 1.2, 0.9], // More noticeable scaling
          }}
          transition={{
            duration: parseFloat(bitcoin.duration),
            delay: parseFloat(bitcoin.animationDelay),
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
        >
          ₿
        </motion.div>
      ))}

      {/* Animated orange accent circles */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-500/5"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-orange-400/5"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-orange-50/20" />
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showScare, setShowScare] = useState(false);
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowScare(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleStart = () => {
    setStarted(false);
    setShowError(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BitcoinBackground />
      <div className="relative z-10">
        {started && (
          <div className="absolute">
            <SoundController />
          </div>
        )}
        {started && <StartPage jumpscare={handleStart} />}
        {showError && !showScare && <ErrorScreen />}
        {showScare && <Jumpscare />}
      </div>
    </div>
  );
}
export function StartPage({ jumpscare }: { jumpscare: () => void }) {
  return (
    <div className="flex flex-col gap-8 md:gap-20 h-screen w-screen items-center justify-center px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center">Welcome to Bitcoin</h1>
      <WiggleButton jumpscare={jumpscare} />
    </div>
  );
}
export function WiggleButton({ jumpscare }: { jumpscare: () => void }) {
  return (
    <motion.button
      whileHover={{
        rotate: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.4 },
      }}
      className="text-xl sm:text-2xl md:text-3xl lg:text-5xl py-4 sm:py-6 md:py-8 lg:py-10 font-bold px-6 sm:px-8 md:px-10 rounded-full hover:cursor-pointer border-2 sm:border-3 md:border-4 border-black bg-white text-black"
      onClick={jumpscare}
    >
      Mine Bitcoin Now Bro😏
    </motion.button>
  );
}

export function SoundController() {
  const [isPlaying, setIsPlaying] = useState(true);
  const soundRef = useRef<Howl | null>(null);

  // Initialize Howl only once
  if (!soundRef.current) {
    soundRef.current = new Howl({
      src: ["/sound1.wav"],
      volume: 0.8,
      loop: true, // will toggle dynamically
    });
  }
  useEffect(() => {
    const sound = soundRef.current!;
    sound.loop(true); // Ensure looping is set
    if (isPlaying) {
      sound.play();
    } else {
      sound.pause();
    }
    return () => {
      sound.stop();
    };
  }, [isPlaying]);

  const togglePlay = () => {
    const sound = soundRef.current!;
    if (isPlaying) {
      sound.pause(); // stop() resets position; pause() just halts playback
    } else {
      sound.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col gap-3 mt-4 md:mt-8 ml-4 md:ml-0">
      <div className="flex gap-3">
        <button
          onClick={togglePlay}
          className="px-2 py-2 md:px-4 text-white rounded-lg hover:opacity-80 hover:cursor-pointer text-3xl md:text-4xl lg:text-5xl"
        >
          {isPlaying ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
}
