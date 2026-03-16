import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listCommentsAction, createCommentAction, CommentInputSchema } from "./actions";
import { useState } from "react";

export default async function CommentsPage() {
  // Default: comments on a sample entity (could be "invoice" and an id)
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");
  const entityType = "invoice";
  const entityId = "sample-entity";

  const comments = await listCommentsAction(entityType, entityId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Comments & Notes</h1>
      <p className="mb-4 text-muted-foreground">
        Add, review, and collaborate on comments across invoices, payments, or clients. All comments here are attached to a sample invoice.
      </p>
      <CommentList comments={comments} />
      <AddCommentForm entityType={entityType} entityId={entityId} />
    </div>
  );
}

function CommentList({ comments }: { comments: any[] }) {
  if (!comments.length) {
    return (
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No comments yet</div>
        <div className="mb-4 text-muted-foreground">Be the first to leave a note on this item.</div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {comments.map((comment: any) => (
        <div key={comment.id} className="border rounded p-4">
          <div>{comment.content}</div>
          <div className="text-xs mt-2 text-muted-foreground">
            {comment.isInternal && <span className="font-semibold text-red-600">Internal Only • </span>}
            Posted at {new Date(comment.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function AddCommentForm({ entityType, entityId }: { entityType: string; entityId: string }) {
  const [formState, setFormState] = useState({
    content: "",
    isInternal: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = CommentInputSchema.safeParse({ ...formState, entityType, entityId });
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message);
      return;
    }
    const resp = await createCommentAction(parsed.data);
    if (resp?.status === 200) {
      setFormState({ content: "", isInternal: false });
      window.location.reload();
    } else {
      alert(resp?.error || "Failed to add comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-8 p-4 border rounded-lg flex flex-col gap-2">
      <textarea
        className="border rounded px-2 py-1 resize-y"
        value={formState.content}
        onChange={e => setFormState({ ...formState, content: e.target.value })}
        placeholder="Write a comment..."
        required
      />
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formState.isInternal}
          onChange={e => setFormState({ ...formState, isInternal: e.target.checked })}
          className="mr-2"
        />
        Internal note only
      </label>
      <button type="submit" className="rounded bg-primary text-white px-4 py-2">Add Comment</button>
    </form>
  );
}