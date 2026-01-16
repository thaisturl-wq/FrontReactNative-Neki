import React, { useEffect } from 'react';
import { Animated, View, Text } from 'react-native';
import styles from './style';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, visible, duration = 3000 }) => {
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, slideAnim, duration]);

  if (!visible) return null;

  const backgroundColor = type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6';

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }], backgroundColor },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

export default Toast;
