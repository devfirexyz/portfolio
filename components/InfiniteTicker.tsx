"use client";

import React from "react";

export function InfiniteTicker() {
  const items = [
    "CHAT 💬",
    "GET IN TOUCH 📪",
    "LET'S TALK ✨",
    "ANYTHING BUT TECH ALSO WORKS 🫵",
    "CHAT 💬",
    "GET IN TOUCH 📪",
    "LET'S TALK ✨",
    "ANYTHING BUT TECH ALSO WORKS 🫵",
    "CHAT 💬",
    "GET IN TOUCH 📪",
    "LET'S TALK ✨",
    "ANYTHING BUT TECH ALSO WORKS 🫵",
    "CHAT 💬",
    "GET IN TOUCH 📪",
    "LET'S TALK ✨",
    "ANYTHING BUT TECH ALSO WORKS 🫵",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#2c2b73] via-[#555cbc] to-[#2c2b73] py-6 sm:py-8">
      {/* Top fade gradient */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#5865F2]/20 to-transparent z-10" />

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#7289DA]/20 to-transparent z-10" />

      {/* Ticker container */}
      <div className="relative flex">
        {/* First set of items */}
        <div className="flex animate-ticker whitespace-nowrap">
          {items.map((item, index) => (
            <React.Fragment key={`first-${index}`}>
              <span
                style={{ fontFamily: "Alan Sans" }}
                className="text-white  font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl mx-6 sm:mx-8 md:mx-10 tracking-wider"
              >
                {item}
              </span>
              {/* {index < items.length - 1 && (
                <span className=" font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl mx-2">
                  🚀
                </span>
              )} */}
            </React.Fragment>
          ))}
        </div>

        {/* Duplicate set for seamless loop */}
        <div
          className="flex animate-ticker whitespace-nowrap"
          aria-hidden="true"
        >
          {items.map((item, index) => (
            <React.Fragment key={`second-${index}`}>
              <span
                style={{ fontFamily: "Alan Sans" }}
                className="text-white font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl mx-6 sm:mx-8 md:mx-10 tracking-wider"
              >
                {item}
              </span>
              {/* {index < items.length - 1 && (
                <span className=" font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl mx-2">
                  🚀
                </span>
              )} */}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
