import { Platform } from "react-native";

// ─── Color Palette ────────────────────────────────────────────────────────────
//
// Base palette — raw values, not meant for direct use in components.
// Use the semantic Colors object below instead.

const Palette = {
  // Backgrounds — darkest to lightest
  black: "#0a0a0f", // true screen bg
  ink900: "#0e0e16", // alternate deep bg
  ink800: "#16161f", // surface / card
  ink700: "#1e1e2e", // raised surface
  ink600: "#252535", // hover state
  ink500: "#2a2a3a", // border default
  ink400: "#3a3a4a", // border hover / divider
  ink300: "#4a4a60", // disabled elements

  // Text
  white: "#e8e8f0", // primary text
  slate400: "#9898b8", // secondary text
  slate600: "#5a5a78", // muted / placeholder
  slate700: "#44445a", // very muted / hint

  // Accent — purple/violet
  accent400: "#8b83ff", // light accent (icons on dark)
  accent500: "#6c63ff", // primary accent
  accent600: "#5548e0", // pressed accent
  accentGlow: "rgba(108,99,255,0.15)",
  accentBorder: "rgba(108,99,255,0.30)",
  accentDeep: "rgba(108,99,255,0.08)",

  // Green — success / completed
  green400: "#6ee7b7",
  green500: "#34d399",
  green600: "#10b981",
  greenGlow: "rgba(52,211,153,0.10)",
  greenBorder: "rgba(52,211,153,0.25)",
  greenDeep: "rgba(52,211,153,0.06)",

  // Red — danger / destructive
  red400: "#fca5a5",
  red500: "#f87171",
  red600: "#ef4444",
  redGlow: "rgba(239,68,68,0.15)",
  redBorder: "rgba(239,68,68,0.25)",
  redDeep: "rgba(239,68,68,0.08)",

  // Amber — warning
  amber400: "#fcd34d",
  amber500: "#f59e0b",
  amber600: "#d97706",
  amberGlow: "rgba(245,158,11,0.15)",
  amberBorder: "rgba(245,158,11,0.25)",
  amberDeep: "rgba(245,158,11,0.08)",

  // Blue — info / links (legacy, prefer accent)
  blue400: "#93c5fd",
  blue500: "#3b82f6",
  blue600: "#2563eb",
  blueGlow: "rgba(59,130,246,0.15)",
  blueBorder: "rgba(59,130,246,0.25)",
  blueDeep: "rgba(59,130,246,0.08)",
} as const;

// ─── Semantic Colors ───────────────────────────────────────────────────────────
//
// These are what you actually use in components.
// Named by role, not by raw color value.

