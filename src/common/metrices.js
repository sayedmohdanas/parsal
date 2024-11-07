import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base dimensions (for example, designed for iPhone 11 screen size)
const baseWidth = 375; // Width of the screen used for design
const baseHeight = 812; // Height of the screen used for design

// Calculate responsive width
export const responsiveWidth = (w) => {
  return (w / baseWidth) * width;
};

// Calculate responsive height
export const responsiveHeight = (h) => {
  return (h / baseHeight) * height;
};

// Calculate responsive font size
export const responsiveFontSize = (f) => {
  const baseScale = Math.min(width / baseWidth, height / baseHeight);
  const scale = PixelRatio.getFontScale();
// * scale * baseScale
  return f ;
};
export const SmallPhone = () => {
  if(width<=375) 
     return true
  else 
     return false
}
