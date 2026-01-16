import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ClockIconProps {
  size?: number;
  color?: string;
}

const ClockIcon: React.FC<ClockIconProps> = ({ size = 32, color = '#ffffff' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 11c0 3.517-1.009 6.799-2.753 9.571"/>
      <Path d="M6.807 18.531l.054-.09A10.003 10.003 0 0012 3v1"/>
      <Path d="M12 19v1"/>
      <Path d="M21 12h-1"/>
      <Path d="M3 12H3"/>
      <Path d="M15.364 18.364l-.707-.707"/>
      <Path d="M6.343 6.343l-.707-.707"/>
      <Path d="M19.071 6.343l-.707.707"/>
      <Path d="M6.343 17.657l-.707.707"/>
    </Svg>
  );
};

export default ClockIcon;
