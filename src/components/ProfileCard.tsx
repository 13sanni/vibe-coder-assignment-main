import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { formatFollowers } from "@/utils/formatters";
import { useListStore } from "@/store/useListStore";
import { VerifiedBadge } from "./VerifiedBadge";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { addProfile, removeProfile, isInList } = useListStore();
  const added = isInList(profile.user_id);

  const handleClick = () => {
    if (onProfileClick && profile.username)
      onProfileClick(profile.username);
    navigate(
      `/profile/${profile.username ?? profile.user_id}?platform=${platform}`
    );
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-4 p-4 rounded-xl cursor-pointer group"
      data-search={searchQuery}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.borderColor = "var(--accent-border)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <img
        src={profile.picture}
        alt={`${profile.fullname} profile`}
        className="w-12 h-12 rounded-full object-cover"
        style={{ border: "2px solid var(--border)" }}
      />

      <div className="text-left flex-1 min-w-0">
        <div className="font-semibold text-sm" style={{ color: "var(--text-h)" }}>
          @{profile.username ?? "unknown"}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-xs" style={{ color: "var(--text)" }}>
          {profile.fullname}
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--text)" }}>
          {formatFollowers(profile.followers)} followers
          {profile.engagement_rate !== undefined && (
            <span className="ml-2">
              · {(profile.engagement_rate * 100).toFixed(2)}% eng.
            </span>
          )}
        </div>
      </div>

      <button
        className="px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap"
        style={{
          background: added ? "rgba(239, 68, 68, 0.08)" : "var(--accent-bg)",
          color: added ? "#ef4444" : "var(--accent)",
          border: `1px solid ${added ? "rgba(239, 68, 68, 0.3)" : "var(--accent-border)"}`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (added) {
            removeProfile(profile.user_id);
          } else {
            addProfile(profile, platform);
          }
        }}
      >
        {added ? "✕ Remove" : "+ Add to List"}
      </button>
    </div>
  );
});
