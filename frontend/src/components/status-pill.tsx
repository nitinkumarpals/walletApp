import { cn } from "@/lib/utils";

export default function StatusPill({ status }: { status: string }) {
  const isSuccess = status.toLowerCase() === "success" || status.toLowerCase() === "completed";
  const isPending = status.toLowerCase() === "pending" || status.toLowerCase() === "processing";
  
  return (
    <div
      className={cn(
        "label-mono px-2 py-0.5 rounded-full border",
        isSuccess ? "border-lime/30 text-lime bg-lime/5" :
        isPending ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/5" :
        "border-destructive/30 text-destructive bg-destructive/5"
      )}
    >
      {status.toLowerCase()}
    </div>
  );
}
