import { Circle, Document, Page, Svg, Text, View, Path } from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections } from "../rows";
import {
  Diamond,
  FieldRow,
  Invocation,
  PhotoFrame,
  SectionHeading,
  scriptFont,
  PageFrame,
  bgColor,
  titleFor,
} from "../components";

function MandalaMark({ size = 90, color }: { size?: number; color: string }) {
  const c = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={c} cy={c} r={c - 2} stroke={color} strokeWidth={0.8} fill="none" />
      <Circle cx={c} cy={c} r={c * 0.72} stroke={color} strokeWidth={0.6} fill="none" />
      <Circle cx={c} cy={c} r={c * 0.45} stroke={color} strokeWidth={0.6} fill="none" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = c + Math.cos(rad) * c * 0.45;
        const y1 = c + Math.sin(rad) * c * 0.45;
        const x2 = c + Math.cos(rad) * (c - 4);
        const y2 = c + Math.sin(rad) * (c - 4);
        return (
          <Path
            key={deg}
            d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`}
            stroke={color}
            strokeWidth={0.5}
          />
        );
      })}
      <Circle cx={c} cy={c} r={3} fill={color} />
    </Svg>
  );
}

export function MandalaTemplate({
  data,
  labels,
  qr,
}: {
  data: BiodataData;
  labels: DocLabels;
  qr?: string;
}) {
  const theme = {
    primary: "#92400e", // warm bronze
    accent: "#d97706",
    ink: "#292524",
    muted: "#b8a284",
    headingFont: labels.fonts.heading,
    textFont: labels.fonts.text,
    valueFont: labels.fonts.value,
  };
  const sections = buildSections(data, labels);
  const name = data.personal.name.trim() || labels.fields.name;

  return (
    <Document title={`${name} — ${titleFor(labels, data)}`} author="Shubh Biodata">
      <Page size="A4" style={{ backgroundColor: bgColor(data, "#fdf8ee"), padding: 26 }}>
        <PageFrame qr={qr} footer={data.biodataNo} override={data.pageBorder} fallback="line" color="#d97706" padding={20}>
          <View style={{ alignItems: "center", marginBottom: 6 }}>
            <View style={{ position: "absolute", top: 30, opacity: 0.12 }}>
              <MandalaMark size={110} color="#92400e" />
            </View>
            <Invocation text={data.invocation} theme={theme} icon={data.invocationIcon} />
            <View style={{ alignItems: "center", marginTop: 6 }}>
              {data.photo && (
                <PhotoFrame
                  src={data.photo}
                  frame={data.photoFrame}
                  width={78}
                  borderColor="#d97706"
                  padding={2}
                  style={{ marginBottom: 8 }}
                />
              )}
              <Text
                style={{
                  fontFamily: scriptFont(name, theme.headingFont),
                  fontSize: 22,
                  color: theme.primary,
                }}
              >
                {name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 5,
                }}
              >
                <Diamond color={theme.accent} size={5} />
                <Text
                  style={{
                    fontFamily: theme.textFont,
                    fontSize: 8.5,
                    color: "#b45309",
                    letterSpacing: 3,
                  }}
                >
                  {titleFor(labels, data)}
                </Text>
                <Diamond color={theme.accent} size={5} />
              </View>
            </View>
          </View>

          {sections.map((sec) => (
            <View key={sec.key} wrap={false}>
              <SectionHeading title={sec.title} theme={theme} />
              {sec.rows.map((r) => (
                <FieldRow
                  key={r.label}
                  label={r.label}
                  value={r.value}
                  theme={theme}
                  labelWidth={135}
                />
              ))}
            </View>
          ))}

          {(["aboutMe", "familyAbout", "expectations", "familyExpectations"] as const).map((k) => {
            const text = data[k].trim();
            if (!text) return null;
            return (
              <View key={k} wrap={false}>
                <SectionHeading
                  title={
                    labels.sections[
                    ({aboutMe: "about", familyAbout: "aboutFamily", expectations: "expectations", familyExpectations: "familyExpectations"} as const)[k]
                  ]
                  }
                  theme={theme}
                />
                <Text
                  style={{
                    fontFamily: theme.valueFont,
                    fontSize: 9.5,
                    color: theme.ink,
                    lineHeight: 1.55,
                  }}
                >
                  {text}
                </Text>
              </View>
            );
          })}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
              marginTop: 20,
            }}
          >
            <Diamond color={theme.accent} size={5} />
            <Diamond color={theme.primary} size={7} />
            <Diamond color={theme.accent} size={5} />
          </View>
        </PageFrame>
      </Page>
    </Document>
  );
}
