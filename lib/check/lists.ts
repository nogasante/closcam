export type CommunityLookup = {
  numbers: string[];
  domains: string[];
};

export type CommunityHit = {
  kind: "number" | "domain";
  value: string;
  source: string;
  note: string;
};

export interface CommunityList {
  id: string;
  lookup(input: CommunityLookup): Promise<CommunityHit[]>;
}

/**
 * Osebow (osebow.com, by Cecil Anglow) is a community fraud database.
 * It has no public API. This adapter returns nothing and must not scrape the site.
 * Replace lookup when Osebow documents an API and permission is in place.
 */
export const communityLists: CommunityList[] = [
  {
    id: "osebow",
    async lookup() {
      return [];
    },
  },
];
