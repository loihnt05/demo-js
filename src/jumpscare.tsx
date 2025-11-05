import { motion, useAnimation } from "framer-motion";
import { Howl } from "howler";
import { useGlitch, type GlitchHandle } from "react-powerglitch";
import { useEffect } from "react";

export default function Jumpscare() {
  const controls = useAnimation();
  useEffect(() => {
    const run = async () => {
      const bg = new Howl({
        src: ["/scream.wav"],
        volume: 0.1,
        loop: false,
      });
      let playCount = 0;
      
      bg.on("end", () => {
        playCount++;
        if (playCount < 2) {
          bg.play(); // phát lại lần thứ 2
        }
      });
      bg.play();
      bg.fade(0.1, 5, 500);
      await controls.start({ opacity: 1, transition: { duration: 0.1 } });
      await controls.start({
        scale: 1.5,
        transition: { duration: 1, ease: "easeIn" },
      });

      await controls.start({
        opacity: [1, 0.5, 1],
        transition: { duration: 0.1, repeat: 30 },
      });

      await controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 },
      });
    };
    run();
  }, [controls]);
  return (
    <div className="fixed inset-0">
      <div className="relative w-full h-full overflow-hidden">
        {/* Background Image */}
        <motion.img
          src="/scare.jpg"
          alt="scary"
          initial={{ scale: 1, opacity: 0 }}
          animate={controls}
          className="w-full h-full object-cover"
        />

        {/* Flash layer */}
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={controls}
        />
      </div>
    </div>
  );
}

export function FaceInFog() {
  const glitch: GlitchHandle = useGlitch({});
  return (
    <div
      ref={glitch.ref}
      className="relative w-screen h-screen bg-black overflow-hidden"
    >
      {/* Lớp sương */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-gray-200/20 via-gray-100/10 to-gray-900/60"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Khuôn mặt */}
      <motion.img
        src="/ghost.png"
        className="absolute inset-0 w-full h-full object-cover opacity-0 blur-sm"
        animate={{
          opacity: [0, 0.2, 0.6, 1],
          filter: ["blur(10px)", "blur(5px)", "blur(2px)", "blur(0px)"],
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
      />
    </div>
  );
}

export function ErrorScreen() {
  useEffect(() => {
    const run = async () => {
      const bg = new Howl({ src: ["/glitch.wav"], volume: 0.5, loop: false });
      bg.play();
      setTimeout(() => {
        bg.stop();
      }, 4000);
    };
    run();
  }, []);
  const glitch: GlitchHandle = useGlitch({
    playMode: "manual",
  });

  // Trigger intense glitch after 3 seconds
  const controls = useAnimation();

  useEffect(() => {
    const triggerIntenseGlitch = async () => {
      // Wait 3 seconds with no effects
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Start glitch effect
      glitch.startGlitch();

      // Set intense glitch options - slower and creepier
      glitch.setOptions({
        playMode: "always",
        createContainers: true,
        hideOverflow: false,
        timing: {
          duration: 400,
          iterations: Infinity,
        },
        glitchTimeSpan: {
          start: 0,
          end: 0.6,
        },
        shake: {
          velocity: 8,
          amplitudeX: 0.3,
          amplitudeY: 0.3,
        },
        slice: {
          count: 5,
          velocity: 6,
          minHeight: 0.02,
          maxHeight: 0.2,
          hueRotate: true,
        },
      });

      // Add slow, creepy screen distortion
      await controls.start({
        x: [0, -5, 5, -8, 8, -3, 3, 0],
        opacity: [1, 0.7, 1, 0.8, 1, 0.9, 1],
        transition: { duration: 2, ease: "easeInOut" },
      });
    };

    triggerIntenseGlitch();
  }, [glitch, controls]);

  return (
    <motion.div
      animate={controls}
      className="relative w-screen h-screen bg-blue-500 overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      <div ref={glitch.ref} className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className="font-mono text-white"
        >
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 md:mb-8">:(</div>
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-5 md:mb-6">
            Your PC ran into a problem and needs to restart. We're just
            collecting some error info, and then we'll restart for you.
          </div>
          <div className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8">0% complete</div>
          <div className="text-xs sm:text-sm space-y-2">
            <div>
              For more information about this issue and possible fixes, visit
              https://www.windows.com/stopcode
            </div>
            <div className="mt-4 sm:mt-6 md:mt-8">
              If you call a support person, give them this info:
            </div>
            <div className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg">Stop code: CRITICAL_PROCESS_DIED</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
