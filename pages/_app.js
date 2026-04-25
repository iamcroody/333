import "../styles/globals.css";
import { AnimatePresence, motion } from "framer-motion";
import { Inter, JetBrains_Mono } from "next/font/google";
import Menu333 from "../components/Menu333";

import Head from "next/head";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <title>José Jiménez</title>
        <link rel="icon" type="image/x-icon" href="/logos/logo-huevo.ico" />
      </Head>
      <div className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen font-sans text-foreground bg-background relative overflow-hidden`}>
      
      {/* Fondo Global Cohesivo "Cyber-Luxe" */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vh] bg-purple-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vh] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <Menu333 />

      <div className="relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          <Component {...pageProps} key={router.asPath} />
        </AnimatePresence>
      </div>
    </div>
    </>
  );
}
