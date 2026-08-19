import Link from "next/link";
import { CatReveal } from "@/components/CatReveal";
import { nameTags } from "@/data/name-tags";

export default function Home() {
  return (
    // "스크롤 없이 한 화면" 디자인은 홈 화면 전용 — 예전엔 이게
    // body(전역 레이아웃)에 걸려있어서 /result처럼 내용이 긴 페이지도
    // 같이 스크롤이 막혀버렸다. 홈 페이지 안에서만 적용되게 이동.
    <div className="flex min-h-svh flex-1 flex-col lg:h-svh lg:overflow-hidden">
      <main className="relative flex flex-1 flex-col overflow-hidden lg:flex-row lg:items-stretch">
        <section className="flex shrink-0 flex-col justify-center pt-12 pr-5 pb-8 pl-7 sm:pr-8 sm:pl-12 lg:w-[40%] lg:py-0 lg:pr-8 lg:pl-12 xl:pr-12 xl:pl-16">
          <div className="max-w-[560px]">
            <h1 className="reveal reveal-1 font-headline text-ink text-[3.25rem] leading-[1.12] font-bold tracking-[-0.02em] whitespace-nowrap sm:text-[3.75rem] lg:text-[3.5rem] xl:text-[4.25rem]">
              이런 느낌,
              <br />
              뭐라고 부르지
            </h1>

            <p className="reveal reveal-2 text-ink-soft mt-10 text-[1.1875rem] leading-[1.75] sm:text-[1.3125rem] lg:mt-12 lg:text-[1.375rem]">
              원하는 인상은 분명한데 부를 이름이 없어서
              <br />
              검색을 시작하지 못하는 사람들을 위해.
              <br />
              <br />
              문장으로 설명하면, 그 취향에 이름을 붙여
              <br />
              실제 MCM 제품까지 연결합니다.
            </p>

            <Link
              href="/search"
              className="reveal reveal-3 bg-ink text-paper focus-visible:outline-ink mt-12 inline-flex w-fit items-center gap-3 px-9 py-5 text-[1.125rem] font-medium tracking-[-0.01em] transition-colors duration-200 hover:bg-transparent hover:text-ink hover:outline hover:outline-1 hover:outline-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:mt-14"
            >
              내 취향 찾기
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <CatReveal nameTags={nameTags} />
      </main>

      <footer className="border-hairline shrink-0 border-t px-6 py-4 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-16 xl:px-20">
        <p className="text-ink-faint text-center text-[0.8125rem] leading-normal lg:text-left">
          이 서비스는 MCM 공식 서비스가 아니며, 학생 프로젝트로 제작되었습니다.
        </p>
        <p className="text-ink-faint mt-2 text-center text-[0.8125rem] leading-normal lg:mt-0 lg:text-right">
          이 사이트는 PC 환경, 배율 100% 기준으로 최적화되어 있습니다.
        </p>
      </footer>
    </div>
  );
}
