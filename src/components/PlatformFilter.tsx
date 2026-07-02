import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const platformColors: Record<Platform, string> = {
  instagram: "#E1306C",
  youtube: "#FF0000",
  tiktok: "#00f2ea",
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-4">
        {PLATFORMS.map((p) => {
          const isActive = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className="px-4 py-2 text-sm font-medium rounded-lg cursor-pointer"
              style={{
                background: isActive ? platformColors[p] : "var(--card-bg)",
                color: isActive ? "#fff" : "var(--text)",
                border: `1px solid ${isActive ? platformColors[p] : "var(--border)"}`,
                boxShadow: isActive ? "var(--shadow-md)" : "none",
              }}
            >
              {getPlatformLabel(p)}
            </button>
          );
        })}
      </div>

      <div className="relative max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name..."
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            color: "var(--text-h)",
          }}
        />
      </div>
    </div>
  );
}
