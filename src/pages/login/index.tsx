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
import api from '../../service/api';
import { useAuth } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Login: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useAuth();
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
          const savedEmail = await AsyncStorage.getItem('userEmail');

          if (!savedEmail) {
            setEmail(DEFAULT_CREDENTIALS.email);
            setPassword(DEFAULT_CREDENTIALS.password);
          } else {
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

    if (!email.trim()) {
      setError('Por favor, insira seu e-mail.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (!password) {
      setError('Por favor, insira sua senha.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users/login', {
        email: email.trim().toLowerCase(),
        password
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Resposta de login inválida');
      }

      await signIn({ token, user });

      if (rememberPassword) {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword', password);
      }

      const adminData = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      navigation.navigate('Dashboard', { admin: adminData });
    } catch (err: any) {
      let errorMessage = 'Erro ao realizar login. Tente novamente.';

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 401 || status === 403) {
          errorMessage = 'E-mail ou senha incorretos.';
        } else if (status === 404) {
          errorMessage = 'Usuário não encontrado. Verifique o e-mail ou crie uma nova conta.';
        } else if (status === 400) {
          if (data?.message) {
            errorMessage = data.message;
          } else {
            errorMessage = 'Dados inválidos. Verifique suas credenciais.';
          }
        } else if (status >= 500) {
          errorMessage = 'Erro no servidor. Por favor, tente novamente em alguns instantes.';
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        }
      } else if (err.request) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error('[Login] Erro:', errorMessage);
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
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;