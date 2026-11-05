import {
  Document,
  Ellipse,
  Page,
  Path,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import type { BiodataData } from "@/lib/biodata";
import type { DocLabels } from "../labels";
import { buildSections } from "../rows";
import {
  FieldRow,
  Invocation,
  PhotoFrame,
  SectionHeading,
  scriptFont,
  PageFrame,
  bgColor,
  titleFor,
} from "../components";

function PeacockFeather({ size = 40 }: { size?: number }) {
  const w = size;
  const h = size * 1.7;
  const cx = w / 2;
  const eyeCy = h * 0.3;
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* stem + barbs */}
      <Path
        d={`M${cx} ${eyeCy + h * 0.18} Q${cx + 4} ${h * 0.72} ${cx} ${h * 0.98}`}
        stroke="#047857"
        strokeWidth={1.4}
        fill="none"
      />
      {[-0.85, -0.45, 0.45, 0.85].map((k) => (
        <Path
          key={k}
          d={`M${cx} ${eyeCy + h * 0.28} L${cx + k * w * 0.45} ${h * (0.72 + Math.abs(k) * 0.12)}`}
          stroke="#34d399"
          strokeWidth={0.8}
          fill="none"
        />
      ))}
      {/* feather eye */}
      <Ellipse cx={cx} cy={eyeCy} rx={w * 0.34} ry={h * 0.2} fill="#d97706" />
      <Ellipse cx={cx} cy={eyeCy} rx={w * 0.27} ry={h * 0.155} fill="#059669" />
      <Ellipse cx={cx} cy={eyeCy} rx={w * 0.19} ry={h * 0.11} fill="#0f766e" />
      <Ellipse cx={cx} cy={eyeCy} rx={w * 0.11} ry={h * 0.065} fill="#1d4ed8" />
      <Ellipse cx={cx} cy={eyeCy} rx={w * 0.05} ry={h * 0.03} fill="#fcd34d" />
    </Svg>
  );
}

export function PeacockTemplate({
  data,
  labels,
}: {
  data: BiodataData;
  labels: DocLabels;
}) {
  const theme = {
    primary: "#0f766e", // deep teal
    accent: "#b45309", // gold
    ink: "#292524",
    muted: "#a8a29e",
    headingFont: labels.fonts.heading,
    textFont: labels.fonts.text,
    valueFont: labels.fonts.value,
  };
  const sections = buildSections(data, labels);
  const name = data.personal.name.trim() || labels.fields.name;

  return (
    <Document title={`${name} — ${titleFor(labels, data)}`} author="Shubh Biodata">
      <Page size="A4" style={{ backgroundColor: bgColor(data, "#f7fbf9"), padding: 24 }}>
        <PageFrame override={data.pageBorder} fallback="double" color="#0f766e" color2="#b45309" padding={16}>
        
            <View style={{ alignItems: "center" }}>
              <PeacockFeather size={34} />
              <Invocation text={data.invocation} theme={theme} icon={data.invocationIcon} fontSize={10} />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 2,
                }}
              >
                <Text
                  style={{
                    fontFamily: scriptFont(name, theme.headingFont),
                    fontSize: 21,
                    color: theme.primary,
                  }}
                >
                  {name}
                </Text>
                {data.photo && (
                  <PhotoFrame
                    src={data.photo}
                  frame={data.photoFrame}
                    width={72}
                    borderColor="#b45309"
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
