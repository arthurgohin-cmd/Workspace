import type { ProjectStatus } from "@/generated/prisma/enums";
import type { Dictionary } from "@/i18n/get-dictionary";

export function StatusPill({ status, dict }: { status: ProjectStatus; dict: Dictionary }) {
  const isCompleted = status === "COMPLETED";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1 text-xs font-medium tracking-wide ${
        isCompleted ? "bg-sage/15 text-sage" : "bg-ochre/15 text-ochre"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isCompleted ? "bg-sage" : "bg-ochre"}`} />
      {isCompleted ? dict.status.COMPLETED : dict.status.IN_PROGRESS}
    </span>
  );
}
