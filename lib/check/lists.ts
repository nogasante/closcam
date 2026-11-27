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
 * Osebow and similar community lists. No public API is documented here,
 * so this returns nothing. Do not scrape those sites.
 */
export const communityLists: CommunityList[] = [
  {
    id: "osebow",
    async lookup() {
      return [];
    },
  },
];
