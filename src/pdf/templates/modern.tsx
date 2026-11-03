import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections } from "../rows";
import { FieldRow, PhotoFrame, scriptFont, PageFrame } from "../components";

export function ModernTemplate({
  data,
  labels,
}: {
  data: BiodataData;
  labels: DocLabels;
}) {
  const accent = data.accent || "#0d9488";
  const theme = {
    primary: "#1c1917",
    accent,
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
      <Page size="A4" style={{ backgroundColor: "#ffffff", flexDirection: "row" }}>
        <PageFrame override={data.pageBorder} fallback="none" color="{accent}" padding={0}>
        <View style={{ width: 10, backgroundColor: accent }} />
        <View style={{ flex: 1, padding: 30, paddingLeft: 26 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <View style={{ flex: 1, paddingRight: 14 }}>
              <Text
                style={{
                  fontFamily: theme.textFont,
                  fontSize: 8.5,
                  color: accent,
                  letterSpacing: 3,
                  marginBottom: 5,
                }}
              >
                {labels.title.toUpperCase()}
              </Text>
              <Text
                style={{
                  fontFamily: scriptFont(name, theme.headingFont),
                  fontSize: 24,
                  color: theme.primary,
                }}
              >
                {name}
              </Text>
              {data.invocation.trim() ? (
                <Text
                  style={{
                    fontFamily: theme.valueFont,
                    fontSize: 9,
                    color: theme.muted,
                    marginTop: 5,
                  }}
                >
                  {data.invocation}
                </Text>
              ) : null}
            </View>
            {data.photo && (
              <PhotoFrame
                src={data.photo}
                  frame={data.photoFrame}
                width={84}
                borderColor={accent}
                padding={2}
              />
            )}
          </View>

          {sections.map((sec) => (
            <View key={sec.key} wrap={false} style={{ marginTop: 12 }}>
              <Text
                style={{
                  fontFamily: theme.textFont,
                  fontWeight: 700,
                  fontSize: 9,
                  color: accent,
                  letterSpacing: 2,
                  marginBottom: 6,
                }}
              >
                {sec.title.toUpperCase()}
              </Text>
              {sec.rows.map((r) => (
                <FieldRow
                  key={r.label}
                  label={r.label}
                  value={r.value}
                  theme={{
                    ...theme,
                    primary: "#57534e",
                  }}
                  labelWidth={135}
                />
              ))}
            </View>
          ))}

          {(["aboutMe", "expectations"] as const).map((k) => {
            const text = data[k].trim();
            if (!text) return null;
            return (
              <View key={k} wrap={false} style={{ marginTop: 12 }}>
                <Text
                  style={{
                    fontFamily: theme.textFont,
                    fontWeight: 700,
                    fontSize: 9,
                    color: accent,
                    letterSpacing: 2,
                    marginBottom: 6,
                  }}
                >
                  {(k === "aboutMe"
                    ? labels.sections.about
                    : labels.sections.expectations
                  ).toUpperCase()}
                </Text>
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
