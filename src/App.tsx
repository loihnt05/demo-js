import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Jumpscare, { ErrorScreen } from "./jumpscare";

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
    <div >
      {
        started && <StartPage jumpscare={handleStart} />
      }
      {
        showError && !showScare && <ErrorScreen />
      }
      {
        showScare && <Jumpscare />
      }
    </div>
  );
}
export function StartPage({ jumpscare }: { jumpscare: () => void }) {
  return (
    <div className="flex flex-col gap-20 h-screen w-screen items-center justify-center">
      <h1 className="text-7xl font-bold">Welcome to my page</h1>
      <WiggleButton jumpscare={jumpscare} />
    </div>
  )
}
export function WiggleButton({ jumpscare }: { jumpscare: () => void }) {
  return (
      <motion.button
        whileHover={{
          rotate: [0, -5, 5, -5, 5, 0],
          transition: { duration: 0.4 },
        }}
        className="text-5xl py-10 font-bold px-10 rounded-full hover:cursor-pointer border-4 border-black bg-white text-black"
        onClick={jumpscare}
      >
        Play Game Now 😏
      </motion.button>
  );
}
