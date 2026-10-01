import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy — ZGlobal" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="30 September 2026">
      <p>
        This Privacy Policy explains how <strong>Z Global B.V.</strong> ("ZGlobal", "we", "us") collects
        and processes personal data of business users of this wholesale platform, in accordance with the
        EU General Data Protection Regulation (GDPR) and the Dutch GDPR Implementation Act (UAVG).
      </p>

      <h2>1. Controller</h2>
      <p>
        The data controller is Z Global B.V., Parelmoervlinder 10, 3544 DH Utrecht, The Netherlands,
        KvK 96849568. For any privacy request, contact{" "}
        <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a>.
      </p>

      <h2>2. What we collect</h2>
      <ul>
        <li><strong>Account &amp; application data:</strong> name, business email, company name, VAT number, phone, address, and your uploaded business licence.</li>
        <li><strong>Order data:</strong> the products, quantities, delivery address and notes you submit when placing an order.</li>
        <li><strong>Technical data:</strong> authentication cookies and basic security/log data needed to operate the site.</li>
      </ul>

      <h2>3. Why we process it (legal bases)</h2>
      <ul>
        <li>To review your wholesale application and manage your account — <strong>contract</strong> and our <strong>legitimate interest</strong> in verifying business customers.</li>
        <li>To process and fulfil orders and arrange delivery and payment — <strong>contract</strong>.</li>
        <li>To comply with tax, accounting and other legal obligations — <strong>legal obligation</strong>.</li>
        <li>To send commercial communications where you have opted in — <strong>consent</strong> (withdrawable at any time).</li>
      </ul>

      <h2>4. Sharing</h2>
      <p>
        We share data only as needed with service providers acting on our behalf (e.g. hosting and
        database provider, logistics partners) and with authorities where legally required. Our platform
        and database are hosted with Supabase; hosting/CDN is provided by our infrastructure providers.
        We do not sell personal data.
      </p>

      <h2>5. International transfers</h2>
      <p>
        Some of our service providers may process data outside the European Economic Area. Where they do,
        we rely on appropriate safeguards such as the European Commission&apos;s Standard Contractual
        Clauses.
      </p>

      <h2>6. Retention</h2>
      <p>
        We keep account and order data for the duration of the business relationship and thereafter as
        required by law (e.g. Dutch statutory retention periods for invoices and administration). Business
        licences are kept only as long as needed to verify and maintain your account.
      </p>

      <h2>7. Your rights</h2>
      <p>
        You have the right to access, rectify, erase, restrict and port your data, and to object to
        processing. You may withdraw marketing consent at any time. To exercise these rights, email{" "}
        <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a>. You may also lodge a complaint with
        the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).
      </p>

      <h2>8. Security</h2>
      <p>
        We apply appropriate technical and organisational measures to protect your data, including
        encrypted connections and access controls. Uploaded business licences are stored privately and
        are accessible only to authorised administrators.
      </p>

      <h2>9. Changes</h2>
      <p>We may update this policy from time to time; the latest version is always available on this page.</p>
    </LegalPage>
  );
}
