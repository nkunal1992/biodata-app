import { Circle, Image, Path, Rect, Svg, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { BiodataData, FrameStyle, InvocationIcon, PageBg, PageBorderStyle } from "@/lib/biodata";
import type { DocLabels } from "./labels";

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
  icon,
  iconSize = 18,
  iconColor,
  style,
}: {
  text: string;
  theme: Theme;
  fontSize?: number;
  icon?: InvocationIcon;
  iconSize?: number;
  iconColor?: string;
  style?: Style;
}) {
  if (!text.trim() && (!icon || icon === "none")) return null;
  return (
    <View style={{ alignItems: "center" }}>
      <IconMark
        icon={icon}
        size={iconSize}
        color={iconColor ?? theme.primary}
        style={{ marginBottom: 2 }}
      />
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
    </View>
  );
}

export function PhotoFrame({
  src,
  width = 92,
  borderColor,
  padding = 3,
  frame = "classic",
  borderRadius,
  style,
}: {
  src?: string;
  width?: number;
  borderColor: string;
  padding?: number;
  frame?: FrameStyle;
  /** @deprecated prefer `frame` — kept for compat */
  borderRadius?: number;
  style?: Style;
}) {
  if (!src) return null;
  const square = frame === "circle";
  const imgH = square ? width : width * 1.22;
  const outer: object =
    frame === "oval"
      ? { borderRadius: width }
      : frame === "circle"
        ? { borderRadius: width / 2 + padding }
        : frame === "arch"
          ? {
              borderTopLeftRadius: width * 0.55,
              borderTopRightRadius: width * 0.55,
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
            }
          : frame === "rounded"
            ? { borderRadius: 8 }
            : { borderRadius: borderRadius ?? (frame === "ornate" ? 4 : 0) };
  const inner: object =
    frame === "oval"
      ? { borderRadius: width }
      : frame === "circle"
        ? { borderRadius: width / 2 }
        : frame === "arch"
          ? {
              borderTopLeftRadius: width * 0.5,
              borderTopRightRadius: width * 0.5,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
            }
          : frame === "rounded"
            ? { borderRadius: 5 }
            : frame === "ornate"
              ? { borderRadius: 2 }
              : {};

  const img = (
    // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop
    <Image
      src={src}
      style={{ width, height: imgH, objectFit: "cover", ...inner }}
    />
  );

  if (frame === "ornate") {
    return (
      <View
        style={[
          { border: `1.5pt solid ${borderColor}`, padding: 2, ...outer },
          style,
        ]}
      >
        <View style={{ border: `0.6pt solid ${borderColor}`, padding: 2.5 }}>
          {img}
        </View>
      </View>
    );
  }
  return (
    <View
      style={[{ border: `1pt solid ${borderColor}`, padding, ...outer }, style]}
    >
      {img}
    </View>
  );
}

/** Small floral corner motif (shared with the floral template). */
export function CornerFloral({
  color,
  flip = false,
  style,
}: {
  color: string;
  flip?: boolean;
  style?: Style;
}) {
  return (
    <Svg
      width={54}
      height={54}
      viewBox="0 0 54 54"
      style={[flip ? { transform: "scaleX(-1)" } : {}, style ?? {}]}
    >
      <Path d="M2 2 Q26 8 30 32 Q8 28 2 2 Z" fill={color} opacity={0.25} />
      <Path d="M10 2 Q34 6 44 30 Q20 26 10 2 Z" fill={color} opacity={0.35} />
      <Circle cx={40} cy={40} r={3} fill={color} opacity={0.5} />
      <Circle cx={30} cy={46} r={2} fill={color} opacity={0.4} />
      <Circle cx={46} cy={30} r={2} fill={color} opacity={0.4} />
    </Svg>
  );
}

export type PageBorderKind = Exclude<PageBorderStyle, "template">;

/**
 * Page border wrapper honoring the user's `pageBorder` override.
 * `fallback` is the template's signature border used when override='template'.
 */
