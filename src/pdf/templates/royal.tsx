import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections } from "../rows";
import {
  Diamond,
  FieldRow,
  PhotoFrame,
  SectionHeading,
  scriptFont,
  PageFrame,
  IconMark,
  bgColor,
} from "../components";

export function RoyalTemplate({
  data,
  labels,
}: {
  data: BiodataData;
  labels: DocLabels;
}) {
  const theme = {
    primary: "#881337",
    accent: "#b45309", // antique gold
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
      <Page size="A4" style={{ backgroundColor: bgColor(data, "#ffffff") }}>
        <PageFrame override={data.pageBorder} fallback="none" color="#6d0f2b" padding={0}>
        <View
          style={{
            backgroundColor: "#6d0f2b",
            paddingVertical: 22,
            paddingHorizontal: 30,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <IconMark
              icon={data.invocationIcon}
              color="#e8c06f"
              size={16}
              style={{ marginBottom: 3 }}
            />
            {data.invocation.trim() ? (
              <Text
                style={{
                  fontFamily: scriptFont(data.invocation, theme.valueFont),
                  fontSize: 10,
                  color: "#fbbf24",
                  marginBottom: 6,
                }}
              >
                {data.invocation}
              </Text>
            ) : null}
            <Text
              style={{
                fontFamily: scriptFont(name, theme.headingFont),
                fontSize: 24,
                color: "#fef3c7",
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                fontFamily: theme.textFont,
                fontSize: 9,
                color: "#fcd34d",
                letterSpacing: 2.5,
                marginTop: 4,
              }}
            >
              {labels.title}
            </Text>
          </View>
          {data.photo && (
            <PhotoFrame
              src={data.photo}
                  frame={data.photoFrame}
              width={84}
              borderColor="#fbbf24"
              padding={2}
            />
          )}
        </View>

        <View style={{ paddingHorizontal: 34, paddingBottom: 24 }}>
          {sections.map((sec, i) => (
            <View key={sec.key} wrap={false}>
              <SectionHeading
                title={sec.title}
                theme={theme}
                marginTop={i === 0 ? 18 : 13}
              />
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
            const title =
              k === "aboutMe"
                ? labels.sections.about
                : labels.sections.expectations;
            return (
              <View key={k} wrap={false}>
                <SectionHeading title={title} theme={theme} />
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              marginTop: 22,
            }}
          >
            <Diamond color={theme.accent} size={5} />
            <Diamond color={theme.primary} size={7} />
            <Diamond color={theme.accent} size={5} />
          </View>
        </View>
        </PageFrame>
      </Page>
    </Document>
  );
}
