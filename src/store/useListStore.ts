import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface ListProfile {
  user_id: string;
  username: string;
  fullname: string;
  picture: string;
  is_verified: boolean;
  followers: number;
  platform: Platform;
}

interface ListStore {
  profiles: ListProfile[];
  addProfile: (profile: UserProfileSummary, platform: Platform) => void;
  removeProfile: (user_id: string) => void;
  reorderProfiles: (fromIndex: number, toIndex: number) => void;
  isInList: (user_id: string) => boolean;
}

export const useListStore = create<ListStore>()(
  persist(
    (set, get) => ({
      profiles: [],

      addProfile: (profile, platform) => {
        const exists = get().profiles.some(
          (p) => p.user_id === profile.user_id
        );
        if (exists) return;

        set((state) => ({
          profiles: [
            ...state.profiles,
            {
              user_id: profile.user_id,
              username: profile.username,
              fullname: profile.fullname,
              picture: profile.picture,
              is_verified: profile.is_verified,
              followers: profile.followers,
              platform,
            },
          ],
        }));
      },

      removeProfile: (user_id) => {
        set((state) => ({
          profiles: state.profiles.filter((p) => p.user_id !== user_id),
        }));
      },

      reorderProfiles: (fromIndex, toIndex) => {
        set((state) => {
          const updated = [...state.profiles];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);
          return { profiles: updated };
        });
      },

      isInList: (user_id) => {
        return get().profiles.some((p) => p.user_id === user_id);
      },
    }),
    {
      name: "selected-profiles",
    }
  )
);
