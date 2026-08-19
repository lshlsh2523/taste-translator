import type { Metadata } from "next";
import localFont from "next/font/local";
import { Gowun_Batang, Instrument_Serif } from "next/font/google";
import "./globals.css";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

const gowunBatang = Gowun_Batang({
  variable: "--font-gowun-batang",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "이런 느낌, 뭐라고 부르지 — 이런느낌",
  description:
    "원하는 인상은 분명한데 부를 이름이 없어서 검색을 시작하지 못하는 사람들을 위해. 문장으로 설명하면, 그 취향에 이름을 붙여 실제 MCM 제품까지 연결합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${gowunBatang.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="flex min-h-svh flex-col">{children}</body>
    </html>
  );
}
