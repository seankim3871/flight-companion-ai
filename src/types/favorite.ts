/**
 * Saved favorite flight for quick pickup planning.
 */
export interface FavoriteFlight {
  id: string;
  flightNumber: string;
  homeAddress: string;
  email?: string;
  phone?: string;
  label: string;
  savedAt: string;
}
