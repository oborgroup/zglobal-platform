import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Legal Notice — ZGlobal" };

export default function ImprintPage() {
  return (
    <LegalPage title="Legal Notice" updated="30 September 2026">
      <h2>Company details</h2>
      <p>This website is operated by:</p>
      <ul>
        <li><strong>Z Global B.V.</strong> (trading as &quot;ZGlobal&quot;)</li>
        <li>Registered address: Parelmoervlinder 10, 3544 DH Utrecht, The Netherlands</li>
        <li>Chamber of Commerce (KvK) number: 96849568</li>
        <li>VAT / BTW number: NL867793508B01</li>
        <li>Email: <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a></li>
        <li>Website: <a href="https://www.zglobalcorp.com">www.zglobalcorp.com</a></li>
      </ul>

      <h2>Authorised representative</h2>
      <p>Represented by: Xing Zheng (Director).</p>

      <h2>Responsible for content</h2>
      <p>Z Global B.V., at the address above.</p>

      <h2>Dispute resolution</h2>
      <p>
        The European Commission provides a platform for online dispute resolution (ODR):{" "}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.
        Note that this platform is intended for consumers; ZGlobal operates a business-to-business (B2B)
        wholesale platform. We are neither obliged nor willing to participate in dispute-resolution
        proceedings before a consumer arbitration board.
      </p>

      <h2>Liability for content and links</h2>
      <p>
        We take care to keep the information on this site accurate and up to date but accept no liability
        for its completeness or accuracy. Our site may contain links to external websites over whose
        content we have no control; we accept no liability for such third-party content.
      </p>
    </LegalPage>
  );
}
