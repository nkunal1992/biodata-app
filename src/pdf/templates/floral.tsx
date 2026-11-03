import { Circle, Document, Page, Path, Svg, Text, View } from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections } from "../rows";
import { FieldRow, Invocation, PhotoFrame, scriptFont, SectionHeading } from "../components";

function CornerFloral({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <Svg
      width={54}
      height={54}
      viewBox="0 0 54 54"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <Path d="M2 2 Q26 8 30 32 Q8 28 2 2 Z" fill={color} opacity={0.25} />
      <Path d="M10 2 Q34 6 44 30 Q20 26 10 2 Z" fill={color} opacity={0.35} />
      <Circle cx={40} cy={40} r={3} fill={color} opacity={0.5} />
      <Circle cx={30} cy={46} r={2} fill={color} opacity={0.4} />
      <Circle cx={46} cy={30} r={2} fill={color} opacity={0.4} />
    </Svg>
  );
}

export function FloralTemplate({
  data,
  labels,
}: {
  data: BiodataData;
  labels: DocLabels;
}) {
  const theme = {
    primary: "#9d174d", // rose
    accent: "#f9a8d4",
    ink: "#292524",
    muted: "#d6a3b8",
    headingFont: labels.fonts.heading,
    textFont: labels.fonts.text,
    valueFont: labels.fonts.value,
  };
  const sections = buildSections(data, labels);
  const name = data.personal.name.trim() || labels.fields.name;

  return (
    <Document title={`${name} — ${labels.title}`} author="Shubh Biodata">
      <Page size="A4" style={{ backgroundColor: "#fff9f4", padding: 20 }}>
        <View style={{ position: "absolute", top: 12, left: 12 }}>
          <CornerFloral color="#f472b6" />
        </View>
        <View style={{ position: "absolute", top: 12, right: 12 }}>
          <CornerFloral color="#f472b6" flip />
        </View>

        <View
          style={{
            border: "0.7pt solid #f9a8d4",
            margin: 20,
            padding: 18,
            flexGrow: 1,
          }}
        >
          <Invocation text={data.invocation} theme={theme} />
          <View style={{ alignItems: "center", marginBottom: 4 }}>
            {data.photo && (
              <PhotoFrame
                src={data.photo}
                width={80}
                borderColor="#f472b6"
                borderRadius={40}
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
            <Text
              style={{
                fontFamily: theme.textFont,
                fontSize: 8.5,
                color: "#be185d",
                letterSpacing: 2.5,
                marginTop: 3,
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
