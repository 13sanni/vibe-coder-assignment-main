import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileListProps) {
  return (
    <div className="flex flex-col gap-3">
      {profiles.length === 0 && (
        <div
          className="text-center py-10 text-sm rounded-xl"
          style={{
            color: "var(--text)",
            background: "var(--card-bg)",
            border: "1px dashed var(--border)",
          }}
        >
          No profiles found matching your search.
        </div>
      )}
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          searchQuery={searchQuery}
          onProfileClick={onProfileClick}
        />
      ))}
    </div>
  );
}
