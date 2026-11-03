import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections } from "../rows";
import {
  FieldRow,
  Invocation,
  KalashMark,
  PhotoFrame,
  SectionHeading,
  scriptFont,
  PageFrame,
  bgColor,
} from "../components";

/** पूर्ण कलश — coconut + mango leaves over a decorated pot. */
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
      <Page size="A4" style={{ backgroundColor: bgColor(data, "#fffaf2"), padding: 24 }}>
        <PageFrame override={data.pageBorder} fallback="line" color="#d97706" padding={16}>
          <View style={{ alignItems: "center" }}>
            <KalashMark size={52} />
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
        </PageFrame>
      </Page>
    </Document>
  );
}
