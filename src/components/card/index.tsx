import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import type { EventCardProps } from '../../types/component';
import styles from './style';

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete, style }) => {
  const formatDate = (dateString: string): string => {
    try {
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const day = parts[0];
          const monthNum = parseInt(parts[1]);
          const year = parts[2];
          const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
          return `${day} de ${months[monthNum - 1]} de ${year}`;
        }
      }
      
      // Se for ISO ou outro formato
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, { backgroundColor: '#f5f5f5' }]} />
        )}
        
        {/* Actions Overlay */}
        <View style={styles.actionsOverlay}>
          <TouchableOpacity style={styles.btnDelete} onPress={onDelete}>
            <Text style={styles.iconBtnWhite}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnEdit} onPress={onEdit}>
            <Text style={styles.iconBtn}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.date}>{formatDate(event.date)}</Text>
        
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {event.title}
        </Text>

        {event.location && (
          <Text style={styles.location} numberOfLines={1}>{event.location}</Text>
        )}
      </View>
    </View>
  );
};

export default EventCard;