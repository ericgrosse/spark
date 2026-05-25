export const colors = {
  ink: "#1d252c",
  muted: "#60717d",
  canvas: "#fffaf7",
  surface: "#ffffff",
  line: "#e9ddd5",
  primary: "#d84f68",
  primaryStrong: "#b92e4c",
  accent: "#157a6e",
  warning: "#b7791f",
  danger: "#b83232"
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const radii = {
  sm: 6,
  md: 8,
  round: 999
};

export const typography = {
  family: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  h1: 34,
  h2: 24,
  body: 16,
  small: 13
};

export const cssVariables = `
:root {
  --color-ink: ${colors.ink};
  --color-muted: ${colors.muted};
  --color-canvas: ${colors.canvas};
  --color-surface: ${colors.surface};
  --color-line: ${colors.line};
  --color-primary: ${colors.primary};
  --color-primary-strong: ${colors.primaryStrong};
  --color-accent: ${colors.accent};
  --color-warning: ${colors.warning};
  --color-danger: ${colors.danger};
  --font-app: ${typography.family};
}
`;
