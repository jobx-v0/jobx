import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ReactTypingEffect from "react-typing-effect";

import ColorPaletteProvider from "./ColorPaletteProvider";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentPalette, setCurrentPalette] = useState("default");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ColorPaletteProvider>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] relative overflow-hidden font-inter">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100%" height="100%" fill="var(--color-background)" />
            <path d="M0 0L100 0C50 0 0 50 0 100Z" fill="var(--color-accent)" />
            <circle cx="85%" cy="20%" r="15%" fill="var(--color-accent)" />
            <path
              d="M100 100C50 100 0 50 0 0V100H100Z"
              fill="var(--color-surface)"
            />
          </svg>
        </div>

        <div className="relative z-10">
          <header
            className={`fixed w-full z-50 transition-all duration-300 ${
              scrollY > 20
                ? "bg-[var(--color-background)] bg-opacity-90 shadow-lg"
                : ""
            }`}
          >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1
                className={`text-3xl font-bold ${
                  currentPalette === "default" ||
                  currentPalette === "blue" ||
                  currentPalette === "green"
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-primary)]"
                }`}
              >
                Ruthi
              </h1>
              <nav className="space-x-4">
                <a
                  href="/employers"
                  className="hover:text-[var(--color-primary)] transition"
                >
                  For Employers
                </a>
                <a
                  href="#"
                  className="hover:text-[var(--color-primary)] transition"
                >
                  For Job Seekers
                </a>
                <a
                  href="#"
                  className="bg-[var(--color-primary)] text-[var(--color-text)] px-4 py-2 rounded hover:bg-opacity-90 transition"
                >
                  Login
                </a>
              </nav>
            </div>
          </header>

          <main>
            <Hero />
            <Features />
            <HowItWorks />
            <Stats />
            <CTA />
          </main>

          <footer className="bg-[var(--color-surface)] py-8 mt-20">
            <div className="container mx-auto px-4 text-center text-[var(--color-text)]">
              <p>&copy; 2024 Ruthi. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </ColorPaletteProvider>
  );
};

const Hero = () => {
  const typingPhrases = [
    "hire faster",
    "automate interviews",
    "find top talent",
    "reduce hiring costs",
    "improve candidate experience",
    "streamline recruitment",
  ];

  return (
    <section className="py-32 px-4 relative">
      <div className="container mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-4 text-[var(--color-text)]"
        >
          Ruthi helps you to{" "}
          <span className="text-[var(--color-primary)]">
            <ReactTypingEffect
              text={typingPhrases}
              speed={100}
              eraseSpeed={100}
              typingDelay={1000}
              eraseDelay={2000}
            />
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl mb-8 text-[var(--color-text)] max-w-2xl mx-auto"
        >
          Ruthi combines AI-powered interviews with expertly vetted profiles to
          revolutionize your hiring process.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-[var(--color-primary)] text-[var(--color-text)] px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition"
        >
          Get Started
        </motion.button>
      </div>
    </section>
  );
};

const Features = () => (
  <section className="py-20 px-4 bg-[var(--color-surface)]">
    <div className="container mx-auto">
      <h3 className="text-3xl font-bold mb-12 text-center text-[var(--color-text)]">
        Our Key Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <FeatureCard
          icon="🤖"
          title="AI-Based Interviews"
          description="Streamline initial screenings with our advanced AI interview system, saving time and resources."
        />
        <FeatureCard
          icon="✅"
          title="Expertly Vetted Profiles"
          description="Access thoroughly verified and curated candidate profiles, ensuring quality applicants."
        />
        <FeatureCard
          icon="🎯"
          title="Precision Skill Matching"
          description="Our algorithm matches candidates' skills precisely with your job requirements."
        />
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="bg-[var(--color-background)] p-6 rounded-lg shadow-xl text-center"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-[var(--color-text)]">
        {title}
      </h3>
      <p className="text-[var(--color-text)]">{description}</p>
    </motion.div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Post a Job",
      description: "Easily create and post your job listing",
    },
    {
      number: "2",
      title: "AI Screening",
      description: "Our AI conducts initial candidate screenings",
    },
    {
      number: "3",
      title: "Review Matches",
      description: "Evaluate top matches selected by our algorithm",
    },
    {
      number: "4",
      title: "Hire",
      description: "Connect with and hire your ideal candidate",
    },
  ];

  return (
    <section className="py-20 px-4 bg-[var(--color-background)]">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-center text-[var(--color-text)]">
          How Ruthi Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Step = ({ number, title, description }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="bg-[var(--color-primary)] text-[var(--color-text)] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        {number}
      </div>
      <h4 className="font-semibold mb-2 text-[var(--color-text)]">{title}</h4>
      <p className="text-sm text-[var(--color-text)]">{description}</p>
    </motion.div>
  );
};

const Stats = () => (
  <section className="py-20 px-4 bg-[var(--color-surface)]">
    <div className="container mx-auto">
      <h3 className="text-3xl font-bold mb-12 text-center text-[var(--color-text)]">
        Why Choose Ruthi?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Stat number="80%" description="Time saved in hiring process" />
        <Stat number="95%" description="Employer satisfaction rate" />
        <Stat number="10,000+" description="Successful placements" />
        <Stat number="24/7" description="AI-powered support" />
      </div>
    </div>
  </section>
);

const Stat = ({ number, description }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">
        {number}
      </div>
      <p className="text-[var(--color-text)]">{description}</p>
    </motion.div>
  );
};

const CTA = () => (
  <section className="py-20 px-4 bg-[var(--color-background)]">
    <div className="container mx-auto text-center">
      <h3 className="text-3xl font-bold mb-4 text-[var(--color-text)]">
        Ready to Transform Your Hiring?
      </h3>
      <p className="mb-8 text-lg text-[var(--color-text)]">
        Join thousands of companies finding their ideal candidates through
        Ruthi.
      </p>
      <button className="bg-[var(--color-primary)] text-[var(--color-text)] px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition">
        Start Free Trial
      </button>
    </div>
  </section>
);

export default LandingPage;
