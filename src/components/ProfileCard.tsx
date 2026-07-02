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
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 border border-gray-300 mb-2 cursor-pointer hover:bg-gray-50 w-[700px]"
      data-search={searchQuery}
    >
      <img src={profile.picture} alt={`${profile.fullname} profile`} className="w-12 h-12 rounded-full" />
      <div className="text-left flex-1">
        <div className="font-bold">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm text-gray-600">{profile.fullname}</div>
        <div className="text-sm">{formatFollowers(profile.followers)} followers</div>
      </div>
      {/* TODO: candidates must implement Add to List feature */}
      <button
        className={`px-3 py-1 text-sm rounded ${
          added
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (added) {
            removeProfile(profile.user_id);
          } else {
            addProfile(profile, platform);
          }
        }}
      >
        {added ? "Remove" : "Add to List"}
      </button>
    </div>
  );
});
