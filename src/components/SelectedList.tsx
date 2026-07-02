import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useListStore } from "@/store/useListStore";
import { formatFollowers } from "@/utils/formatters";
import { VerifiedBadge } from "./VerifiedBadge";

export function SelectedList() {
  const { profiles, removeProfile, reorderProfiles } = useListStore();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    reorderProfiles(result.source.index, result.destination.index);
  };

  if (profiles.length === 0) {
    return (
      <div
        className="rounded-xl p-6 text-center text-sm"
        style={{
          background: "var(--card-bg)",
          border: "1px dashed var(--border)",
          color: "var(--text)",
        }}
      >
        <div className="text-2xl mb-2">📋</div>
        No profiles selected yet.
        <br />
        Click <strong>"+ Add to List"</strong> to get started.
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="flex justify-between items-center px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <h3
          className="font-semibold text-sm"
          style={{ color: "var(--text-h)" }}
        >
          📋 My List ({profiles.length})
        </h3>
        <span className="text-xs" style={{ color: "var(--text)" }}>
          Drag to reorder
        </span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="selected-profiles">
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="m-0 p-0"
              style={{ listStyle: "none" }}
            >
              {profiles.map((profile, index) => (
                <Draggable
                  key={profile.user_id}
                  draggableId={profile.user_id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{
                        ...provided.draggableProps.style,
                        borderBottom: "1px solid var(--border)",
                        background: snapshot.isDragging
                          ? "var(--accent-bg)"
                          : "transparent",
                        boxShadow: snapshot.isDragging
                          ? "var(--shadow-lg)"
                          : "none",
                        borderRadius: snapshot.isDragging ? "8px" : "0",
                      }}
                    >
                      <span
                        className="cursor-grab text-sm"
                        style={{ color: "var(--border)" }}
                      >
                        ⠿
                      </span>
                      <img
                        src={profile.picture}
                        alt={`${profile.fullname} profile`}
                        className="w-9 h-9 rounded-full object-cover"
                        style={{ border: "1px solid var(--border)" }}
                      />
                      <div className="flex-1 text-left min-w-0">
                        <div
                          className="text-xs font-semibold truncate"
                          style={{ color: "var(--text-h)" }}
                        >
                          @{profile.username ?? "unknown"}
                          <VerifiedBadge verified={profile.is_verified} />
                        </div>
                        <div
                          className="text-xs truncate"
                          style={{ color: "var(--text)" }}
                        >
                          {formatFollowers(profile.followers)} · {profile.platform}
                        </div>
                      </div>
                      <button
                        onClick={() => removeProfile(profile.user_id)}
                        className="text-xs px-2 py-1 rounded-md cursor-pointer"
                        style={{
                          color: "#ef4444",
                          background: "rgba(239, 68, 68, 0.08)",
                          border: "none",
                        }}
                      >
                        ✕
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
