import {
  Circle,
  Document,
  Page,
  Path,
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
  PageFrame,
} from "../components";

/** A hanging toran strip — marigold circles + mango-leaf triangles. */
function ToranStrip({ width = 500 }: { width?: number }) {
  const step = 16;
  const count = Math.floor(width / step);
  const h = 22;
  return (
    <Svg width={count * step} height={h} viewBox={`0 0 ${count * step} ${h}`}>
      {Array.from({ length: count }).map((_, i) => {
        const x = i * step + step / 2;
        return (
          <Path key={`l${i}`} d={`M${x} 12 L${x - 4} 20 L${x + 4} 20 Z`} fill="#15803d" />
        );
      })}
      {Array.from({ length: count }).map((_, i) => {
        const x = i * step + step / 2;
        return (
          <Circle
            key={`c${i}`}
            cx={x}
            cy={7}
            r={5}
            fill={i % 2 === 0 ? "#f59e0b" : "#fbbf24"}
            stroke="#d97706"
            strokeWidth={0.5}
          />
        );
      })}
    </Svg>
  );
}

export function ToranTemplate({
  data,
  labels,
}: {
  data: BiodataData;
  labels: DocLabels;
}) {
  const theme = {
    primary: "#991b1b", // kumkum red
    accent: "#d97706", // marigold
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
      <Page size="A4" style={{ backgroundColor: "#fffdf4", padding: 22 }}>
        <PageFrame override={data.pageBorder} fallback="none" color="#d97706" padding={0}>
        <View style={{ alignItems: "center" }}>
          <ToranStrip />
        </View>
        <View style={{ paddingHorizontal: 14 }}>
          <View style={{ alignItems: "center", marginTop: 2 }}>
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
                  frame={data.photoFrame}
                  width={78}
                  borderColor="#d97706"
                  padding={2}
                  borderRadius={6}
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
        </PageFrame>
      </Page>
    </Document>
  );
}
