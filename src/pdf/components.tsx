import { Circle, Image, Page, Path, Rect, Svg, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Row } from "./rows";
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
  /** Density scale applied to font sizes / spacing. */
  scale?: number;
}

/** Curated accent palettes — swap a template's primary/accent pair. */
export const ACCENT_PALETTES: Record<string, { primary: string; accent: string }> = {
  template: { primary: "", accent: "" },
  maroonGold: { primary: "#9f1239", accent: "#b45309" },
  saffron: { primary: "#ea580c", accent: "#9a3412" },
  tealGold: { primary: "#0f766e", accent: "#b45309" },
  navyGold: { primary: "#1e3a5f", accent: "#b45309" },
  plum: { primary: "#6d28d9", accent: "#a21caf" },
  forest: { primary: "#166534", accent: "#b45309" },
  charcoal: { primary: "#334155", accent: "#64748b" },
};

const FONT_PAIRS: Record<string, { heading: string; text: string; value: string }> = {
  serif: { heading: "Display", text: "Serif", value: "Serif" },
  modern: { heading: "Serif", text: "Serif", value: "Serif" },
  devanagari: { heading: "DevanagariDisplay", text: "Devanagari", value: "Devanagari" },
};

const DENSITY_SCALE: Record<string, number> = {
  compact: 0.88,
  comfortable: 1,
  spacious: 1.12,
};

/**
 * Layer user design overrides onto a template's base theme —
 * accent palette, font pairing, density. Every template calls this
 * so all designs stay editable.
 */
export function resolveTheme(data: BiodataData, base: Theme): Theme {
  const pal = ACCENT_PALETTES[data.accentPalette ?? "template"];
  const fonts = FONT_PAIRS[data.fontPair ?? "serif"];
  return {
    ...base,
    primary: pal?.primary || base.primary,
    accent: pal?.accent || base.accent,
    headingFont: fonts?.heading ?? base.headingFont,
    textFont: fonts?.text ?? base.textFont,
    valueFont: fonts?.value ?? base.valueFont,
    scale: DENSITY_SCALE[data.density ?? "comfortable"],
  };
}

/** Photo width multiplier for the photoSize option. */
export function photoWidth(data: BiodataData, base: number): number {
  const m = { small: 0.8, regular: 1, large: 1.25 }[data.photoSize ?? "regular"];
  return base * m;
}