export function PageFrame({
  override = "template",
  fallback = "none",
  color,
  color2,
  padding = 16,
  children,
  style,
}: {
  override?: PageBorderStyle;
  fallback?: PageBorderKind;
  color: string;
  color2?: string;
  padding?: number;
  children: React.ReactNode;
  style?: Style;
}) {
  const kind: PageBorderKind =
    override === "template" ? fallback : (override as PageBorderKind);
  const c2 = color2 ?? color;

  if (kind === "none") {
    return <View style={[{ padding, flexGrow: 1 }, style]}>{children}</View>;
  }
  if (kind === "floral") {
    return (
      <View
        style={[
          { border: `0.7pt solid ${color}`, padding, flexGrow: 1 },
          style,
        ]}
      >
        <View style={{ position: "absolute", top: 4, left: 4 }}>
          <CornerFloral color={c2} />
        </View>
        <View style={{ position: "absolute", top: 4, right: 4 }}>
          <CornerFloral color={c2} flip />
        </View>
        {children}
      </View>
    );
  }
  if (kind === "line") {
    return (
      <View
        style={[
          { border: `0.9pt solid ${color}`, padding, flexGrow: 1 },
          style,
        ]}
      >
        {children}
      </View>
    );
  }
  if (kind === "ornate") {
    return (
      <View
        style={[
          { border: `2.2pt solid ${color}`, padding: 3, flexGrow: 1 },
          style,
        ]}
      >
        <View style={{ border: `0.7pt solid ${c2}`, padding, flexGrow: 1 }}>
          {children}
        </View>
      </View>
    );
  }
  // double
  return (
    <View
      style={[
        { border: `1.6pt solid ${color}`, padding: 4, flexGrow: 1 },
        style,
      ]}
    >
      <View style={{ border: `0.7pt solid ${c2}`, padding, flexGrow: 1 }}>
        {children}
      </View>
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

// ── Auspicious icons (drawn above the invocation line) ────────────

export function KalashMark({
  size = 56,
  leaf = "#15803d",
  coconut = "#92400e",
  coconutLight = "#b45309",
  rim = "#d97706",
  pot = "#b91c1c",
  mark = "#fcd34d",
}: {
  size?: number;
  leaf?: string;
  coconut?: string;
  coconutLight?: string;
  rim?: string;
  pot?: string;
  mark?: string;
}) {
  return (
    <Svg width={size} height={size * 1.25} viewBox="0 0 60 75">
      <Path d="M30 20 Q16 12 10 6" stroke={leaf} strokeWidth={2} fill="none" />
      <Path d="M30 20 Q44 12 50 6" stroke={leaf} strokeWidth={2} fill="none" />
      <Path d="M30 20 Q30 8 30 3" stroke={leaf} strokeWidth={2} fill="none" />
      <Circle cx={30} cy={19} r={7.5} fill={coconut} />
      <Circle cx={30} cy={16.5} r={2.5} fill={coconutLight} />
      <Rect x={14} y={26} width={32} height={6} rx={2.5} fill={rim} />
      <Path
        d="M14 32 Q8 44 12 57 Q17 71 30 71 Q43 71 48 57 Q52 44 46 32 Z"
        fill={pot}
      />
      <Circle cx={30} cy={50} r={6} fill={mark} />
      <Path d="M30 45.5 L34 50 L30 54.5 L26 50 Z" fill={pot} />
    </Svg>
  );
}

function Swastik({ size, color }: { size: number; color: string }) {
  const t = size / 8;
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x={22} y={6} width={t} height={16} fill={color} />
      <Rect x={26 - 16 / 2 + 5} y={18} width={16} height={t} fill={color} />
      <Rect x={22} y={26} width={t} height={16} fill={color} />
      <Rect x={6} y={22} width={16} height={t} fill={color} />
      <Circle cx={14} cy={14} r={2.4} fill={color} />
      <Circle cx={34} cy={14} r={2.4} fill={color} />
      <Circle cx={14} cy={34} r={2.4} fill={color} />
      <Circle cx={34} cy={34} r={2.4} fill={color} />
    </Svg>
  );
}

function Diya({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size * 0.75} viewBox="0 0 48 36">
      <Path
        d="M24 4 Q28 10 24 14 Q20 10 24 4 Z"
        fill={color}
        opacity={0.9}
      />
      <Path
        d="M24 8 Q26.5 11 24 13 Q21.5 11 24 8 Z"
        fill="#fcd34d"
      />
      <Path
        d="M6 22 Q24 16 42 22 Q42 32 24 32 Q6 32 6 22 Z"
        fill={color}
      />
      <Path
        d="M6 22 Q24 16 42 22 Q24 27 6 22 Z"
        fill={color}
        opacity={0.75}
      />
    </Svg>
  );
}

