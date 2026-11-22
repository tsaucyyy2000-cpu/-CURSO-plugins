import Link from "next/link";

export type JourneyStepId = "cart" | "checkout" | "confirmation";

const STEPS: { id: JourneyStepId; label: string; href: string }[] = [
  { id: "cart", label: "Cart", href: "/cart" },
  { id: "checkout", label: "Checkout", href: "/checkout" },
  { id: "confirmation", label: "Confirmation", href: "/checkout/confirmation" },
];

export function JourneyRail({ current }: { current: JourneyStepId }) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);

  return (
    <nav className="journey-rail" aria-label="Checkout progress">
      <ol>
        {STEPS.map((step, index) => {
          const state =
            index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
          const content = (
            <>
              <span className="journey-rail-index" aria-hidden="true">
                {index + 1}
              </span>
              <span>{step.label}</span>
            </>
          );

          return (
            <li key={step.id} data-state={state}>
              {state === "done" ? (
                <Link href={step.href} aria-label={`Back to ${step.label}`}>
                  {content}
                </Link>
              ) : (
                <span aria-current={state === "current" ? "step" : undefined}>{content}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
