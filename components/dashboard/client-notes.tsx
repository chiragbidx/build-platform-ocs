"use client";
import { useState } from "react";
import { addClientNoteAction } from "@/app/dashboard/clients/[clientId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ClientNotes({ clientId, initialNotes }) {
  const [notes, setNotes] = useState(initialNotes || []);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<null | { success?: boolean; error?: string }>(null);

  async function addNote(e) {
    e.preventDefault();
    if (!note.trim()) return;
    const resp = await addClientNoteAction(clientId, note);
    if (resp && resp.status === 200) {
      setNotes([{ note, createdAt: new Date().toISOString() }, ...notes]);
      setNote("");
      setStatus({ success: true });
    } else {
      setStatus({ error: resp?.error || "Error adding note." });
    }
  }

  return (
    <div>
      <form className="flex gap-2 mb-4" onSubmit={addNote}>
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add note about this client..."
        />
        <Button type="submit" className="font-semibold" disabled={!note.trim()}>Add</Button>
      </form>
      {status?.error && <div className="text-destructive text-sm mb-2">{status.error}</div>}
      <ol className="space-y-2">
        {notes.map((n, i) => (
          <li key={i} className="text-muted-foreground text-sm border-l-2 border-muted pl-2">
            <span className="block">{n.note}</span>
            <span className="text-xs">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</span>
          </li>
        ))}
      </ol>
      {notes.length === 0 && (
        <div className="text-muted-foreground">No notes for this client yet.</div>
      )}
    </div>
  );
}