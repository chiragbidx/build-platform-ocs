"use client";

import { useState } from "react";
import { ReportInputSchema, createReportAction } from "./actions";

export default function AddReportForm() {
  const [formState, setFormState] = useState({
    type: "",
    filters: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = ReportInputSchema.safeParse(formState);
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message);
      return;
    }
    const resp = await createReportAction(parsed.data);
    if (resp?.status === 200) {
      setFormState({ type: "", filters: "" });
      window.location.reload();
    } else {
      alert(resp?.error || "Failed to create report");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-8 p-4 border rounded-lg flex flex-col md:flex-row gap-2 items-center">
      <input
        className="border rounded px-2 py-1"
        value={formState.type}
        onChange={e => setFormState({ ...formState, type: e.target.value })}
        placeholder="Report type (revenue, churn, etc.)"
        required
      />
      <input
        className="border rounded px-2 py-1"
        value={formState.filters}
        onChange={e => setFormState({ ...formState, filters: e.target.value })}
        placeholder="Optional filters (JSON/CSV)"
      />
      <button type="submit" className="rounded bg-primary text-white px-4 py-2">
        Run report
      </button>
    </form>
  );
}