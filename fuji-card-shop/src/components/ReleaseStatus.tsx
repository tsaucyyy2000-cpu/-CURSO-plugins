export type ReleaseTone = "preorder" | "arriving" | "live";

const labels: Record<ReleaseTone, string> = {
  preorder: "Pre-order window",
  arriving: "Landing soon",
  live: "In stock / shipping",
};

export function ReleaseStatus({ tone }: { tone: ReleaseTone }) {
  return <em className={`release-status release-status-${tone}`}>{labels[tone]}</em>;
}
