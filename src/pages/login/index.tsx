import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';
import type { RootStackParamList } from '../../types/navigation';
import { DEFAULT_CREDENTIALS } from '../../config/credentials';
import ClockIcon from '../../components/ClockIcon';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Login: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasSpecialChar: false,
  });
  const [emailValid, setEmailValid] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    return hasUpperCase && hasSpecialChar && hasMinLength;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    const isValid = validateEmail(text);
    setEmailValid(isValid);
    if (text && !isValid) {
      setEmailError('E-mail inválido');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const requirements = {
      minLength: text.length >= 8,
      hasUpperCase: /[A-Z]/.test(text),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(text),
    };
    setPasswordRequirements(requirements);
    
    const isValid = requirements.minLength && requirements.hasUpperCase && requirements.hasSpecialChar;
    if (text && !isValid) {
      setPasswordError('Preencha todos os requisitos');
    } else {
      setPasswordError('');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const initializeCredentials = async (): Promise<void> => {
        try {
          // Verifica se já existe usuário cadastrado
          const savedEmail = await AsyncStorage.getItem('userEmail');
          
          if (!savedEmail) {
            // Se não existir, salva as credenciais padrão
            await AsyncStorage.setItem('userEmail', DEFAULT_CREDENTIALS.email);
            await AsyncStorage.setItem('userPassword', DEFAULT_CREDENTIALS.password);
            await AsyncStorage.setItem('userName', DEFAULT_CREDENTIALS.name);
            
            // Preenche os campos para facilitar o primeiro login
            setEmail(DEFAULT_CREDENTIALS.email);
            setPassword(DEFAULT_CREDENTIALS.password);
          } else {
            // Carrega credenciais salvas
            setEmail(savedEmail);
            const savedPassword = await AsyncStorage.getItem('userPassword');
            if (savedPassword) setPassword(savedPassword);
          }
        } catch (err) {
          console.error('Erro ao inicializar credenciais:', err);
        }
      };
      initializeCredentials();
    }, [])
  );

  const handleSubmit = async (): Promise<void> => {
    setError(null);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // Validação local das credenciais
    if (email !== DEFAULT_CREDENTIALS.email || password !== DEFAULT_CREDENTIALS.password) {
      setError('Email ou senha incorretos.');
      return;
    }

    setLoading(true);
    try {
      // Autenticação local sem backend
      const admin = {
        id: 1,
        name: DEFAULT_CREDENTIALS.name,
        email: DEFAULT_CREDENTIALS.email,
      };
      const token = 'local-token-' + Date.now();
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('adminId', admin.id.toString());

      if (rememberPassword) {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword', password);
        await AsyncStorage.setItem('userName', admin.name);
      }

      navigation.navigate('Dashboard', { admin });
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.statusBarPlaceholder} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.logoIcon}>
            <ClockIcon size={84} color="#000000" />
          </View>
          <Text style={styles.brand}>Bem-vindo</Text>
          <Text style={styles.title}>Acesse sua conta</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>E-mail Administrativo</Text>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused, emailError && styles.inputError]}
              placeholder="admin@exemplo.com"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
            {email && emailValid ? (
              <Text style={styles.fieldSuccess}>✓ E-mail válido</Text>
            ) : emailError ? (
              <Text style={styles.fieldError}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.inputPassword, passwordFocused && styles.inputFocused, passwordError && styles.inputError]}
                placeholder="••••••••"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? '○' : '●'}</Text>
              </TouchableOpacity>
            </View>
            {password ? (
              <View style={styles.requirementsContainer}>
                <Text style={[styles.requirement, passwordRequirements.minLength && styles.requirementMet]}>
                  {passwordRequirements.minLength ? '✓' : '○'} Mínimo 8 caracteres
                </Text>
                <Text style={[styles.requirement, passwordRequirements.hasUpperCase && styles.requirementMet]}>
                  {passwordRequirements.hasUpperCase ? '✓' : '○'} 1 letra maiúscula
                </Text>
                <Text style={[styles.requirement, passwordRequirements.hasSpecialChar && styles.requirementMet]}>
                  {passwordRequirements.hasSpecialChar ? '✓' : '○'} 1 caractere especial (!@#$%...)
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.formOptions}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => setRememberPassword(!rememberPassword)}
            >
              <View style={[styles.checkboxBox, rememberPassword && styles.checkboxBoxChecked]}>
                {rememberPassword && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.checkboxLabel}>Salvar senha</Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorMessage}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Processando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Não possui conta?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
              Criar Nova Conta
            </Text>
          </Text>
          <Text style={[styles.footerText, { marginTop: 16, fontSize: 10, color: '#d4d4d4' }]}>
            Credenciais padrão: {DEFAULT_CREDENTIALS.email} / {DEFAULT_CREDENTIALS.password}
          </Text>
        </View>
      </View>
        </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;