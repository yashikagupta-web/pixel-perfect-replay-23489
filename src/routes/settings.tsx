import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/codecraft/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CodeCraft" },
      { name: "description", content: "Manage your CodeCraft profile, daily learning goal, reminders and editor preferences." },
      { property: "og:title", content: "Settings — CodeCraft" },
      { property: "og:description", content: "Personalise your CodeCraft learning experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const goals = [15, 30, 45, 60];

function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const update = useStore((s) => s.updateSettings);
  const reset = useStore((s) => s.resetProgress);
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);

  useEffect(() => {
    setName(settings.name);
    setEmail(settings.email);
  }, [settings.name, settings.email]);

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="Account" title="Settings" description="Personalise how CodeCraft works for you." />

      <section className="surface mb-4 p-6">
        <h2 className="text-base font-bold">Profile</h2>
        <form
          className="mt-4 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim().length < 2) {
              toast.error("Name must be at least 2 characters");
              return;
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) {
              toast.error("Enter a valid email address");
              return;
            }
            update({ name: name.trim(), email: email.trim() });
            toast.success("Profile saved");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Save profile</Button>
          </div>
        </form>
      </section>

      <section className="surface mb-4 p-6">
        <h2 className="text-base font-bold">Daily goal</h2>
        <p className="mt-1 text-sm text-muted-foreground">How many minutes do you want to learn each day?</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {goals.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => update({ dailyGoal: g })}
              aria-pressed={settings.dailyGoal === g}
              className={cn(
                "rounded-btn border px-4 py-2.5 text-sm font-semibold transition-colors",
                settings.dailyGoal === g ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-subtle",
              )}
            >
              {g} min
            </button>
          ))}
        </div>
      </section>

      <section className="surface mb-4 space-y-5 p-6">
        <h2 className="text-base font-bold">Notifications</h2>
        {[
          { key: "emailReminders" as const, label: "Learning reminders", hint: "A gentle nudge when you haven't studied today." },
          { key: "challengeReminders" as const, label: "Daily challenge alerts", hint: "Get notified when a new challenge drops." },
        ].map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor={row.key} className="text-sm font-medium">
                {row.label}
              </Label>
              <p className="text-xs text-subtle">{row.hint}</p>
            </div>
            <Switch id={row.key} checked={settings[row.key]} onCheckedChange={(v) => update({ [row.key]: v })} />
          </div>
        ))}
      </section>

      <section className="surface mb-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Editor font size</h2>
          <span className="font-mono text-sm text-primary">{settings.editorFontSize}px</span>
        </div>
        <Slider
          className="mt-5"
          min={12}
          max={20}
          step={1}
          value={[settings.editorFontSize]}
          onValueChange={([v]) => update({ editorFontSize: v ?? 14 })}
          aria-label="Editor font size"
        />
        <pre className="code-block mt-4" style={{ fontSize: settings.editorFontSize }}>
          System.out.println("Preview");
        </pre>
      </section>

      <section className="rounded-card border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-base font-bold text-destructive">Reset progress</h2>
        <p className="mt-1 text-sm text-muted-foreground">Clears lessons, XP, streak and projects on this device.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-4">
              Reset all progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
              <AlertDialogDescription>This can't be undone. Your XP, streak, completed lessons and projects will be cleared.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  reset();
                  toast("Progress reset");
                }}
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
