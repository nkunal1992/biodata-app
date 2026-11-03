import {
  Circle,
  Document,
  Page,
  Path,
  Rect,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections } from "../rows";
import {
  FieldRow,
  Invocation,
  PhotoFrame,
  SectionHeading,
  scriptFont,
} from "../components";

/** पूर्ण कलश — coconut + mango leaves over a decorated pot. */
function KalashMark({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.25} viewBox="0 0 60 75">
      {/* mango leaves */}
      <Path d="M30 20 Q16 12 10 6" stroke="#15803d" strokeWidth={2} fill="none" />
      <Path d="M30 20 Q44 12 50 6" stroke="#15803d" strokeWidth={2} fill="none" />
      <Path d="M30 20 Q30 8 30 3" stroke="#15803d" strokeWidth={2} fill="none" />
      {/* coconut */}
      <Circle cx={30} cy={19} r={7.5} fill="#92400e" />
      <Circle cx={30} cy={16.5} r={2.5} fill="#b45309" />
      {/* rim */}
      <Rect x={14} y={26} width={32} height={6} rx={2.5} fill="#d97706" />
      {/* pot */}
      <Path
        d="M14 32 Q8 44 12 57 Q17 71 30 71 Q43 71 48 57 Q52 44 46 32 Z"
        fill="#b91c1c"
      />
      {/* auspicious mark */}
      <Circle cx={30} cy={50} r={6} fill="#fcd34d" />
      <Path
        d="M30 45.5 L34 50 L30 54.5 L26 50 Z"
        fill="#b91c1c"
      />
    </Svg>
  );
}

export function KalashTemplate({
  data,
  labels,
}: {
  data: BiodataData;
  labels: DocLabels;
}) {
  const theme = {
    primary: "#b91c1c", // kumkum red
    accent: "#d97706", // turmeric gold
    ink: "#292524",
    muted: "#d6a04c",
    headingFont: labels.fonts.heading,
    textFont: labels.fonts.text,
    valueFont: labels.fonts.value,
  };
  const sections = buildSections(data, labels);
  const name = data.personal.name.trim() || labels.fields.name;

  return (
    <Document title={`${name} — ${labels.title}`} author="Shubh Biodata">
      <Page size="A4" style={{ backgroundColor: "#fffaf2", padding: 24 }}>
        <View
          style={{
            border: "1.2pt solid #d97706",
            padding: 16,
            flexGrow: 1,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <KalashMark size={52} />
            <Invocation text={data.invocation} theme={theme} />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Text
                style={{
                  fontFamily: scriptFont(name, theme.headingFont),
                  fontSize: 22,
                  color: theme.primary,
                }}
              >
                {name}
              </Text>
              {data.photo && (
                <PhotoFrame
                  src={data.photo}
                  width={76}
                  borderColor="#d97706"
                  padding={2}
                  borderRadius={4}
                />
              )}
            </View>
            <Text
              style={{
                fontFamily: theme.textFont,
                fontSize: 8.5,
                color: theme.accent,
                letterSpacing: 3,
                marginTop: 4,
              }}
            >
              {labels.title}
            </Text>
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

          {(["aboutMe", "expectations"] as const).map((k) => {
            const text = data[k].trim();
            if (!text) return null;
            return (
              <View key={k} wrap={false}>
                <SectionHeading
                  title={
                    k === "aboutMe"
                      ? labels.sections.about
                      : labels.sections.expectations
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
        </View>
      </Page>
    </Document>
  );
}
