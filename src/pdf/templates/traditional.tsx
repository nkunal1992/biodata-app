import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections } from "../rows";
import {
  PageFrame,
  FieldRow,
  Invocation,
  PhotoFrame,
  SectionHeading,
  scriptFont,
  bgColor,
} from "../components";

export function TraditionalTemplate({
  data,
  labels,
}: {
  data: BiodataData;
  labels: DocLabels;
}) {
  const theme = {
    primary: "#881337", // maroon
    accent: "#c2410c", // saffron
    ink: "#292524",
    muted: "#a8a29e",
    headingFont: labels.fonts.heading,
    textFont: labels.fonts.text,
    valueFont: labels.fonts.value,
  };
  const sections = buildSections(data, labels);
  const name = data.personal.name.trim() || labels.fields.name;

  return (
    <Document title={`${name} — ${labels.title}`} author="Shubh Biodata">
      <Page
        size="A4"
        style={{ backgroundColor: bgColor(data, "#fffdf5"), padding: 22, display: "flex" }}
      >
        <PageFrame override={data.pageBorder} fallback="double" color="#b45309" color2="#b45309" padding={16}>
          <Invocation text={data.invocation} theme={theme} icon={data.invocationIcon} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <View style={{ flex: 1 }}>
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
                  fontSize: 9,
                  color: theme.accent,
                  letterSpacing: 2,
                  marginTop: 2,
                }}
              >
                {labels.title}
              </Text>
            </View>
            {data.photo && (
              <PhotoFrame src={data.photo}
                  frame={data.photoFrame} width={86} borderColor="#b45309" />
            )}
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
                />
              ))}
            </View>
          ))}
          {data.aboutMe.trim() && (
            <View wrap={false}>
              <SectionHeading title={labels.sections.about} theme={theme} />
              <Text
                style={{
                  fontFamily: theme.valueFont,
                  fontSize: 9.5,
                  color: theme.ink,
                  lineHeight: 1.5,
                }}
              >
                {data.aboutMe}
              </Text>
            </View>
          )}
          {data.expectations.trim() && (
            <View wrap={false}>
              <SectionHeading
                title={labels.sections.expectations}
                theme={theme}
              />
              <Text
                style={{
                  fontFamily: theme.valueFont,
                  fontSize: 9.5,
                  color: theme.ink,
                  lineHeight: 1.5,
                }}
              >
                {data.expectations}
              </Text>
            </View>
          )}
        </PageFrame>
      </Page>
    </Document>
  );
}