export const Colors = {
  // ── Backgrounds ──────────────────────────────────────────────────────────
  bg: {
    /** True screen background */
    screen: Palette.black,
    /** Default card / surface */
    card: Palette.ink800,
    /** Raised element (input bg, hover target) */
    raised: Palette.ink700,
    /** Hover / pressed surface */
    hover: Palette.ink600,
    /** Disabled element fill */
    disabled: Palette.ink300,
  },

  // ── Borders ───────────────────────────────────────────────────────────────
  border: {
    /** Default subtle border */
    default: Palette.ink500,
    /** Hover / emphasis border */
    emphasis: Palette.ink400,
    /** Very faint separator */
    faint: Palette.ink800,
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  text: {
    /** Primary — headings, values */
    primary: Palette.white,
    /** Secondary — labels, subtitles */
    secondary: Palette.slate400,
    /** Muted — hints, placeholders */
    muted: Palette.slate600,
    /** Disabled text */
    disabled: Palette.slate700,
    /** Text on accent bg */
    inverse: "#ffffff",
  },

  // ── Accent (Purple) ───────────────────────────────────────────────────────
  accent: {
    /** Icon on dark surface, light variant */
    light: Palette.accent400,
    /** Default accent — buttons, active states */
    default: Palette.accent500,
    /** Pressed / darker */
    dark: Palette.accent600,
    /** Soft tint fill */
    soft: Palette.accentGlow,
    /** Soft fill — deeper */
    deep: Palette.accentDeep,
    /** Accent border */
    border: Palette.accentBorder,
  },

  // ── Success (Green) ───────────────────────────────────────────────────────
  success: {
    light: Palette.green400,
    default: Palette.green500,
    dark: Palette.green600,
    soft: Palette.greenGlow,
    deep: Palette.greenDeep,
    border: Palette.greenBorder,
  },

  // ── Danger (Red) ──────────────────────────────────────────────────────────
  danger: {
    light: Palette.red400,
    default: Palette.red500,
    dark: Palette.red600,
    soft: Palette.redGlow,
    deep: Palette.redDeep,
    border: Palette.redBorder,
  },

  // ── Warning (Amber) ───────────────────────────────────────────────────────
  warning: {
    light: Palette.amber400,
    default: Palette.amber500,
    dark: Palette.amber600,
    soft: Palette.amberGlow,
    deep: Palette.amberDeep,
    border: Palette.amberBorder,
  },

  // ── Info (Blue — legacy) ──────────────────────────────────────────────────
  info: {
    light: Palette.blue400,
    default: Palette.blue500,
    dark: Palette.blue600,
    soft: Palette.blueGlow,
    deep: Palette.blueDeep,
    border: Palette.blueBorder,
  },

  // ── Difficulty ────────────────────────────────────────────────────────────
  difficulty: {
    beginner: Palette.green500,
    intermediate: Palette.amber500,
    advanced: Palette.red500,
    unknown: Palette.slate600,
  },

  // ── Heatmap scale (0–5 workouts/day) ─────────────────────────────────────
  heatmap: [
    "rgba(39,39,58,0.5)", // 0 — none
    "#1e3a8a", // 1 — very low
    "#1d4ed8", // 2
    "#2563eb", // 3
    "#6c63ff", // 4 — accent ramp
    "#8b83ff", // 5+ — brightest
  ],
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
//
// Font size scale + weight presets.
// All sizes in px (React Native uses dp, which maps 1:1 on most devices).

export const Typography = {
  // ── Font families ─────────────────────────────────────────────────────────
  family: {
    /** Default sans-serif — system font stack */
    sans: Platform.OS === "ios" ? "System" : "sans-serif",
    /** Monospace — for timer, numbers, code */
    mono: Platform.OS === "ios" ? "Courier New" : "monospace",
  },

  // ── Size scale ─────────────────────────────────────────────────────────────
  size: {
    /** 9px — micro labels, badges */
    micro: 9,
    /** 10px — captions, hints */
    caption: 10,
    /** 11px — small labels */
    xs: 11,
    /** 12px — secondary labels, metadata */
    sm: 12,
    /** 13px — body small, button text */
    base: 13,
    /** 15px — body, list items */
    md: 15,
    /** 17px — section titles */
    lg: 17,
    /** 20px — card headings */
    xl: 20,
    /** 24px — screen titles */
    "2xl": 24,
    /** 28px — timer, hero numbers */
    "3xl": 28,
    /** 36px — large hero stat */
    "4xl": 36,
    /** 48px — max display */
    "5xl": 48,
  },

  // ── Weight presets ─────────────────────────────────────────────────────────
  weight: {
    light: "300" as const,
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  // ── Line height scale ──────────────────────────────────────────────────────
  leading: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.7,
  },

  // ── Letter spacing ─────────────────────────────────────────────────────────
  tracking: {
    tighter: -0.5,
    tight: -0.3,
    normal: 0,
    wide: 0.1,
    wider: 0.5,
    widest: 1.2,
  },
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────
//
// 4pt base grid. Use these values for padding, margin, gap.
// Never use raw numbers in components — always use Spacing.X.

export const Spacing = {
  /** 2px */ px: 2,
  /** 4px */ "1": 4,
  /** 6px */ "1.5": 6,
  /** 8px */ "2": 8,
  /** 10px */ "2.5": 10,
  /** 12px */ "3": 12,
  /** 14px */ "3.5": 14,
  /** 16px */ "4": 16,
  /** 20px */ "5": 20,
  /** 24px */ "6": 24,
  /** 28px */ "7": 28,
  /** 32px */ "8": 32,
  /** 40px */ "10": 40,
  /** 48px */ "12": 48,
  /** 56px */ "14": 56,
  /** 64px */ "16": 64,
} as const;

// ─── Border Radii ─────────────────────────────────────────────────────────────
//
// Named by shape intent, not raw value.

export const Radii = {
  /** 6px — small tags, mini badges */
  sm: 6,
  /** 10px — inputs, small buttons */
  md: 10,
  /** 14px — cards, set rows */
  lg: 14,
  /** 18px — large cards, modals */
  xl: 18,
  /** 24px — screen-level cards */
  "2xl": 24,
  /** 32px — hero cards */
  "3xl": 32,
  /** 9999px — pill / fully round */
  full: 9999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
//
// React Native shadow props — iOS uses shadow*, Android uses elevation.
// Apply both for cross-platform consistency.

export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 10,
  },
  /** Accent-colored glow — use on primary CTA buttons */
  accent: {
    shadowColor: "#6c63ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  /** Success glow — use on completed state elements */
  success: {
    shadowColor: "#34d399",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
} as const;

// ─── Component Presets ────────────────────────────────────────────────────────
//
// Reusable style objects for common component patterns.
// These combine tokens above into ready-to-spread StyleSheet objects.

export const ComponentStyles = {
  // ── Screens ───────────────────────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: Colors.bg.screen,
  },

  // ── Cards ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radii["2xl"],
    borderWidth: 1,
    borderColor: Colors.border.default,
    padding: Spacing["5"],
  },
  cardSm: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.border.default,
    padding: Spacing["4"],
  },

  // ── Stat tiles (inside cards) ──────────────────────────────────────────────
  statTile: {
    flex: 1,
    backgroundColor: Colors.bg.raised,
    borderRadius: Radii.lg,
    padding: Spacing["4"],
  },

  // ── Icon containers ───────────────────────────────────────────────────────
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  iconWrapLg: {
    width: 48,
    height: 48,
    borderRadius: Radii.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  btnPrimary: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    paddingVertical: Spacing["4"],
    borderRadius: Radii.xl,
    backgroundColor: Colors.accent.default,
  },
  btnSecondary: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    paddingVertical: Spacing["4"],
    borderRadius: Radii.xl,
    backgroundColor: Colors.bg.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  btnDanger: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    paddingVertical: Spacing["4"],
    borderRadius: Radii.xl,
    backgroundColor: Colors.danger.deep,
    borderWidth: 1,
    borderColor: Colors.danger.border,
  },
  btnSuccess: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    paddingVertical: Spacing["4"],
    borderRadius: Radii.xl,
    backgroundColor: Colors.success.deep,
    borderWidth: 1,
    borderColor: Colors.success.border,
  },

  // ── Text inputs ───────────────────────────────────────────────────────────
  input: {
    backgroundColor: Colors.bg.screen,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: Radii.lg,
    paddingVertical: Spacing["3"],
    paddingHorizontal: Spacing["4"],
    fontSize: Typography.size.md,
    color: Colors.text.primary,
  },

  // ── Badges ────────────────────────────────────────────────────────────────
  badge: {
    paddingHorizontal: Spacing["3"],
    paddingVertical: 3,
    borderRadius: Radii.full,
    borderWidth: 1,
  },

  // ── Dividers ─────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: Colors.border.faint,
    marginVertical: Spacing["4"],
  },
  dividerHorizontal: {
    width: 1,
    backgroundColor: Colors.border.default,
  },

  // ── List rows (settings, menu items) ──────────────────────────────────────
  listRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: Spacing["4"],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.faint,
  },

  // ── Section headers ───────────────────────────────────────────────────────
  sectionHeader: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text.muted,
    letterSpacing: Typography.tracking.widest,
    marginBottom: Spacing["2"],
    marginTop: Spacing["5"],
  },
} as const;

