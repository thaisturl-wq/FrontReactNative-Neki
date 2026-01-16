import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Event } from '../../types/event';
import EventCard from '../card';
import styles from './style';

interface EventDetailProps {
  events: Event[];
  onEventEdit: (event: Event) => void;
  onEventDelete: (id: number) => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ events, onEventEdit, onEventDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);

  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar eventos..."
          placeholderTextColor="#a3a3a3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🔍</Text>
          <Text style={styles.emptyStateTitle}>Nenhum evento encontrado</Text>
          <Text style={styles.emptyStateText}>
            {searchQuery.length > 0
              ? 'Tente ajustar sua busca'
              : 'Comece criando um novo evento'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onEdit={() => onEventEdit(item)}
              onDelete={() => onEventDelete(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default EventDetail;
