const PALETTES = [
  ["#d9c3a0", "#b3542e"],
  ["#e3d5bd", "#8a3f21"],
  ["#c9b896", "#6b7a5e"],
  ["#e7dac5", "#c08a3e"],
];

function hashSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function MediaPlaceholder({ seed, label }: { seed: string; label?: string }) {
  const [from, to] = PALETTES[hashSeed(seed) % PALETTES.length];
  const initial = (label ?? seed).trim().charAt(0).toUpperCase();

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(36,27,20,0.5) 0px, rgba(36,27,20,0.5) 1px, transparent 1px, transparent 26px)",
        }}
      />
      <span className="font-display text-7xl text-paper/40">{initial}</span>
    </div>
  );
}
