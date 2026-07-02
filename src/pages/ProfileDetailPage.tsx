import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "instagram") as Platform;
  const { addProfile, removeProfile, isInList } = useListStore();
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    loadProfileByUsername(username).then((data) => {
      if (!cancelled) {
        setProfileData(data);
        setLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <p>Invalid profile</p>
        <Link to="/">Back</Link>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex items-center justify-center py-20">
          <div
            className="text-sm animate-pulse"
            style={{ color: "var(--text)" }}
          >
            Loading profile...
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div
          className="text-center py-10 rounded-xl"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-red-500 mb-3">
            Could not load profile details for <strong>{username}</strong>
          </p>
          <Link
            to="/"
            className="text-sm"
            style={{ color: "var(--accent)" }}
          >
            ← Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const added = isInList(user.user_id);

  const stats = [
    { label: "Followers", value: formatFollowers(user.followers) },
    { label: "Engagement Rate", value: formatEngagementRate(user.engagement_rate) },
    ...(user.posts_count !== undefined
      ? [{ label: "Posts", value: String(user.posts_count) }]
      : []),
    ...(user.avg_likes !== undefined
      ? [{ label: "Avg Likes", value: formatFollowers(user.avg_likes) }]
      : []),
    ...(user.avg_comments !== undefined
      ? [{ label: "Avg Comments", value: String(user.avg_comments) }]
      : []),
    ...(user.avg_views !== undefined && user.avg_views > 0
      ? [{ label: "Avg Views", value: formatFollowers(user.avg_views) }]
      : []),
    ...(user.engagements !== undefined
      ? [{ label: "Engagements", value: formatFollowers(user.engagements) }]
      : []),
  ];

  return (
    <Layout title={user.fullname}>
      <Link
        to="/"
        className="text-sm mb-5 inline-block no-underline"
        style={{ color: "var(--accent)" }}
      >
        ← Back to search
      </Link>

      <div
        className="rounded-xl p-6 max-w-2xl"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex gap-5 items-start">
          <img
            src={user.picture}
            alt={`${user.fullname} profile`}
            className="w-20 h-20 rounded-full object-cover"
            style={{ border: "3px solid var(--border)" }}
          />
          <div className="flex-1">
            <h2 className="text-lg font-bold" style={{ color: "var(--text-h)" }}>
              @{user.username ?? "unknown"}
              <VerifiedBadge verified={user.is_verified} />
            </h2>
            <p className="text-sm" style={{ color: "var(--text)" }}>
              {user.fullname}
            </p>
            <p
              className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block"
              style={{
                background: "var(--accent-bg)",
                color: "var(--accent)",
              }}
            >
              {platform}
            </p>

            {user.description && (
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "var(--text)" }}
              >
                {user.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-3 rounded-lg text-center"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="text-xs" style={{ color: "var(--text)" }}>
                {stat.label}
              </div>
              <div
                className="text-base font-bold mt-0.5"
                style={{ color: "var(--text-h)" }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex gap-3 items-center">
          <button
            className="px-4 py-2 text-sm font-medium rounded-lg cursor-pointer"
            style={{
              background: added ? "rgba(239, 68, 68, 0.08)" : "var(--accent)",
              color: added ? "#ef4444" : "#fff",
              border: added
                ? "1px solid rgba(239, 68, 68, 0.3)"
                : "1px solid var(--accent)",
            }}
            onClick={() => {
              if (added) {
                removeProfile(user.user_id);
              } else {
                addProfile(user, platform);
              }
            }}
          >
            {added ? "✕ Remove from List" : "+ Add to List"}
          </button>

          {user.url && (
            <a
              href={user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium rounded-lg no-underline"
              style={{
                background: "var(--bg)",
                color: "var(--text-h)",
                border: "1px solid var(--border)",
              }}
            >
              View on platform →
            </a>
          )}
        </div>
      </div>
    </Layout>
  );
}
