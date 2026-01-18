import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import eventService from '../../service/eventService';
import type { EventModalProps } from '../../types/component';
import styles from './style';

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, editingEvent }) => {
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [titleFocused, setTitleFocused] = useState(false);
  const [dayFocused, setDayFocused] = useState(false);
  const [monthFocused, setMonthFocused] = useState(false);
  const [yearFocused, setYearFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const [imageFocused, setImageFocused] = useState(false);
  const [error, setError] = useState<string>('');
  const [titleError, setTitleError] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  const [locationError, setLocationError] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || '');
      if (editingEvent.date) {
        const parts = editingEvent.date.split('-');
        if (parts.length === 3) {
          setYear(parts[0]);
          setMonth(parts[1]);
          setDay(parts[2]);
        }
      }
      setLocation(editingEvent.location || '');
      setImageUrl(editingEvent.imageUrl || '');
    } else {
      setTitle('');
      setDay('');
      setMonth('');
      setYear('');
      setLocation('');
      setImageUrl('');
    }
    setError('');
    setTitleError('');
    setDateError('');
    setLocationError('');
    setImageError('');
  }, [editingEvent, isOpen]);

  const handleSave = async () => {
    setError('');
    setTitleError('');
    setDateError('');
    setLocationError('');
    setImageError('');

    let hasError = false;

    // Validação de título (apenas ao criar)
    if (!editingEvent && !title.trim()) {
      setTitleError('Título é obrigatório');
      hasError = true;
    }

    if (!day.trim() || !month.trim() || !year.trim()) {
      setDateError('Dia, mês e ano são obrigatórios');
      hasError = true;
    } else {
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      if (dayNum < 1 || dayNum > 31) {
        setDateError('Dia inválido (1-31)');
        hasError = true;
      } else if (monthNum < 1 || monthNum > 12) {
        setDateError('Mês inválido (1-12)');
        hasError = true;
      } else if (yearNum < 1900 || yearNum > 2100) {
        setDateError('Ano inválido');
        hasError = true;
      } else {
        const formattedDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        const selectedDate = new Date(formattedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          setDateError('Não é possível criar eventos no passado');
          hasError = true;
        }
      }
    }

    if (!location.trim()) {
      setLocationError('Local é obrigatório');
      hasError = true;
    }

    if (!editingEvent) {
      if (!imageUrl.trim()) {
        setImageError('URL da imagem é obrigatória');
        hasError = true;
      } else if (!/^https?:\/\/.+/.test(imageUrl)) {
        setImageError('URL inválida');
        hasError = true;
      }
    }

    if (hasError) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const adminId = await AsyncStorage.getItem('adminId');

    const formattedDate = `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    try {
      if (editingEvent) {
        const updatePayload = {
          date: formattedDate,
          location: location.trim(),
        };
        await eventService.updateEvent(editingEvent.id, updatePayload);
      } else {
        const eventData = {
          title: title.trim(),
          description: '',
          date: formattedDate,
          location: location.trim(),
          imageUrl: imageUrl.trim(),
          adminId: adminId ? parseInt(adminId) : 1,
        };
        await eventService.createEvent(eventData);
      }
      onSave();
    } catch (error: any) {
      console.error('Erro ao salvar evento:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erro ao salvar evento. Tente novamente.');
      }
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {editingEvent ? 'Editar Evento' : 'Novo Evento'}
            </Text>
            <TouchableOpacity style={styles.btnClose} onPress={onClose}>
              <Text style={styles.iconClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {editingEvent && (
              <View style={styles.editModeBanner}>
                <Text style={styles.editModeTitle}>Modo Edição</Text>
                <Text style={styles.editModeText}>Apenas data e localização podem ser alteradas</Text>
              </View>
            )}

            {!editingEvent && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Título do Evento *</Text>
                <TextInput
                  style={[
                    styles.input,
                    titleFocused && styles.inputFocused,
                    titleError && { borderColor: '#c33', borderWidth: 1 }
                  ]}
                  placeholder="Ex: Conferência Anual"
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    if (text.trim()) setTitleError('');
                  }}
                  onFocus={() => setTitleFocused(true)}
                  onBlur={() => setTitleFocused(false)}
                />
                {titleError ? <Text style={{ color: '#c33', fontSize: 12, marginTop: 4 }}>{titleError}</Text> : null}
              </View>
            )}

            {editingEvent && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Título do Evento</Text>
                <View style={{ backgroundColor: '#f5f5f5', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' }}>
                  <Text style={{ fontSize: 15, color: '#666' }}>{title}</Text>
                </View>
              </View>
            )}

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Dia *</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputSmall,
                    dayFocused && styles.inputFocused,
                    dateError && { borderColor: '#c33', borderWidth: 1 }
                  ]}
                  placeholder="DD"
                  value={day}
                  onChangeText={(text) => {
                    if (/^\d{0,2}$/.test(text)) {
                      setDay(text);
                      if (text) setDateError('');
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={2}
                  onFocus={() => setDayFocused(true)}
                  onBlur={() => setDayFocused(false)}
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Mês *</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputSmall,
                    monthFocused && styles.inputFocused,
                    dateError && { borderColor: '#c33', borderWidth: 1 }
                  ]}
                  placeholder="MM"
                  value={month}
                  onChangeText={(text) => {
                    if (/^\d{0,2}$/.test(text)) {
                      setMonth(text);
                      if (text) setDateError('');
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={2}
                  onFocus={() => setMonthFocused(true)}
                  onBlur={() => setMonthFocused(false)}
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Ano *</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputSmall,
                    yearFocused && styles.inputFocused,
                    dateError && { borderColor: '#c33', borderWidth: 1 }
                  ]}
                  placeholder="AAAA"
                  value={year}
                  onChangeText={(text) => {
                    if (/^\d{0,4}$/.test(text)) {
                      setYear(text);
                      if (text) setDateError('');
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={4}
                  onFocus={() => setYearFocused(true)}
                  onBlur={() => setYearFocused(false)}
                />
              </View>
            </View>
            {dateError ? (
              <Text style={{ color: '#c33', fontSize: 12, marginTop: 4, marginBottom: 8 }}>{dateError}</Text>
            ) : null}

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Local *</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputSmall,
                    locationFocused && styles.inputFocused,
                    locationError && { borderColor: '#c33', borderWidth: 1 }
                  ]}
                  placeholder="Ex: São Paulo"
                  value={location}
                  onChangeText={(text) => {
                    setLocation(text);
                    if (text.trim()) setLocationError('');
                  }}
                  onFocus={() => setLocationFocused(true)}
                  onBlur={() => setLocationFocused(false)}
                />
                {locationError ? <Text style={{ color: '#c33', fontSize: 12, marginTop: 4 }}>{locationError}</Text> : null}
              </View>
            </View>

            {!editingEvent && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>URL da Imagem *</Text>
                <TextInput
                  style={[
                    styles.input,
                    imageFocused && styles.inputFocused,
                    imageError && { borderColor: '#c33', borderWidth: 1 }
                  ]}
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={imageUrl}
                  onChangeText={(text) => {
                    setImageUrl(text);
                    if (text.trim()) setImageError('');
                  }}
                  onFocus={() => setImageFocused(true)}
                  onBlur={() => setImageFocused(false)}
                />
                {imageError ? <Text style={{ color: '#c33', fontSize: 12, marginTop: 4 }}>{imageError}</Text> : null}
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={onClose}
              >
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSubmit}
                onPress={handleSave}
              >
                <Text style={styles.btnSubmitText}>
                  {editingEvent ? 'Atualizar' : 'Criar Evento'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EventModal;