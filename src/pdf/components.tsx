import { Image, Path, Svg, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

/** Per-template palette + fonts (fonts come from docLabels(locale).fonts). */
export interface Theme {
  primary: string;
  accent: string;
  ink: string;
  muted: string;
  headingFont: string;
  textFont: string;
  valueFont: string;
}

export function FieldRow({
  label,
  value,
  theme,
  labelWidth = 130,
  fontSize = 9.5,
}: {
  label: string;
  value: string;
  theme: Theme;
  labelWidth?: number;
  fontSize?: number;
}) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 4.5 }}>
      <Text
        style={{
          width: labelWidth,
          fontFamily: theme.textFont,
          fontWeight: 700,
          color: theme.primary,
          fontSize,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          width: 12,
          fontFamily: theme.textFont,
          color: theme.muted,
          fontSize,
        }}
      >
        :
      </Text>
      <Text
        style={{
          flex: 1,
          fontFamily: theme.valueFont,
          color: theme.ink,
          fontSize,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

export function SectionHeading({
  title,
  theme,
  marginTop = 13,
}: {
  title: string;
  theme: Theme;
  marginTop?: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop,
        marginBottom: 7,
      }}
    >
      <View
        style={{ flex: 1, height: 0.7, backgroundColor: theme.accent }}
      />
      <Text
        style={{
          marginHorizontal: 10,
          fontFamily: theme.headingFont,
          fontSize: 10.5,
          color: theme.primary,
          letterSpacing: 1.2,
        }}
      >
        {title}
      </Text>
      <View
        style={{ flex: 1, height: 0.7, backgroundColor: theme.accent }}
      />
    </View>
  );
}

/** Small rotated-square ornament drawn as a path (font-independent). */
export function Diamond({ size = 5, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10">
      <Path d="M5 0 L10 5 L5 10 L0 5 Z" fill={color} />
    </Svg>
  );
}

const DEVANAGARI_RE = /[\u0900-\u097F]/;

/** Pick a font that can render the text — Rozha One covers Devanagari + Latin. */
export function scriptFont(text: string, fallback: string): string {
  return DEVANAGARI_RE.test(text) ? "DevanagariDisplay" : fallback;
}

export function Invocation({
  text,
  theme,
  fontSize = 11,
  style,
}: {
  text: string;
  theme: Theme;
  fontSize?: number;
  style?: Style;
}) {
  if (!text.trim()) return null;
  return (
    <Text
      style={[
        {
          textAlign: "center",
          fontFamily: scriptFont(text, theme.headingFont),
          fontSize,
          color: theme.primary,
          marginBottom: 4,
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
}

export function PhotoFrame({
  src,
  width = 92,
  borderColor,
  padding = 3,
  borderRadius = 0,
  style,
}: {
  src?: string;
  width?: number;
  borderColor: string;
  padding?: number;
  borderRadius?: number;
  style?: Style;
}) {
  if (!src) return null;
  return (
    <View
      style={[
        {
          border: `1pt solid ${borderColor}`,
          padding,
          borderRadius,
        },
        style,
      ]}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop */}
      <Image
        src={src}
        style={{
          width,
          height: width * 1.22,
          objectFit: "cover",
          borderRadius: Math.max(0, borderRadius - padding),
        }}
      />
    </View>
  );
}

/** Ornamental double border framing the page content. */
export function DoubleBorder({
  outer,
  inner,
  color,
  gap = 4,
  children,
  style,
}: {
  outer?: number;
  inner?: number;
  color: string;
  gap?: number;
  children: React.ReactNode;
  style?: Style;
}) {
  return (
    <View
      style={[
        {
          border: `${outer ?? 2}pt solid ${color}`,
          padding: gap,
          flexGrow: 1,
        },
        style,
      ]}
    >
      <View
        style={{
          border: `${inner ?? 0.7}pt solid ${color}`,
          padding: 16,
          flexGrow: 1,
        }}
      >
        {children}
      </View>
    </View>
  );
}
