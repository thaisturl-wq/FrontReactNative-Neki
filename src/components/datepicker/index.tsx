import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from './style';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  error?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = 'Selecione a data', error }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return {
        year: parseInt(parts[0]),
        month: parseInt(parts[1]) - 1,
        day: parseInt(parts[2])
      };
    }
    return null;
  };

  const handleOpenModal = () => {
    const parsed = parseDate(value);
    if (parsed) {
      setSelectedYear(parsed.year);
      setSelectedMonth(parsed.month);
      setSelectedDay(parsed.day);
    } else {
      const today = new Date();
      setSelectedYear(today.getFullYear());
      setSelectedMonth(today.getMonth());
      setSelectedDay(null);
    }
    setShowModal(true);
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
  };

  const handleConfirm = () => {
    if (selectedDay) {
      const formatted = formatDate(selectedYear, selectedMonth, selectedDay);
      onChange(formatted);
      setShowModal(false);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days: (number | null)[] = [];

    // Adiciona espaços vazios antes do primeiro dia
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Adiciona os dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                day === selectedDay && styles.dayCellSelected
              ]}
              onPress={() => day && handleSelectDay(day)}
              disabled={!day}
            >
              {day ? (
                <Text style={[
                  styles.dayText,
                  day === selectedDay && styles.dayTextSelected
                ]}>
                  {day}
                </Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const displayValue = value || placeholder;
  const isPlaceholder = !value;

  return (
    <>
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={handleOpenModal}
      >
        <Text style={[styles.inputText, isPlaceholder && styles.placeholder]}>
          {displayValue}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => setSelectedYear(selectedYear - 1)}
                style={styles.navButton}
              >
                <Text style={styles.navText}>◄</Text>
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <TouchableOpacity
                  onPress={() => {
                    const newMonth = selectedMonth - 1;
                    if (newMonth < 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(newMonth);
                    }
                  }}
                  style={styles.monthNav}
                >
                  <Text style={styles.monthNavText}>◄</Text>
                </TouchableOpacity>

                <Text style={styles.headerText}>
                  {months[selectedMonth]} {selectedYear}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    const newMonth = selectedMonth + 1;
                    if (newMonth > 11) {
                      setSelectedMonth(0);
                      setSelectedYear(selectedYear + 1);
                    } else {
                      setSelectedMonth(newMonth);
                    }
                  }}
                  style={styles.monthNav}
                >
                  <Text style={styles.monthNavText}>►</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedYear(selectedYear + 1)}
                style={styles.navButton}
              >
                <Text style={styles.navText}>►</Text>
              </TouchableOpacity>
            </View>

            {renderCalendar()}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, !selectedDay && styles.confirmButtonDisabled]}
                onPress={handleConfirm}
                disabled={!selectedDay}
              >
                <Text style={styles.confirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DatePicker;
