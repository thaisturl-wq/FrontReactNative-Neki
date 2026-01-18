import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Svg, Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';
import type { RootStackParamList } from '../../types/navigation';
import ClockIcon from '../../components/ClockIcon';
import api from '../../service/api';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
const isMobile = width < 480;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Register: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useAuth();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const [nameFocused, setNameFocused] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [confirmFocused, setConfirmFocused] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
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
      const loadDefaultCredentials = async () => {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        if (!savedEmail) {
          setName('Admin Demo');
          setEmail('admin@demo.com');
          setPassword('123456');
          setConfirmPassword('123456');
        }
      };
      loadDefaultCredentials();
    }, [])
  );

  const handleSubmit = async (): Promise<void> => {
    setError(null);

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (!validatePassword(password)) {
      setError('A senha deve ter mínimo 8 caracteres, 1 letra maiúscula e 1 caractere especial.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas digitadas não são idênticas.');
      return;
    }

    setLoading(true);
    try {
      // Chamada real à API
      console.log('[Register] Iniciando cadastro para:', email);
      await api.post('/users', {
        name,
        email,
        password
      });

      // Cadastro bem-sucedido
      console.log('[Register] Cadastro realizado com sucesso! Tentando login automático...');

      try {
        // Tenta fazer login automático
        const loginResponse = await api.post('/users/login', {
          email,
          password
        });

        const { token, user } = loginResponse.data;
        await signIn({ token, user });

        const admin = { id: user.id, name: user.name, email: user.email };

        setSuccess(true);
        setTimeout(() => {
          navigation.navigate('Dashboard', { admin });
        }, 1500);

      } catch (loginErr) {
        console.warn('[Register] Cadastro ok, mas login automático falhou. Redirecionando para tela de Login.');
        setSuccess(true);
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      }

    } catch (err: any) {
      // Tenta extrair mensagem de erro do backend
      let errorMessage = 'Falha ao processar cadastro.';

      if (err.response) {
        // Erro de resposta do servidor (4xx, 5xx)
        console.error('=== ERRO DE RESPOSTA DO BACKEND ===');
        console.error('Status:', err.response.status);
        console.error('Status Text:', err.response.statusText);
        console.error('Headers:', JSON.stringify(err.response.headers, null, 2));
        console.error('Data (tipo):', typeof err.response.data);
        console.error('Data (conteúdo):', JSON.stringify(err.response.data, null, 2));
        console.error('===================================');

        if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else {
          errorMessage = `Erro ${err.response.status}: ${err.response.statusText || 'Erro no servidor'}`;
        }
      } else if (err.request) {
        // Requisição foi feita mas não houve resposta
        console.error('Erro de conexão:', err.request);
        errorMessage = 'Erro de conexão com o servidor. Verifique se o backend está rodando.';
      } else {
        // Erro ao configurar a requisição
        console.error('Erro:', err.message);
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error('Erro de registro:', err);
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
                <ClockIcon size={56} color="#000000" />
              </View>
              <Text style={styles.brand}>Nova Credencial</Text>
              <Text style={styles.title}>Crie seu perfil</Text>
            </View>

            {success ? (
              <View style={styles.successState}>
                <View style={styles.successIcon}>
                  <Svg style={styles.iconCheck} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </Svg>
                </View>
                <Text style={styles.successTitle}>Sucesso absoluto!</Text>
                <Text style={styles.successText}>Suas credenciais foram registradas. Redirecionando...</Text>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>Nome Completo</Text>
                  <TextInput
                    style={[styles.input, nameFocused && styles.inputFocused]}
                    placeholder="Como devemos chamá-lo?"
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                  />
                </View>

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

                <View style={[styles.formRow, isMobile && styles.formRowMobile]}>
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
                  <View style={styles.field}>
                    <Text style={styles.label}>Confirmar</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={[styles.inputPassword, confirmFocused && styles.inputFocused]}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        onFocus={() => setConfirmFocused(true)}
                        onBlur={() => setConfirmFocused(false)}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Text style={styles.eyeText}>{showConfirmPassword ? '○' : '●'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {error && <Text style={styles.errorMessage}>{error}</Text>}

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Processando...' : 'Finalizar Cadastro'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {!success && (
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Já possui conta?{' '}
                  <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                    Voltar ao Login
                  </Text>
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;