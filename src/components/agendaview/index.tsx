import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { AgendaViewProps } from '../../types/component';
import styles from './style';

const AgendaView: React.FC<AgendaViewProps> = ({ isOpen, onClose, events, onEventClick }) => {
  
  // Ordenar eventos por data
  const sortedEvents = [...events].sort((a, b) => {
    const parseDate = (dateString: string) => {
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
      return new Date(dateString);
    };
    
    return parseDate(a.date).getTime() - parseDate(b.date).getTime();
  });

  // Formatar data para exibição
  const formatDateBox = (dateString: string) => {
    try {
      // Se a data estiver no formato DD/MM/YYYY
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const day = parts[0];
          const monthNum = parseInt(parts[1]);
          const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
          return {
            day: day,
            month: months[monthNum - 1] || 'MÊS',
          };
        }
      }
      
      // Se for ISO ou outro formato
      const date = new Date(dateString);
      return {
        day: date.getDate().toString().padStart(2, '0'),
        month: date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
      };
    } catch (error) {
      return {
        day: '--',
        month: '---',
      };
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={styles.drawer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.badge}>SUA AGENDA</Text>
              <Text style={styles.title}>Próximos Eventos</Text>
            </View>
            <TouchableOpacity style={styles.btnClose} onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event) => {
                const { day, month } = formatDateBox(event.date);
                return (
                  <TouchableOpacity 
                    key={event.id} 
                    style={styles.item}
                    onPress={() => {
                      if (onEventClick) {
                        onEventClick(event);
                        onClose();
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dateBox}>
                      <Text style={styles.day}>{day}</Text>
                      <Text style={styles.month}>{month}</Text>
                    </View>
                    
                    <View style={styles.info}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      {event.location && (
                        <Text style={styles.eventLocation}>📍 {event.location}</Text>
                      )}
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.empty}>Nenhum evento agendado ainda.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AgendaView;