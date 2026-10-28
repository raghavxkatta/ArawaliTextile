import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { Enquiry } from "@/lib/validation";

// Email clients ignore CSS variables, so the brand colours are repeated here as literals.
const c = { maroon: "#7B1E26", cream: "#FAF6EF", paper: "#FFFDF9", ink: "#1D2621", muted: "#545B56", line: "#E6DCCF", whatsapp: "#1F7A4D" };

type Props = { enquiry: Enquiry; whatsappReplyUrl: string | null; receivedAt: string };

export function OwnerEnquiry({ enquiry: e, whatsappReplyUrl, receivedAt }: Props) {
  const rows: [string, string][] = [
    ["Name", e.name],
    ["Company", e.company || "-"],
    ["Email", e.email],
    ["Phone", e.phone || "-"],
    ["Country", e.country],
    ["Product", e.product],
    ["Quantity", e.quantity || "-"],
  ];
  return (
    <Html lang="en">
      <Head />
      <Preview>{`${e.product} from ${e.name}, ${e.country}`}</Preview>
      <Body style={{ background: c.cream, fontFamily: "Helvetica, Arial, sans-serif", color: c.ink, margin: 0, padding: "24px 0" }}>
        <Container style={{ background: c.paper, border: `1px solid ${c.line}`, maxWidth: 560, padding: "28px 28px 20px" }}>
          <Text style={{ color: c.maroon, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", margin: 0 }}>NEW WEBSITE ENQUIRY</Text>
          <Heading as="h1" style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: 30, margin: "8px 0 4px" }}>
            {e.product}
          </Heading>
          <Text style={{ color: c.muted, margin: "0 0 18px", fontSize: 14 }}>
            from {e.name}
            {e.company ? `, ${e.company}` : ""} · {e.country} · {receivedAt}
          </Text>

          <Section>
            <table cellPadding={0} cellSpacing={0} style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <tbody>
                {rows.map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ padding: "8px 12px 8px 0", color: c.maroon, fontWeight: 700, width: 110, verticalAlign: "top", borderTop: `1px solid ${c.line}` }}>{k}</td>
                    <td style={{ padding: "8px 0", borderTop: `1px solid ${c.line}` }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Text style={{ color: c.maroon, fontWeight: 700, fontSize: 14, margin: "20px 0 6px" }}>Message</Text>
          <Text style={{ whiteSpace: "pre-wrap", background: c.cream, padding: 14, margin: 0, fontSize: 15, lineHeight: "1.6" }}>
            {e.message || "-"}
          </Text>

          <Section style={{ marginTop: 24 }}>
            {whatsappReplyUrl && (
              <Button href={whatsappReplyUrl} style={{ background: c.whatsapp, color: "#fff", padding: "14px 22px", fontWeight: 700, fontSize: 15, marginRight: 10, marginBottom: 10 }}>
                Reply on WhatsApp
              </Button>
            )}
            <Button href={`mailto:${e.email}`} style={{ background: c.maroon, color: "#fff", padding: "14px 22px", fontWeight: 700, fontSize: 15 }}>
              Reply by email
            </Button>
          </Section>

          <Hr style={{ borderColor: c.line, margin: "24px 0 12px" }} />
          <Text style={{ color: c.muted, fontSize: 12, margin: 0 }}>Hitting “Reply” answers the buyer directly. Saved to the leads table.</Text>
        </Container>
      </Body>
    </Html>
  );
}
