import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections, type Row } from "../rows";
import { FieldRow, PhotoFrame, scriptFont } from "../components";

function SidebarRow({
  label,
  value,
  labelFont,
  valueFont,
}: {
  label: string;
  value: string;
  labelFont: string;
  valueFont: string;
}) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text
        style={{
          fontFamily: labelFont,
          fontSize: 7.5,
          color: "#a7f3d0",
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 1.5,
        }}
      >
        {label}
      </Text>
      <Text
        style={{ fontFamily: valueFont, fontSize: 9.5, color: "#ecfdf5" }}
      >
        {value}
      </Text>
    </View>
  );
}

export function EmeraldTemplate({
  data,
  labels,
}: {
  data: BiodataData;
  labels: DocLabels;
}) {
  const theme = {
    primary: "#065f46",
    accent: "#10b981",
    ink: "#292524",
    muted: "#a8a29e",
    headingFont: labels.fonts.heading,
    textFont: labels.fonts.text,
    valueFont: labels.fonts.value,
  };
  const sections = buildSections(data, labels);
  const contact = sections.find((s) => s.key === "contact");
  const main = sections.filter((s) => s.key !== "contact");

  // Quick facts for the sidebar: dob, height, manglik rows from personal/astro.
  const quickKeys = [
    labels.fields.dob,
    labels.fields.height,
    labels.fields.manglik,
    labels.fields.maritalStatus,
  ];
  const quick: Row[] = sections
    .filter((s) => s.key === "personal" || s.key === "astro")
    .flatMap((s) => s.rows)
    .filter((r) => quickKeys.includes(r.label));

  const name = data.personal.name.trim() || labels.fields.name;

  return (
    <Document title={`${name} — ${labels.title}`} author="Shubh Biodata">
      <Page
        size="A4"
        style={{ backgroundColor: "#ffffff", flexDirection: "row" }}
      >
        <View
          style={{
            width: 175,
            backgroundColor: "#065f46",
            padding: 20,
            paddingTop: 26,
          }}
        >
          {data.photo && (
            <View style={{ alignItems: "center", marginBottom: 14 }}>
              <PhotoFrame
                src={data.photo}
                width={105}
                borderColor="#a7f3d0"
                padding={3}
              />
            </View>
          )}
          <Text
            style={{
              fontFamily: scriptFont(name, theme.headingFont),
              fontSize: 17,
              color: "#ffffff",
              marginBottom: 3,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontFamily: theme.textFont,
              fontSize: 8,
              color: "#a7f3d0",
              letterSpacing: 2,
              marginBottom: 12,
            }}
          >
            {labels.title}
          </Text>
          {data.invocation.trim() ? (
            <Text
              style={{
                fontFamily: theme.valueFont,
                fontSize: 8.5,
                color: "#d1fae5",
                marginBottom: 12,
              }}
            >
              {data.invocation}
            </Text>
          ) : null}

          {quick.length > 0 && (
            <View style={{ marginBottom: 14 }}>
              {quick.map((r) => (
                <SidebarRow
                  key={r.label}
                  label={r.label}
                  value={r.value}
                  labelFont={theme.textFont}
                  valueFont={theme.valueFont}
                />
              ))}
            </View>
          )}
          {contact && contact.rows.length > 0 && (
            <View>
              <Text
                style={{
                  fontFamily: theme.textFont,
                  fontWeight: 700,
                  fontSize: 9,
                  color: "#6ee7b7",
                  letterSpacing: 2,
                  marginBottom: 8,
                }}
              >
                {contact.title.toUpperCase()}
              </Text>
              {contact.rows.map((r) => (
                <SidebarRow
                  key={r.label}
                  label={r.label}
                  value={r.value}
                  labelFont={theme.textFont}
                  valueFont={theme.valueFont}
                />
              ))}
            </View>
          )}
        </View>

        <View style={{ flex: 1, padding: 26, paddingTop: 30 }}>
          {main.map((sec, i) => (
            <View key={sec.key} wrap={false} style={{ marginTop: i === 0 ? 0 : 13 }}>
              <View
                style={{
                  borderLeft: `3pt solid ${theme.accent}`,
                  paddingLeft: 8,
                  marginBottom: 7,
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.textFont,
                    fontWeight: 700,
                    fontSize: 10,
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
                  theme={theme}
                  labelWidth={125}
                />
              ))}
            </View>
          ))}

          {(["aboutMe", "expectations"] as const).map((k) => {
            const text = data[k].trim();
            if (!text) return null;
            return (
              <View key={k} wrap={false} style={{ marginTop: 13 }}>
                <View
                  style={{
                    borderLeft: `3pt solid ${theme.accent}`,
                    paddingLeft: 8,
                    marginBottom: 7,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.textFont,
                      fontWeight: 700,
                      fontSize: 10,
                      color: theme.primary,
                      letterSpacing: 1.4,
                    }}
                  >
                    {k === "aboutMe"
                      ? labels.sections.about
                      : labels.sections.expectations}
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
        </View>
      </Page>
    </Document>
  );
}
