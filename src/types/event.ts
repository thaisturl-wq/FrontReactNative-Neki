export interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  location?: string;
  imageUrl?: string;
  startTime?: string;
  endTime?: string;
  adminId?: number;
}
