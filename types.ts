
export interface ReviewResult {
  wordChoice: string;
  sentenceStructure: string;
  decoration: string;
  encouragement: string;
}

export interface AppState {
  image: string | null;
  loading: boolean;
  review: ReviewResult | null;
  error: string | null;
}
