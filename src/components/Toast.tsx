type Props = {
  message: string | null;
  tone?: "success" | "error" | "info";
};

export default function Toast({ message, tone = "info" }: Props) {
  if (!message) return null;

  const toneClass = {
    success: "border-emerald-400/30 bg-emerald-400/15 text-emerald-100",
    error: "border-red-400/30 bg-red-400/15 text-red-100",
    info: "border-sky-400/30 bg-sky-400/15 text-sky-100",
  }[tone];

  return (
    <div className={`fixed bottom-5 right-5 z-[80] max-w-sm rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur ${toneClass}`}>
      {message}
    </div>
  );
}