function Lotus({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size * 0.72} viewBox="0 0 52 38">
      <Path d="M26 4 Q30 14 26 22 Q22 14 26 4 Z" fill={color} />
      <Path d="M13 8 Q20 15 24 23 Q14 21 13 8 Z" fill={color} opacity={0.75} />
      <Path d="M39 8 Q32 15 28 23 Q38 21 39 8 Z" fill={color} opacity={0.75} />
      <Path d="M4 14 Q13 20 21 26 Q9 27 4 14 Z" fill={color} opacity={0.5} />
      <Path d="M48 14 Q39 20 31 26 Q43 27 48 14 Z" fill={color} opacity={0.5} />
      <Path
        d="M8 30 Q26 38 44 30 Q40 36 26 36 Q12 36 8 30 Z"
        fill={color}
        opacity={0.8}
      />
    </Svg>
  );
}

function Ganesha({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size * 1.05} viewBox="0 0 56 58">
      {/* crown */}
      <Path d="M28 1 L32 8 L24 8 Z" fill={color} />
      <Circle cx={28} cy={9.5} r={2} fill={color} />
      {/* ears */}
      <Path d="M13 15 Q2 18 4 29 Q14 29 17 21 Z" fill={color} />
      <Path d="M43 15 Q54 18 52 29 Q42 29 39 21 Z" fill={color} />
      {/* head */}
      <Circle cx={28} cy={17} r={11} fill={color} />
      {/* tilak */}
      <Path d="M28 11 L30 14 L28 15.5 L26 14 Z" fill="#fcd34d" />
      {/* trunk curving left */}
      <Path
        d="M28 24 Q28 38 20 42 Q14 44 13 39 Q17 40 19 37 Q22 33 22 27"
        stroke={color}
        strokeWidth={6.5}
        fill="none"
        strokeLinecap="round"
      />
      {/* tusks */}
      <Path d="M21 26 Q18 30 15 31 Q19 32 22 29 Z" fill={color} opacity={0.85} />
      {/* body */}
      <Path d="M14 40 Q10 54 28 55 Q46 54 42 40 Q36 47 28 47 Q20 47 14 40 Z" fill={color} />
    </Svg>
  );
}

/** Renders the auspicious icon; 'om' uses the Devanagari glyph. */
export function IconMark({
  icon,
  size = 18,
  color,
  style,
}: {
  icon?: InvocationIcon;
  size?: number;
  color: string;
  style?: Style;
}) {
  if (!icon || icon === "none") return null;
  return (
    <View style={[style ?? {}]}>
      {icon === "om" ? (
        <Text
          style={{
            fontFamily: "NotoSansDevanagari",
            fontSize: size * 1.15,
            color,
            textAlign: "center",
          }}
        >
          ॐ
        </Text>
      ) : icon === "swastik" ? (
        <Swastik size={size} color={color} />
      ) : icon === "kalash" ? (
        <KalashMark size={size} />
      ) : icon === "diya" ? (
        <Diya size={size} color={color} />
      ) : icon === "lotus" ? (
        <Lotus size={size} color={color} />
      ) : (
        <Ganesha size={size} color={color} />
      )}
    </View>
  );
}

// ── Page background ──────────────────────────────────────────────

const BG_TONES: Record<Exclude<PageBg, "template">, string> = {
  white: "#ffffff",
  ivory: "#fefcf3",
  cream: "#fdf6e3",
  blush: "#fdf0ee",
  mint: "#f0f7f0",
  sandal: "#f5ead3",
};

/** Resolve the page background: user override or the template's tone. */
export function bgColor(data: BiodataData, fallback: string): string {
  const bg = data.pageBackground;
  if (!bg || bg === "template") return fallback;
  return BG_TONES[bg];
}

/** Title with optional "— Groom/Bride" suffix. */
export function titleFor(labels: DocLabels, data: BiodataData): string {
  if (!data.candidateFor) return labels.title;
  return `${labels.title} — ${labels.candidateFor[data.candidateFor]}`;
}
