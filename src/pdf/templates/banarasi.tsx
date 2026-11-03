import { Document, Page, Text, View } from "@react-pdf/renderer";
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
} from "../components";

/** Zari butti strip — small gold paisley-dots row, like Banarasi brocade. */
function ButtiRow({ color, count = 18 }: { color: string; count?: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 22,
        marginVertical: 5,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ alignItems: "center" }}>
          <Diamond size={4} color={color} />
          <View
            style={{
              width: 1.5,
              height: 1.5,
              borderRadius: 1,
              backgroundColor: color,
              marginTop: 2,
            }}
          />
        </View>
      ))}
    </View>
  );
}

export function BanarasiTemplate({
  data,
  labels,
}: {
  data: BiodataData;
  labels: DocLabels;
}) {
  const theme = {
    primary: "#4c1d95", // deep banarasi purple
    accent: "#a16207", // zari gold
    ink: "#292524",
    muted: "#b8a284",
    headingFont: labels.fonts.heading,
    textFont: labels.fonts.text,
    valueFont: labels.fonts.value,
  };
  const sections = buildSections(data, labels);
  const name = data.personal.name.trim() || labels.fields.name;

  return (
    <Document title={`${name} — ${labels.title}`} author="Shubh Biodata">
      <Page size="A4" style={{ backgroundColor: "#fdfbf5", padding: 22 }}>
        {/* zari double border */}
        <PageFrame override={data.pageBorder} fallback="ornate" color="#4c1d95" color2="#a16207" padding={15}>
        
            <ButtiRow color="#a16207" />
            <View style={{ alignItems: "center", marginBottom: 2 }}>
              <Invocation text={data.invocation} theme={theme} icon={data.invocationIcon} />
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
                    width={76}
                    borderColor="#a16207"
                    padding={2}
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
            <ButtiRow color="#4c1d95" />

            {sections.map((sec) => (
              <View key={sec.key} wrap={false}>
                <SectionHeading title={sec.title} theme={theme} />
                {sec.rows.map((r) => (
                  <FieldRow
                    key={r.label}
                    label={r.label}
                    value={r.value}
                    theme={theme}
                    labelWidth={140}
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

            <ButtiRow color="#a16207" />
          </PageFrame>
      </Page>
    </Document>
  );
}
