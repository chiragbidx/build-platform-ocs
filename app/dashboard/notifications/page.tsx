import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listNotificationsAction, markNotificationReadAction } from "./actions";

export default async function NotificationsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const notifications = await listNotificationsAction();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <p className="mb-4 text-muted-foreground">
        See important payment, invoice, subscription, and account notifications here.
      </p>
      <NotificationList notifications={notifications} />
    </div>
  );
}

import { useState } from "react";

function NotificationList({ notifications }: { notifications: any[] }) {
  if (!notifications.length) {
    return (
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No notifications yet</div>
        <div className="mb-4 text-muted-foreground">You're all caught up.</div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {notifications.map(n => (
        <div key={n.id} className="border rounded p-4 flex flex-col md:flex-row justify-between gap-2 items-center">
          <div>
            <strong>{n.type}</strong>: {n.content}
            <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
          </div>
          {n.status !== "read" && (
            <button className="rounded bg-primary text-white px-4 py-2 text-xs" onClick={async () => {
              await markNotificationReadAction(n.id);
              window.location.reload();
            }}>Mark Read</button>
          )}
        </div>
      ))}
    </div>
  );
}