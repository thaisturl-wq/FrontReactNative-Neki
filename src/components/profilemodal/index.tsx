
import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './style';


interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: { id: number; name: string; email: string } | null;
}


const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, admin }) => {
  const handleClose = () => {
    onClose();
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
          onPress={handleClose}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Perfil do Usuário</Text>
            <TouchableOpacity style={styles.btnClose} onPress={handleClose}>
              <Text style={styles.iconClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.form}>
            <View style={styles.infoSection}>
              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoValue}>{admin?.name || 'Não informado'}</Text>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{admin?.email || 'Não informado'}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProfileModal;
