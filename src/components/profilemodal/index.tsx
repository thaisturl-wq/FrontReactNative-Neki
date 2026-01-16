import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: { id: number; name: string; email: string } | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, admin }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleStartPasswordChange = async () => {
    setIsChangingPassword(true);
    // Carregar senha atual do AsyncStorage para autocomplete
    try {
      const savedPassword = await AsyncStorage.getItem('userPassword');
      if (savedPassword) {
        setCurrentPassword(savedPassword);
      }
    } catch (error) {
      console.error('Erro ao carregar senha:', error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      // Atualização local da senha
      await AsyncStorage.setItem('userPassword', newPassword);
      
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      Alert.alert('Erro', 'Não foi possível alterar a senha');
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangingPassword(false);
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

            <View style={styles.divider} />

            {!isChangingPassword ? (
              <TouchableOpacity 
                style={styles.btnChangePassword}
                onPress={handleStartPasswordChange}
              >
                <Text style={styles.btnChangePasswordText}>Alterar Senha</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.passwordSection}>
                <Text style={styles.sectionTitle}>Alterar Senha</Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Senha Atual</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha atual"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    autoComplete="password"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nova Senha</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite a nova senha"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Confirmar Nova Senha</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirme a nova senha"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.btnCancel}
                    onPress={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    <Text style={styles.btnCancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.btnSubmit, (!currentPassword || !newPassword || !confirmPassword) && styles.btnSubmitDisabled]}
                    onPress={handleChangePassword}
                    disabled={!currentPassword || !newPassword || !confirmPassword}
                  >
                    <Text style={styles.btnSubmitText}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProfileModal;
