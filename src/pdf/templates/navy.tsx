import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections } from "../rows";
import {
  Diamond,
  FieldRow,
  PhotoFrame,
  scriptFont,
  PageFrame,
  IconMark,
  bgColor,
  titleFor,
} from "../components";

export function NavyTemplate({
  data,
  labels,
}: {
  data: BiodataData;
  labels: DocLabels;
}) {
  const theme = {
    primary: "#1e3a8a", // midnight navy
    accent: "#b45309", // muted gold
    ink: "#292524",
    muted: "#94a3b8",
    headingFont: labels.fonts.heading,
    textFont: labels.fonts.text,
    valueFont: labels.fonts.value,
  };
  const sections = buildSections(data, labels);
  const name = data.personal.name.trim() || labels.fields.name;

  return (
    <Document title={`${name} — ${titleFor(labels, data)}`} author="Shubh Biodata">
      <Page size="A4" style={{ backgroundColor: bgColor(data, "#ffffff"), padding: 30 }}>
        <PageFrame override={data.pageBorder} fallback="line" color="#b45309" padding={22}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 6,
            }}
          >
            <View style={{ flex: 1, paddingRight: 14 }}>
              <Text
                style={{
                  fontFamily: theme.textFont,
                  fontSize: 8.5,
                  color: theme.accent,
                  letterSpacing: 3.5,
                  marginBottom: 6,
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
              <IconMark icon={data.invocationIcon} color="#b45309" size={15} style={{ marginBottom: 2 }} />
              {data.invocation.trim() ? (
                <Text
                  style={{
                    fontFamily: scriptFont(
                      data.invocation,
                      theme.valueFont,
                    ),
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
                width={86}
                borderColor="#b45309"
                padding={3}
              />
            )}
          </View>

          <View
            style={{
              height: 1.6,
              backgroundColor: "#1e3a8a",
              marginBottom: 2,
            }}
          />
          <View
            style={{
              height: 0.5,
              backgroundColor: "#b45309",
              marginBottom: 4,
            }}
          />

          {sections.map((sec) => (
            <View key={sec.key} wrap={false} style={{ marginTop: 13 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 7,
                }}
              >
                <Diamond color="#b45309" size={5} />
                <Text
                  style={{
                    marginLeft: 7,
                    fontFamily: theme.textFont,
                    fontWeight: 700,
                    fontSize: 10.5,
                    color: theme.primary,
                    letterSpacing: 1.4,
                  }}
                >
                  {sec.title}
                </Text>
              </View>
              {sec.rows.map((r) => (
                <FieldRow
                  key={r.label}
                  label={r.label}
                  value={r.value}
                  theme={{ ...theme, primary: "#334155" }}
                  labelWidth={140}
                />
              ))}
            </View>
          ))}

          {(["aboutMe", "familyAbout", "expectations", "familyExpectations"] as const).map((k) => {
            const text = data[k].trim();
            if (!text) return null;
            return (
              <View key={k} wrap={false} style={{ marginTop: 13 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 7,
                  }}
                >
                  <Diamond color="#b45309" size={5} />
                  <Text
                    style={{
                      marginLeft: 7,
                      fontFamily: theme.textFont,
                      fontWeight: 700,
                      fontSize: 10.5,
                      color: theme.primary,
                      letterSpacing: 1.4,
                    }}
                  >
                    {labels.sections[
                    ({aboutMe: "about", familyAbout: "aboutFamily", expectations: "expectations", familyExpectations: "familyExpectations"} as const)[k]
                  ]}
                  </Text>
                </View>
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
              gap: 6,
              marginTop: 22,
            }}
          >
            <Diamond color="#b45309" size={5} />
            <Diamond color="#1e3a8a" size={7} />
            <Diamond color="#b45309" size={5} />
          </View>
        </PageFrame>
      </Page>
    </Document>
  );
}
