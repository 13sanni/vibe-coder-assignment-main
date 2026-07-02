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
      <div className="border border-dashed border-gray-300 rounded p-6 text-center text-gray-400 text-sm">
        No profiles selected yet. Click "Add to List" on any profile to get
        started.
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-sm">
          Selected Profiles ({profiles.length})
        </h3>
        <span className="text-xs text-gray-400">Drag to reorder</span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="selected-profiles">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
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
                      className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                        snapshot.isDragging ? "bg-blue-50 shadow-md" : ""
                      }`}
                    >
                      <span className="text-gray-300 cursor-grab">⠿</span>
                      <img
                        src={profile.picture}
                        alt={`${profile.fullname} profile`}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold">
                          @{profile.username}
                          <VerifiedBadge verified={profile.is_verified} />
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFollowers(profile.followers)} followers ·{" "}
                          {profile.platform}
                        </div>
                      </div>
                      <button
                        onClick={() => removeProfile(profile.user_id)}
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded"
                      >
                        Remove
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