/** Subtle background motif — rendered behind content inside PageFrame. */
export function TextureLayer({
  tex,
  color,
}: {
  tex?: string;
  color: string;
}) {
  if (!tex || tex === "none") return null;
  const items = [];
  if (tex === "dots") {
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 12; x++)
        items.push(<Circle key={`${x}-${y}`} cx={x * 48 + 18} cy={y * 52 + 20} r={1.1} />);
  } else if (tex === "buttis") {
    for (let y = 0; y < 12; y++)
      for (let x = 0; x < 9; x++)
        items.push(
          <Path
            key={`${x}-${y}`}
            d={`M ${x * 66 + 30} ${y * 66 + 16} l 4 6 l -4 6 l -4 -6 Z`}
          />,
        );
  } else if (tex === "weave") {
    for (let i = 0; i < 14; i++)
      items.push(
        <Path key={i} d={`M ${i * 48} 0 L ${i * 48 - 200} 842`} strokeWidth={0.7} />,
        <Path key={`r${i}`} d={`M ${i * 48 - 300} 0 L ${i * 48} 842`} strokeWidth={0.7} />,
      );
  } else if (tex === "paisley") {
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 5; x++)
        items.push(
          <Circle key={`${x}-${y}`} cx={x * 118 + 50} cy={y * 118 + 50} r={14} />,
          <Circle key={`i${x}-${y}`} cx={x * 118 + 50} cy={y * 118 + 50} r={6} />,
        );
  }
  return (
    <Svg
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      viewBox="0 0 595 842"
      fill={tex === "weave" ? "none" : color}
      stroke={tex === "weave" ? color : "none"}
      fillRule="evenodd"
    >
      {items}
    </Svg>
  );
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
          fontSize: fontSize * (theme.scale ?? 1),
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          width: 12,
          fontFamily: theme.textFont,
          color: theme.muted,
          fontSize: fontSize * (theme.scale ?? 1),
        }}
      >
        :
      </Text>
      <Text
        style={{
          flex: 1,
          fontFamily: theme.valueFont,
          color: theme.ink,
          fontSize: fontSize * (theme.scale ?? 1),
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
          fontSize: fontSize * (theme.scale ?? 1),
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
  qr,
  footer,
  children,
  style,
  texture,
}: {
  override?: PageBorderStyle;
  fallback?: PageBorderKind;
  color: string;
  color2?: string;
  padding?: number;
  qr?: string;
  footer?: string;
  children: React.ReactNode;
  style?: Style;
  texture?: string;
}) {
  const deco = (
    <>
      <TextureLayer tex={texture} color={color2 ?? color} />
      {qr && (
        <View style={{ position: "absolute", bottom: 6, right: 8, alignItems: "center" }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop */}
          <Image src={qr} style={{ width: 34, height: 34 }} />
          <Text style={{ fontSize: 4.5, color: color2 ?? color, marginTop: 1 }}>
            scan to edit
          </Text>
        </View>
      )}
      {footer && (
        <Text
          style={{
            position: "absolute",
            bottom: 8,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 6,
            color: color2 ?? color,
            letterSpacing: 0.5,
          }}
        >
          {footer}
        </Text>
      )}
    </>
  );
  const kind: PageBorderKind =
    override === "template" ? fallback : (override as PageBorderKind);
  const c2 = color2 ?? color;

  if (kind === "none") {
    return (
      <View style={[{ padding, flexGrow: 1 }, style]}>
        {deco}
        {children}
      </View>
    );
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
        {deco}
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
          {deco}
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
        {deco}
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

// ── Cover page ─────────────────────────────────────────────────

/** Dedicated first page: framed photo, name, family, deity, invocation. */
export function CoverPage({
  data,
  labels,
  theme,
}: {
  data: BiodataData;
  labels: DocLabels;
  theme: Theme;
}) {
  const name = data.personal.name.trim();
  return (
    <Page
      size="A4"
      style={{ backgroundColor: data.pageBackground && data.pageBackground !== "template" ? "#fefcf3" : "#fffdf5", padding: 24, display: "flex" }}
    >
      <View
        style={{
          border: `1.6pt solid ${theme.primary}`,
          padding: 4,
          flexGrow: 1,
        }}
      >
        <View
          style={{
            border: `0.7pt solid ${theme.accent}`,
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 30,
          }}
        >
          <IconMark
            icon={data.invocationIcon === "none" ? undefined : data.invocationIcon ?? "kalash"}
            size={40}
            color={theme.primary}
            style={{ marginBottom: 10 }}
          />
          {data.invocation.trim() ? (
            <Text
              style={{
                fontFamily: scriptFont(data.invocation, theme.headingFont),
                fontSize: 11,
                color: theme.primary,
                marginBottom: 20,
              }}
            >
              {data.invocation}
            </Text>
          ) : null}
          {data.photo && (
            <PhotoFrame
              src={data.photo}
              width={140}
              borderColor={theme.accent}
              padding={4}
              frame={data.photoFrame ?? "classic"}
              style={{ marginBottom: 18 }}
            />
          )}
          <Text
            style={{
              fontFamily: scriptFont(name, theme.headingFont),
              fontSize: 30,
              color: theme.primary,
              textAlign: "center",
            }}
          >
            {name || labels.fields.name}
          </Text>
          {data.candidateFor && (
            <Text
              style={{
                fontFamily: theme.textFont,
                fontSize: 10,
                color: theme.accent,
                letterSpacing: 3,
                marginTop: 6,
              }}
            >
              {labels.candidateFor[data.candidateFor]}
            </Text>
          )}
          {data.family.fatherName.trim() ? (
            <Text
              style={{
                fontFamily: theme.textFont,
                fontSize: 10.5,
                color: theme.ink,
                marginTop: 18,
              }}
            >
              {data.outputLocale === "hi" ? "पुत्र/पुत्री: " : "S/o · D/o: "}
              {data.family.fatherName}
            </Text>
          ) : null}
          {data.family.nativePlace.trim() ? (
            <Text
              style={{
                fontFamily: theme.textFont,
                fontSize: 10,
                color: theme.ink,
                marginTop: 4,
              }}
            >
              {data.outputLocale === "hi" ? "मूल निवास: " : "Native: "}
              {data.family.nativePlace}
            </Text>
          ) : null}
          <Text
            style={{
              fontFamily: theme.textFont,
              fontSize: 8,
              color: theme.accent,
              letterSpacing: 3,
              marginTop: 30,
            }}
          >
            {titleFor(labels, data)}
          </Text>
        </View>
      </View>
    </Page>
  );
}

// ── Unique section renderers (template differentiation) ───────

/** Ledger: every field in its own bordered table row. */
export function TableRows({
  rows,
  theme,
}: {
  rows: Row[];
  theme: Theme;
}) {
  return (
    <View
      style={{
        borderTop: `0.6pt solid ${theme.accent}`,
        borderLeft: `0.6pt solid ${theme.accent}`,
      }}
    >
      {rows.map((r, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            borderBottom: `0.6pt solid ${theme.accent}`,
            backgroundColor: i % 2 ? "#00000000" : `${theme.accent}14`,
          }}
        >
          <Text
            style={{
              width: "36%",
              padding: "2.5 8",
              fontSize: 8,
              fontFamily: theme.textFont,
              color: theme.muted,
              borderRight: `0.6pt solid ${theme.accent}`,
            }}
          >
            {r.label}
          </Text>
          <Text
            style={{
              flex: 1,
              padding: "2.5 8",
              fontSize: 8.5,
              fontFamily: theme.valueFont,
              color: theme.ink,
            }}
          >
            {r.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Card: each section in its own bordered card with a title bar. */
export function CardSection({
  title,
  rows,
  theme,
}: {
  title: string;
  rows: Row[];
  theme: Theme;
}) {
  return (
    <View
      style={{
        border: `0.8pt solid ${theme.accent}`,
        borderRadius: 6,
        marginBottom: 8,
        overflow: "hidden",
      }}
    >
      <Text
        style={{
          backgroundColor: `${theme.primary}12`,
          padding: "5 10",
          fontSize: 8.5,
          fontFamily: theme.headingFont,
          fontWeight: 700,
          color: theme.primary,
          borderBottom: `0.8pt solid ${theme.accent}`,
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
      <View style={{ padding: "4 10 6" }}>
        {rows.map((r, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              paddingVertical: 2,
              borderBottom:
                i < rows.length - 1
                  ? `0.4pt solid ${theme.accent}25`
                  : "0pt solid transparent",
            }}
          >
            <Text
              style={{
                width: "34%",
                fontSize: 8.5,
                fontFamily: theme.textFont,
                color: theme.muted,
              }}
            >
              {r.label}
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 9,
                fontFamily: theme.valueFont,
                color: theme.ink,
              }}
            >
              {r.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Ribbon: section title as a colored band across the width. */
export function RibbonHeading({
  title,
  theme,
}: {
  title: string;
  theme: Theme;
}) {
  return (
    <Text
      style={{
        backgroundColor: theme.primary,
        color: "#ffffff",
        padding: "4 10",
        fontSize: 9,
        fontFamily: theme.headingFont,
        fontWeight: 700,
        letterSpacing: 1,
        textAlign: "center",
        marginBottom: 6,
        borderRadius: 3,
      }}
    >
      {title}
    </Text>
  );
}

/** Two-col: label+value pairs in a dense two-column grid. */
export function TwoColRows({
  rows,
  theme,
}: {
  rows: Row[];
  theme: Theme;
}) {
  const half = Math.ceil(rows.length / 2);
  const cols = [rows.slice(0, half), rows.slice(half)];
  return (
    <View style={{ flexDirection: "row", gap: 16 }}>
      {cols.map((col, ci) => (
        <View key={ci} style={{ flex: 1 }}>
          {col.map((r, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                paddingVertical: 2,
                borderBottom: `0.4pt solid ${theme.accent}30`,
              }}
            >
              <Text
                style={{
                  width: "34%",
                  fontSize: 8,
                  fontFamily: theme.textFont,
                  color: theme.muted,
                }}
              >
                {r.label}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 8.5,
                  fontFamily: theme.valueFont,
                  color: theme.ink,
                }}
              >
                {r.value}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/** MarginLabel: section title in the left margin, rows to its right. */
export function MarginLabel({
  title,
  rows,
  theme,
}: {
  title: string;
  rows: Row[];
  theme: Theme;
}) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 8, gap: 10 }}>
      <View
        style={{
          width: 86,
          borderRight: `1pt solid ${theme.accent}`,
          paddingRight: 6,
          paddingTop: 2,
        }}
      >
        <Text
          style={{
            fontSize: 7.5,
            fontFamily: theme.headingFont,
            fontWeight: 700,
            color: theme.primary,
            letterSpacing: 0.4,
          }}
        >
          {title}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        {rows.map((r, i) => (
          <View key={i} style={{ flexDirection: "row", paddingVertical: 1.5 }}>
            <Text
              style={{
                width: "36%",
                fontSize: 8.5,
                fontFamily: theme.textFont,
                color: theme.muted,
              }}
            >
              {r.label}
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 9,
                fontFamily: theme.valueFont,
                color: theme.ink,
              }}
            >
              {r.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** NumberedHeading: "01 — Section" style. */
export function NumberedHeading({
  title,
  index,
  theme,
}: {
  title: string;
  index: number;
  theme: Theme;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
        gap: 7,
      }}
    >
      <Text
        style={{
          fontSize: 8,
          fontFamily: theme.headingFont,
          fontWeight: 700,
          color: theme.accent,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </Text>
      <Text
        style={{
          fontSize: 9.5,
          fontFamily: theme.headingFont,
          fontWeight: 700,
          color: theme.primary,
          letterSpacing: 0.6,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          flex: 1,
          height: 0.6,
          backgroundColor: theme.accent,
          opacity: 0.4,
        }}
      />
    </View>
  );
}
