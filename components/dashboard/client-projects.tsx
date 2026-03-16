"use client";
export function ClientProjects({ projects }) {
  return (
    <div>
      {projects.length === 0 ? (
        <div className="text-muted-foreground">No projects for this client yet.</div>
      ) : (
        <ol className="space-y-2">
          {projects.map((proj) => (
            <li key={proj.id} className="pb-2 border-b border-muted-foreground/10">
              <div className="font-semibold">{proj.name}</div>
              <div className="text-xs text-muted-foreground">Status: {proj.status}</div>
              {proj.tasks && proj.tasks.length > 0 ? (
                <ul className="mt-1 pl-3 space-y-0.5">
                  {proj.tasks.map((task) => (
                    <li key={task.id} className="text-sm">
                      - {task.name} <span className="text-xs text-muted-foreground">({task.status})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-muted-foreground">No tasks</div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}