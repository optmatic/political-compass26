import { QUESTIONS_PER_AXIS } from "@/lib/scoring";

interface WelcomeScreenProps {
  onStart: () => void;
  axisCount: number;
}

export default function WelcomeScreen({
  onStart,
  axisCount,
}: WelcomeScreenProps) {
  const totalQuestions = axisCount * QUESTIONS_PER_AXIS;

  return (
    <div className="w-full">
      <section className="grid min-h-[calc(100vh-12rem)] items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div className="text-center lg:text-left">
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
            Politics is not a fucking sport, mate.
          </h1>
          <p className="mc-body mt-6 max-w-lg mx-auto lg:mx-0">
            Do not fall for the left-versus-right nonsense. There is more to you
            than a team colour, a ballot box reflex or whatever the algorithm
            keeps yelling. Answer {totalQuestions} prompts and dig a little
            deeper into where you actually stand.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mc-btn-hero mc-focus-ring mt-9"
          >
            Start quiz
          </button>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="hero-gif-frame w-full max-w-md lg:max-w-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero.gif"
              alt="Lo-fi illustration of a figure watching a city burn through a window"
              className="hero-gif h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
