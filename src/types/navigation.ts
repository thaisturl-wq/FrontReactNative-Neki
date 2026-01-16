export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: {
    admin?: {
      id: number;
      name: string;
      email: string;
    };
  };
};
