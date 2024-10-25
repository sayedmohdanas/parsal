// theme.js
import Colors from './Colors';
import { responsiveFontSize, responsiveHeight ,responsiveWidth} from './metrices';

export const Fonts = {
  regular: '400',
  semilarge:'500',
  medium: '600',
  bold: '700',
};

export const FontSizes = {
  xsmall:responsiveFontSize(12),
  small: responsiveFontSize(12),
  medium: responsiveFontSize(14),
  semiLarge:responsiveFontSize(16),
  large: responsiveFontSize(18),
  xlarge:responsiveFontSize(20)
};

export const LineHeights = {
  small: responsiveHeight(14.52),
  medium: responsiveHeight(18),
  large: responsiveHeight(22),
};

export const Spacing = {
  small: responsiveHeight(8),
  medium: responsiveHeight(16),
  large: responsiveHeight(24),
};

export const CommonStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.homeBackground,
  },
  centerAligned: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: FontSizes.large,
    fontWeight: Fonts.bold,
    color: Colors.black,
  },
  bodyText: {
    fontSize: FontSizes.medium,
    fontWeight: Fonts.regular,
    color: Colors.black,
  },
  subText: {
    fontSize: FontSizes.small,
    fontWeight: Fonts.regular,
    color: '#777777',
  },
};
