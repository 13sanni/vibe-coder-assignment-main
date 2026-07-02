import { useCallback, useMemo, useState } from "react";
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
  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  const handleProfileClick = useCallback((username: string) => {
    setClickCount((prev) => prev + 1);
    console.log("Clicked profile:", username);
  }, []);

  return (
    <Layout title="Find Influencers">
      <p className="text-sm mb-5" style={{ color: "var(--text)" }}>
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

      <p className="text-xs mb-3" style={{ color: "var(--text)" }}>
        Showing {filtered.length} of {allProfiles.length} on{" "}
        <span className="font-medium" style={{ color: "var(--text-h)" }}>
          {platform}
        </span>
      </p>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <ProfileList
            profiles={filtered}
            platform={platform}
            searchQuery={searchQuery}
            onProfileClick={handleProfileClick}
          />
        </div>

        <div className="w-80 shrink-0 hidden lg:block sticky top-24">
          <SelectedList />
        </div>
      </div>

      {/* Mobile: show selected list below */}
      <div className="mt-6 lg:hidden">
        <SelectedList />
      </div>
    </Layout>
  );
}
