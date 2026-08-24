import type { Metadata } from "next";
import {
  DM_Mono,
  Fragment_Mono,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Sans,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Martian_Mono,
  Newsreader,
  Sometype_Mono,
  Space_Mono,
  Spline_Sans_Mono,
} from "next/font/google";


const fragment = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--fp-fragment" });
const dm = DM_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--fp-dm" });
const spline = Spline_Sans_Mono({ subsets: ["latin"], variable: "--fp-spline" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--fp-jetbrains" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--fp-plexmono" });
const martian = Martian_Mono({ subsets: ["latin"], variable: "--fp-martian" });
const sometype = Sometype_Mono({ subsets: ["latin"], variable: "--fp-sometype" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--fp-geistmono" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--fp-spacemono" });

const geist = Geist({ subsets: ["latin"], variable: "--fp-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--fp-inter" });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--fp-instrumentsans" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--fp-plexsans" });

const newsreader = Newsreader({ subsets: ["latin"], variable: "--fp-newsreader" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--fp-instrumentserif" });

const ALL = [
  fragment,
  dm,
  spline,
  jetbrains,
  plexMono,
  martian,
  sometype,
  geistMono,
  spaceMono,
  geist,
  inter,
  instrumentSans,
  plexSans,
  newsreader,
  instrumentSerif,
];

export const metadata: Metadata = {
  title: "Type playground",
  robots: { index: false, follow: false },
};

export default function FontPlaygroundLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={ALL.map((f) => f.variable).join(" ")}>{children}</div>
  );
}
