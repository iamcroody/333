// pages/_app.js
import "../styles/globals.css";
import React, { useEffect, useState } from "react";
import { Howler } from "howler";

export default function MyApp({ Component, pageProps }) {
  const [hackerMode, setHackerMode] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // 1. Intelligent Localization
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        if (data.city && data.country_name) {
          console.log(`%c[sys-info]: Uplink established. Greetings from ${data.city}, ${data.country_name}.`, "color: #a855f7; font-family: monospace;");
          setLocation(data);
        }
      })
      .catch(() => {});

    // 2. DevTools Detection & Hacker Mode
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      if (widthDiff || heightDiff) {
        if (!window.devtoolsDetected) {
          window.devtoolsDetected = true;
          console.log("%c[iamcroody-os]: Detecting intrusion... Access granted to kernel debug mode.", "color: #00FF00; font-weight: bold; font-size: 14px; font-family: monospace;");
          setHackerMode(true);
        }
      } else {
        window.devtoolsDetected = false;
        setHackerMode(false);
      }
    };

    window.addEventListener('resize', detectDevTools);
    detectDevTools();

    return () => {
      window.removeEventListener('resize', detectDevTools);
    };
  }, []);

  return (
    <div className={hackerMode ? "hacker-theme" : ""}>
      {location && (
        <div className="fixed bottom-2 right-2 text-[10px] text-purple-500/30 font-mono z-[9999] pointer-events-none">
          SYS_NODE: {location.city?.toUpperCase()} // IP_TRACKING: DISABLED
        </div>
      )}
      <Component {...pageProps} />
    </div>
  );
}
