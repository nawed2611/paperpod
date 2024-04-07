import {
  Comfortaa as FontComfortaa,
  Playfair_Display_SC as FontDisplay,
  JetBrains_Mono as FontMono,
  Inter as FontSans,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontDisplay = FontDisplay({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
});

export const fontComfortaa = FontComfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});
