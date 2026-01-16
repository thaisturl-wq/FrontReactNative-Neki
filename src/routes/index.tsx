import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackRoutes from './stackroutes';

const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <StackRoutes />
    </NavigationContainer>
  );
};

export default Routes;