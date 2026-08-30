export interface Bookmark {
  id: string;
  title: string;
  url: string;
  folderId: string | null;
  favourite: boolean;
  createdAt: number;
}

export interface Folder {
  id: string;
  name: string;
  tint: number;
}

/** Sentinel folder ids used for the two built-in smart folders, mirrored from the main app. */
export const UNSORTED = "unsorted";
export const FAVOURITES = "favourites";
