import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections } from "../rows";
import { FieldRow, Invocation, PhotoFrame, scriptFont, SectionHeading, PageFrame, bgColor, titleFor,
} from "../components";

export function FloralTemplate({
  data,
  labels,
  qr,
}: {
  data: BiodataData;
  labels: DocLabels;
  qr?: string;
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
    <Document title={`${name} — ${titleFor(labels, data)}`} author="Shubh Biodata">
      <Page size="A4" style={{ backgroundColor: bgColor(data, "#fff9f4"), padding: 20 }}>
        <PageFrame qr={qr} footer={data.biodataNo} override={data.pageBorder} fallback="floral" color="#f9a8d4" color2="#f472b6" padding={18} style={{ margin: 20 }}>
          <Invocation text={data.invocation} theme={theme} icon={data.invocationIcon} />
          <View style={{ alignItems: "center", marginBottom: 4 }}>
            {data.photo && (
              <PhotoFrame
                src={data.photo}
                  frame={data.photoFrame}
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
              {titleFor(labels, data)}
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
        </PageFrame>
      </Page>
    </Document>
  );
}
