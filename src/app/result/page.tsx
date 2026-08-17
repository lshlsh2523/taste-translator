import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultView } from "@/components/ResultView";

export const metadata: Metadata = {
  title: "취향 결과 — 이런느낌",
  description: "취향 용어와 럭셔리 용어, 실제 MCM 제품까지 연결한 결과입니다.",
};

export default function ResultPage() {
  return (
    <Suspense fallback={null}>
      <ResultView />
    </Suspense>
  );
}
