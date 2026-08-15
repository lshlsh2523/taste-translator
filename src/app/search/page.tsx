import type { Metadata } from "next";
import { SearchForm } from "@/components/SearchForm";

export const metadata: Metadata = {
  title: "내 취향 찾기 — 이런느낌",
  description: "원하는 느낌을 문장으로 설명해주세요.",
};

export default function SearchPage() {
  return <SearchForm />;
}
