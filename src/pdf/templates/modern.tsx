import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections } from "../rows";
import { FieldRow, PhotoFrame, scriptFont, PageFrame , IconMark, bgColor, titleFor,
  CoverPage,
  resolveTheme,
  photoWidth,
} from "../components";

export function ModernTemplate({
  data,
  labels,
  qr,
}: {
  data: BiodataData;
  labels: DocLabels;
  qr?: string;
}) {
  const accent = data.accent || "#0d9488";
  const theme = resolveTheme(data, {
    primary: "#1c1917",
    accent,
    ink: "#292524",
    muted: "#a8a29e",
    headingFont: labels.fonts.heading,
    textFont: labels.fonts.text,
    valueFont: labels.fonts.value,
  });;
  const sections = buildSections(data, labels);
  const name = data.personal.name.trim() || labels.fields.name;

  return (
    <Document title={`${name} — ${titleFor(labels, data)}`} author="Shubh Biodata">
        {data.coverPage && (
          <CoverPage data={data} labels={labels} theme={theme} />
        )}
      <Page size="A4" style={{ backgroundColor: bgColor(data, "#ffffff"), flexDirection: "row" }}>
        <PageFrame qr={qr} footer={data.biodataNo} override={data.pageBorder} fallback="none" color="{accent}" padding={0} texture={data.bgTexture}>
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
                {titleFor(labels, data).toUpperCase()}
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
              <IconMark icon={data.invocationIcon} color={accent} size={15} style={{ alignSelf: "center", marginBottom: 2 }} />
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
                width={photoWidth(data, 84)}
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

          {(["aboutMe", "familyAbout", "expectations", "familyExpectations"] as const).map((k) => {
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
                  {(labels.sections[
                    ({aboutMe: "about", familyAbout: "aboutFamily", expectations: "expectations", familyExpectations: "familyExpectations"} as const)[k]
                  ]
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
