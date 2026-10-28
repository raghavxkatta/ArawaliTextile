import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Text } from "@react-email/components";
import { site, whatsappUrl } from "@/data/site";
import type { Enquiry } from "@/lib/validation";

const c = { maroon: "#7B1E26", cream: "#FAF6EF", paper: "#FFFDF9", ink: "#1D2621", muted: "#545B56", line: "#E6DCCF" };

export function BuyerAutoReply({ enquiry: e }: { enquiry: Enquiry }) {
  const firstName = e.name.split(/\s+/)[0];
  const p = { fontSize: 16, lineHeight: "1.65", margin: "0 0 14px" };
  return (
    <Html lang="en">
      <Head />
      <Preview>Thank you, we’ve received your enquiry.</Preview>
      <Body style={{ background: c.cream, fontFamily: "Helvetica, Arial, sans-serif", color: c.ink, margin: 0, padding: "24px 0" }}>
        <Container style={{ background: c.paper, border: `1px solid ${c.line}`, maxWidth: 560, padding: 32 }}>
          <Text style={{ color: c.maroon, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", margin: 0 }}>ARAWALI TEXTILE · JAIPUR</Text>
          <Heading as="h1" style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: 30, margin: "10px 0 18px" }}>
            Thank you, {firstName}.
          </Heading>
          <Text style={p}>
            We’ve received your enquiry about <strong>{e.product}</strong> and will reply within one working day with prices, lead times and
            sample options.
          </Text>
          <Text style={p}>
            If anything is urgent, you can reach us on{" "}
            <Link href={whatsappUrl()} style={{ color: c.maroon }}>
              WhatsApp
            </Link>{" "}
            at {site.phoneDisplay}, or simply reply to this email.
          </Text>
          <Text style={{ ...p, margin: "22px 0 0" }}>
            Warm regards,
            <br />
            <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontStyle: "italic" }}>Arawali Textile, Jaipur</span>
          </Text>
          <Hr style={{ borderColor: c.line, margin: "26px 0 12px" }} />
          <Text style={{ color: c.muted, fontSize: 12, margin: 0 }}>{site.address.full}</Text>
        </Container>
      </Body>
    </Html>
  );
}
