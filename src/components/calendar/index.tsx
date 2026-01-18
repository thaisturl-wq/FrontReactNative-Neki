import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { Event } from '../../types/event';
import styles from './style';

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const Calendar: React.FC<CalendarProps> = ({ isOpen, onClose, events, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  // Função robusta para comparar datas ignorando fuso horário
  const isSameDay = (dateString: string, year: number, month: number, day: number) => {
    const [yyyy, mm, dd] = dateString.split('-');
    return (
      parseInt(yyyy, 10) === year &&
      parseInt(mm, 10) - 1 === month &&
      parseInt(dd, 10) === day
    );
  };

  const hasEventOnDay = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return events.some(event => isSameDay(event.date, year, month, day));
  };

  const getEventsForDay = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return events.filter(event => isSameDay(event.date, year, month, day));
  };

  const handleDayClick = (day: number) => {
    const dayEvents = getEventsForDay(day);
    setSelectedDayEvents(dayEvents);
  };

  const handleEventSelect = (event: Event) => {
    if (onEventClick) {
      onEventClick(event);
      onClose();
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days: React.ReactNode[] = [];
    const weeks: React.ReactNode[] = [];

    // Preencher dias vazios no início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Preencher dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEvent = hasEventOnDay(day);
      days.push(
        <TouchableOpacity
          key={day}
          style={styles.dayCell}
          onPress={() => handleDayClick(day)}
        >
          <View style={[
            styles.dayNumber,
            hasEvent && styles.dayWithEvent
          ]}>
            <Text style={[
              styles.dayText,
              hasEvent && styles.dayTextWithEvent
            ]}>
              {day}
            </Text>
          </View>
          {hasEvent && <View style={styles.eventDot} />}
        </TouchableOpacity>
      );
    }

    // Preencher dias vazios no final para completar a última semana
    const totalCells = days.length;
    if (totalCells % 7 !== 0) {
      const emptyCells = 7 - (totalCells % 7);
      for (let i = 0; i < emptyCells; i++) {
        days.push(<View key={`empty-end-${i}`} style={styles.dayCell} />);
      }
    }

    // Dividir em semanas
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(
        <View key={`week-${i}`} style={styles.week}>
          {days.slice(i, i + 7)}
        </View>
      );
    }

    return weeks;
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Text style={styles.arrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => changeMonth(1)}>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekDaysHeader}>
            {weekDays.map((day, index) => (
              <Text key={index} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <ScrollView style={styles.calendarContainer}>
            {renderCalendar()}
          </ScrollView>

          {selectedDayEvents.length > 0 && (
            <View style={styles.eventsListContainer}>
              <Text style={styles.eventsListTitle}>
                Eventos do dia:
              </Text>
              <ScrollView style={styles.eventsList}>
                {selectedDayEvents.map((event) => {
                  // Mostra a data do evento formatada corretamente
                  const eventDate = new Date(event.date);
                  const formattedDate = `${eventDate.getDate().toString().padStart(2, '0')}/` +
                    `${(eventDate.getMonth() + 1).toString().padStart(2, '0')}/` +
                    `${eventDate.getFullYear()}`;
                  return (
                    <View key={event.id} style={styles.eventItem}>
                      <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => handleEventSelect(event)}
                      >
                        <Text style={styles.eventItemTitle}>{event.title}</Text>
                        <Text style={styles.eventItemLocation}>📍 {event.location}</Text>
                        <Text style={styles.eventItemDate}>Data: {formattedDate}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{marginLeft: 10, padding: 6, backgroundColor: '#eee', borderRadius: 6}}
                        onPress={() => handleEventSelect(event)}
                      >
                        <Text style={{color: '#007bff'}}>Editar</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Calendar;
