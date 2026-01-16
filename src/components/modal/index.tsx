import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import eventService from '../../service/eventService';
import type { EventModalProps } from '../../types/component';
import styles from './style';

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, editingEvent }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
  const [dateFocused, setDateFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const [imageFocused, setImageFocused] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || '');
      setDescription(editingEvent.description || '');
      setDate(editingEvent.date || '');
      setLocation(editingEvent.location || '');
      setImageUrl(editingEvent.imageUrl || '');
    } else {
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setImageUrl('');
    }
  }, [editingEvent, isOpen]);

  const handleSave = async () => {
    if (!title) return;

    const adminId = await AsyncStorage.getItem('adminId');
    
    const eventData = {
      title,
      description,
      date,
      location,
      imageUrl,
      adminId: adminId ? parseInt(adminId) : 1,
    };

    try {
      if (editingEvent) {
        // Atualiza evento existente
        await eventService.updateEvent(editingEvent.id, eventData);
      } else {
        // Cria novo evento
        await eventService.createEvent(eventData);
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
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
            <View style={styles.formGroup}>
              <Text style={styles.label}>Título do Evento</Text>
              <TextInput
                style={[styles.input, titleFocused && styles.inputFocused]}
                placeholder="Ex: Conferência Anual"
                value={title}
                onChangeText={setTitle}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, descFocused && styles.inputFocused, { minHeight: 80 }]}
                placeholder="Descreva o evento..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Data</Text>
                <TextInput
                  style={[styles.input, styles.inputSmall, dateFocused && styles.inputFocused]}
                  placeholder="DD/MM/AAAA"
                  value={date}
                  onChangeText={setDate}
                  onFocus={() => setDateFocused(true)}
                  onBlur={() => setDateFocused(false)}
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Local</Text>
                <TextInput
                  style={[styles.input, styles.inputSmall, locationFocused && styles.inputFocused]}
                  placeholder="Ex: São Paulo"
                  value={location}
                  onChangeText={setLocation}
                  onFocus={() => setLocationFocused(true)}
                  onBlur={() => setLocationFocused(false)}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>URL da Imagem</Text>
              <TextInput
                style={[styles.input, imageFocused && styles.inputFocused]}
                placeholder="https://exemplo.com/imagem.jpg"
                value={imageUrl}
                onChangeText={setImageUrl}
                onFocus={() => setImageFocused(true)}
                onBlur={() => setImageFocused(false)}
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.btnCancel}
                onPress={onClose}
              >
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.btnSubmit, !title && styles.btnSubmitDisabled]}
                onPress={handleSave}
                disabled={!title}
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