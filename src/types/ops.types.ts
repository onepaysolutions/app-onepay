export interface OPSPresaleCycleGroup {
  id: number;
  initial_price_increase: number;
  cycle_total_soldAmount: number;
  cycle_group_nr: number;
  cycle_stag: number;
  created_at: string;
  updated_at: string;
}

export type PresaleCycleGroupStatus = 'upcoming' | 'active' | 'completed';
