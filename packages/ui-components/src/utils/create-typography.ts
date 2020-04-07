interface CustomTypography {
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
}

export const createTypography = (size: number, lineHeight: number, fontWeight: number, fontFamily = 'inherit', color = '#1a1a1a', letterSpacing = 0): CustomTypography => ({
  color,
  fontFamily,
  fontSize: size,
  fontWeight,
  letterSpacing,
  lineHeight: lineHeight
});
