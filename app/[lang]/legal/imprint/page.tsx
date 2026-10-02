import LegalPage from "@/components/LegalPage";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "en");
  return { title: `${dict.legal.imprint} — ZGlobal` };
}

export default async function ImprintPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "en");

  return (
    <LegalPage title={dict.legal.imprint} updated="30 September 2026">
      {lang === "nl" ? (
        <>
          <h2>Bedrijfsgegevens</h2>
          <p>Deze website wordt beheerd door:</p>
          <ul>
            <li><strong>Z Global B.V.</strong> (handelend onder de naam &quot;ZGlobal&quot;)</li>
            <li>Vestigingsadres: Parelmoervlinder 10, 3544 DH Utrecht, Nederland</li>
            <li>KvK-nummer: 96849568</li>
            <li>Btw-nummer: NL867793508B01</li>
            <li>E-mail: <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a></li>
            <li>Telefoon: <a href="tel:+393453067000">+39 345 306 7000</a></li>
            <li>Website: <a href="https://www.zglobalcorp.com">www.zglobalcorp.com</a></li>
          </ul>

          <h2>Bevoegde vertegenwoordiger</h2>
          <p>Vertegenwoordigd door: Xing Zheng (bestuurder).</p>

          <h2>Verantwoordelijk voor de inhoud</h2>
          <p>Z Global B.V., op het bovenstaande adres.</p>

          <h2>Geschillenbeslechting</h2>
          <p>
            De Europese Commissie biedt een platform voor onlinegeschillenbeslechting (ODR):{" "}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.
            Dit platform is bedoeld voor consumenten; ZGlobal exploiteert een business-to-business (B2B)
            groothandelsplatform. Wij zijn niet verplicht noch bereid om deel te nemen aan
            geschillenbeslechtingsprocedures voor een consumentengeschillencommissie.
          </p>

          <h2>Aansprakelijkheid voor inhoud en links</h2>
          <p>
            Wij doen ons best om de informatie op deze site accuraat en actueel te houden, maar aanvaarden
            geen aansprakelijkheid voor de volledigheid of juistheid ervan. Onze site kan links naar externe
            websites bevatten waarover wij geen controle hebben; wij aanvaarden geen aansprakelijkheid voor
            dergelijke inhoud van derden.
          </p>
        </>
      ) : (
        <>
          <h2>Company details</h2>
          <p>This website is operated by:</p>
          <ul>
            <li><strong>Z Global B.V.</strong> (trading as &quot;ZGlobal&quot;)</li>
            <li>Registered address: Parelmoervlinder 10, 3544 DH Utrecht, The Netherlands</li>
            <li>Chamber of Commerce (KvK) number: 96849568</li>
            <li>VAT / BTW number: NL867793508B01</li>
            <li>Email: <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a></li>
            <li>Phone: <a href="tel:+393453067000">+39 345 306 7000</a></li>
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
        </>
      )}
    </LegalPage>
  );
}
