import { createFileRoute } from "@tanstack/react-router";
import { ArrowBigUp, MessageSquare, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/codecraft/PageHeader";
import { initials } from "@/components/layout/TopNav";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — CodeCraft" },
      { name: "description", content: "Ask Java questions, share projects and help fellow learners in the CodeCraft community." },
      { property: "og:title", content: "Community — CodeCraft" },
      { property: "og:description", content: "Discuss Java with learners and mentors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Community,
});

const tags = ["All", "Collections", "OOP", "Streams", "Projects", "General"];

function Community() {
  const posts = useStore((s) => s.posts);
  const voted = useStore((s) => s.votedPosts);
  const vote = useStore((s) => s.votePost);
  const addPost = useStore((s) => s.addPost);
  const [tag, setTag] = useState("All");
  const [sort, setSort] = useState<"top" | "new">("top");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postTag, setPostTag] = useState("General");

  const list = posts
    .filter((p) => tag === "All" || p.tag === tag)
    .sort((a, b) => (sort === "top" ? b.votes - a.votes : 0));

  return (
    <div>
      <PageHeader
        eyebrow="Community"
        title="Discussions"
        description="Ask questions, share what you've built and learn from other Java crafters."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> New post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Start a discussion</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (title.trim().length < 5) {
                    toast.error("Give your post a title of at least 5 characters");
                    return;
                  }
                  addPost({ title: title.trim(), body: body.trim(), tag: postTag });
                  setTitle("");
                  setBody("");
                  setOpen(false);
                  setSort("new");
                  setTag("All");
                  toast.success("Posted to the community");
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="post-title">Title</Label>
                  <Input id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's on your mind?" maxLength={140} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="post-body">Details</Label>
                  <Textarea id="post-body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share code, context or what you've tried" maxLength={2000} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.slice(1).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setPostTag(t)}
                      className={cn(
                        "rounded-chip border px-2.5 py-1 text-xs font-medium",
                        postTag === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <Button type="submit" className="w-full">
                  Publish
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTag(t)}
            className={cn(
              "rounded-chip border px-3 py-1.5 text-xs font-medium transition-colors",
              tag === t ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto inline-flex rounded-btn border border-border bg-card p-1 text-xs">
          {(["top", "new"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={cn("rounded-chip px-3 py-1 font-medium capitalize", sort === s ? "bg-secondary text-foreground" : "text-subtle")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-3">
        {list.map((p) => {
          const isVoted = voted.includes(p.id);
          return (
            <li key={p.id} className="surface flex gap-4 p-5">
              <button
                type="button"
                onClick={() => vote(p.id)}
                aria-pressed={isVoted}
                aria-label={`Upvote, ${p.votes} votes`}
                className={cn(
                  "flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-btn border transition-colors",
                  isVoted ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-subtle",
                )}
              >
                <ArrowBigUp className="size-5" fill={isVoted ? "currentColor" : "none"} />
                <span className="text-xs font-semibold tabular-nums">{p.votes}</span>
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold leading-snug">{p.title}</h2>
                {p.body && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.body}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-subtle">
                  <span className="flex items-center gap-1.5">
                    <span className="grid size-5 place-items-center rounded-full bg-secondary text-[9px] font-bold text-foreground">
                      {initials(p.author)}
                    </span>
                    {p.author}
                  </span>
                  <span>{p.time}</span>
                  <span className="rounded-chip bg-secondary px-2 py-0.5 text-muted-foreground">{p.tag}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="size-3.5" /> {p.replies}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