// ─── Typography Presets ───────────────────────────────────────────────────────
//
// Ready-to-spread text style objects for common text roles.

export const TextStyles = {
  /** Screen title — 24px bold */
  screenTitle: {
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    letterSpacing: Typography.tracking.tight,
    lineHeight: Typography.size["2xl"] * Typography.leading.tight,
  },
  /** Card heading — 20px bold */
  cardTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    letterSpacing: Typography.tracking.tight,
  },
  /** Section heading — 15px semibold */
  sectionTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  /** Body text — 13px regular */
  body: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.size.base * Typography.leading.relaxed,
  },
  /** Small label — 12px medium */
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.muted,
    letterSpacing: Typography.tracking.wide,
  },
  /** Caption / hint — 10px */
  caption: {
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.regular,
    color: Colors.text.muted,
  },
  /** Uppercase micro label — 9px bold tracked */
  microLabel: {
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    color: Colors.text.muted,
    letterSpacing: Typography.tracking.widest,
    textTransform: "uppercase" as const,
  },
  /** Hero number — 36px light (stats, timer) */
  heroNumber: {
    fontSize: Typography.size["4xl"],
    fontWeight: Typography.weight.light,
    color: Colors.text.primary,
    letterSpacing: Typography.tracking.tighter,
  },
  /** Button text */
  button: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.tracking.wide,
  },
} as const;

// ─── Animation Durations ──────────────────────────────────────────────────────

export const Duration = {
  /** 150ms — instant micro-interactions */
  fast: 150,
  /** 250ms — standard transitions */
  base: 250,
  /** 400ms — deliberate transitions */
  slow: 400,
  /** 600ms — entrances */
  enter: 600,
  /** 800ms — dramatic reveals */
  reveal: 800,
} as const;

// ─── Named exports (barrel) ───────────────────────────────────────────────────

export const Theme = {
  Colors,
  Typography,
  Spacing,
  Radii,
  Shadows,
  ComponentStyles,
  TextStyles,
  Duration,
} as const;

export default Theme;
