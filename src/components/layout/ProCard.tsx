import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";

const perks = [
  "Unlimited playground runs and saved snippets",
  "Ranked Deathmatch seasons and badges",
  "Mentor code reviews on every project",
  "Verified, shareable certificates",
];

function CodeIllustration() {
  return (
    <svg viewBox="0 0 120 64" className="h-14 w-auto" aria-hidden>
      <rect x="4" y="6" width="78" height="52" rx="8" className="fill-ink" />
      <circle cx="13" cy="14" r="2.2" className="fill-primary" />
      <circle cx="20" cy="14" r="2.2" className="fill-caramel" />
      <circle cx="27" cy="14" r="2.2" className="fill-cream" opacity=".6" />
      <rect x="12" y="24" width="30" height="4" rx="2" className="fill-primary" />
      <rect x="18" y="32" width="44" height="4" rx="2" className="fill-cream" opacity=".55" />
      <rect x="18" y="40" width="26" height="4" rx="2" className="fill-caramel" />
      <rect x="12" y="48" width="14" height="4" rx="2" className="fill-cream" opacity=".35" />
      <path d="M92 30h20v10a10 10 0 0 1-20 0z" className="fill-primary" />
      <path d="M112 33h3a3.5 3.5 0 0 1 0 7h-3" fill="none" strokeWidth="2.5" className="stroke-primary" />
      <path d="M98 20c-2 3 2 4 0 7M106 20c-2 3 2 4 0 7" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-ink" opacity=".5" />
    </svg>
  );
}

export function ProCard() {
  const isPro = useStore((s) => s.isPro);
  const upgradePro = useStore((s) => s.upgradePro);

  return (
    <div className="dot-grid relative overflow-hidden rounded-card bg-cream p-4 text-cream-foreground">
      <CodeIllustration />
      <h3 className="mt-3 text-[15px] font-extrabold leading-tight">
        {isPro ? "You're on Pro" : "Ready to level up?"}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-ink/70">
        {isPro
          ? "All Pro features are unlocked. Keep crafting!"
          : "Unlock your full coding potential with CodeCraft Pro."}
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="mt-3 w-full">
            <Sparkles /> {isPro ? "View Pro perks" : "Explore Pro"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">CodeCraft Pro</DialogTitle>
            <DialogDescription>Everything you need to go from first program to job-ready Java developer.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-3 py-2">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-3.5" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-between rounded-card bg-secondary p-4">
            <div>
              <p className="eyebrow">Monthly</p>
              <p className="font-display text-3xl font-extrabold">
                ₹499<span className="text-sm font-medium text-muted-foreground">/mo</span>
              </p>
            </div>
            <Button
              disabled={isPro}
              onClick={() => {
                upgradePro();
                toast.success("Welcome to CodeCraft Pro", { description: "Pro features are now unlocked (demo)." });
              }}
            >
              {isPro ? "Active" : "Start free trial"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
