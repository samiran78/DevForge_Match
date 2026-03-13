import { Injectable } from '@nestjs/common';

export interface VenueRecommendationInput {
  midpointLat: number;
  midpointLng: number;
  types: string[];
  minRating?: number;
  ambienceTags?: string[];
}

export interface VenueResult {
  placeId: string;
  name: string;
  type: string;
  rating?: number;
  address?: string;
  latitude: number;
  longitude: number;
  distance: number;
  ambienceTags: string[];
  isSponsored: boolean;
}

@Injectable()
export class VenueRecommendationEngine {
  async recommend(input: VenueRecommendationInput): Promise<VenueResult[]> {
    // In production, calls Google Places API
    // Returns mock structure for now - actual implementation in VenueService
    return [];
  }

  mergeWithSponsored(
    organic: VenueResult[],
    sponsored: Array<VenueResult & { boostWeight: number }>,
  ): VenueResult[] {
    const boosted = sponsored.map((s) => ({ ...s, _score: (s.rating || 4) * s.boostWeight }));
    const combined = [...organic, ...boosted];
    return combined.sort((a, b) => ((b as any)._score || 0) - ((a as any)._score || 0));
  }
}
