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
  bgColor,
  titleFor,
} from "../components";

/** Repeating jaali-lattice band of tiny diamonds. */
function JaaliBand({ color, count = 26 }: { color: string; count?: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 6,
        paddingHorizontal: 10,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Diamond key={i} size={4} color={color} />
      ))}
    </View>
  );
}

export function JharokhaTemplate({
  data,
  labels,
  qr,
}: {
  data: BiodataData;
  labels: DocLabels;
  qr?: string;
}) {
  const theme = {
    primary: "#7f1d1d", // deep maroon
    accent: "#b45309", // burnished gold
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
      <Page size="A4" style={{ backgroundColor: bgColor(data, "#faf3e3"), padding: 24 }}>
        <PageFrame qr={qr} footer={data.biodataNo} override={data.pageBorder} fallback="line" color="#b45309" padding={16}>
          <JaaliBand color="#b45309" />
          <View style={{ alignItems: "center", marginBottom: 4 }}>
            <Invocation text={data.invocation} theme={theme} icon={data.invocationIcon} />
            {data.photo ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  alignSelf: "stretch",
                  paddingHorizontal: 30,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: scriptFont(name, theme.headingFont),
                      fontSize: 23,
                      color: theme.primary,
                    }}
                  >
                    {name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.textFont,
                      fontSize: 8.5,
                      color: theme.accent,
                      letterSpacing: 3,
                      marginTop: 4,
                    }}
                  >
                    {titleFor(labels, data)}
                  </Text>
                </View>
                <PhotoFrame src={data.photo} width={84} borderColor="#b45309" padding={3} frame={data.photoFrame ?? "arch"} />
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: scriptFont(name, theme.headingFont),
                    fontSize: 23,
                    color: theme.primary,
                  }}
                >
                  {name}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.textFont,
                    fontSize: 8.5,
                    color: theme.accent,
                    letterSpacing: 3,
                    marginTop: 4,
                  }}
                >
                  {titleFor(labels, data)}
                </Text>
              </View>
            )}
          </View>
          <JaaliBand color="#d4a017" count={26} />

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

          <JaaliBand color="#b45309" />
        </PageFrame>
      </Page>
    </Document>
  );
}
