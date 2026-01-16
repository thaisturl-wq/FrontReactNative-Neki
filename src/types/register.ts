export interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFocusState {
  nameFocused: boolean;
  emailFocused: boolean;
  passwordFocused: boolean;
  confirmFocused: boolean;
}

export interface RegisterUIState {
  loading: boolean;
  error: string | null;
  success: boolean;
}
