import { Injectable } from '@nestjs/common';

export interface PlaceResult {
  placeId: string;
  name: string;
  type: string;
  rating?: number;
  address?: string;
  latitude: number;
  longitude: number;
  distance: number;
  ambienceTags: string[];
}

@Injectable()
export class GooglePlacesService {
  private readonly apiKey = process.env.GOOGLE_PLACES_API_KEY;

  async searchNearby(
    lat: number,
    lng: number,
    types: string[] = ['restaurant', 'cafe', 'park'],
    minRating = 4.2,
  ): Promise<PlaceResult[]> {
    if (!this.apiKey) {
      return this.getMockResults(lat, lng);
    }

    try {
      const results: PlaceResult[] = [];
      for (const type of types) {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${this.apiKey}`,
        );
        const data = await res.json();
        if (data.results) {
          for (const p of data.results) {
            if ((p.rating || 0) >= minRating) {
              results.push({
                placeId: p.place_id,
                name: p.name,
                type,
                rating: p.rating,
                address: p.vicinity,
                latitude: p.geometry?.location?.lat,
                longitude: p.geometry?.location?.lng,
                distance: this.haversine(lat, lng, p.geometry?.location?.lat, p.geometry?.location?.lng),
                ambienceTags: p.types || [],
              });
            }
          }
        }
      }
      return results.sort((a, b) => a.distance - b.distance).slice(0, 20);
    } catch (e) {
      console.warn('Google Places API error:', e);
      return this.getMockResults(lat, lng);
    }
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private getMockResults(lat: number, lng: number): PlaceResult[] {
    return [
      { placeId: '1', name: 'Code & Coffee Café', type: 'cafe', rating: 4.5, latitude: lat + 0.01, longitude: lng, distance: 1.2, ambienceTags: ['cozy', 'wifi'] },
      { placeId: '2', name: 'Debug Bistro', type: 'restaurant', rating: 4.3, latitude: lat - 0.01, longitude: lng + 0.01, distance: 1.5, ambienceTags: ['casual'] },
      { placeId: '3', name: 'Central Park', type: 'park', rating: 4.8, latitude: lat, longitude: lng + 0.02, distance: 2.1, ambienceTags: ['outdoor', 'scenic'] },
    ];
  }
}
