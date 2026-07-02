import { useMemo, useState } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { SelectedList } from "@/components/SelectedList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const [clickCount, setClickCount] = useState(0);

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(() => filterProfiles(allProfiles, searchQuery), [allProfiles, searchQuery]);

  const handleProfileClick = (username: string) => {
    setClickCount((prev) => prev + 1);
    console.log("Clicked profile:", username, "total clicks:", clickCount);
  };

  return (
    <Layout title="Find Influencers">
      <p className="text-gray-500 mb-4 text-sm">
        Browse top creators across social platforms
      </p>

      <PlatformFilter
        selected={platform}
        onChange={(p) => {
          setPlatform(p);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <p className="text-xs text-gray-400 mb-2">
        Showing {filtered.length} of {allProfiles.length} on {platform}
      </p>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={searchQuery}
        onProfileClick={handleProfileClick}
      />

      <div className="mt-6 w-[700px]">
        <SelectedList />
      </div>
    </Layout>
  );
}
