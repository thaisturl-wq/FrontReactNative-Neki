import { ViewStyle } from 'react-native';
import { Event } from './event';

export interface EventCardProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  style?: ViewStyle;
}

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingEvent: Event | null;
}

export interface AgendaViewProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
  onEventClick?: (event: Event) => void;
}
