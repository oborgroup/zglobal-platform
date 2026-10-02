import LegalPage from "@/components/LegalPage";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "en");
  return { title: `${dict.legal.privacy} — ZGlobal` };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "en");

  return (
    <LegalPage title={dict.legal.privacy} updated="30 September 2026">
      {lang === "nl" ? (
        <>
          <p>
            Dit Privacybeleid legt uit hoe <strong>Z Global B.V.</strong> (&quot;ZGlobal&quot;, &quot;wij&quot;,
            &quot;ons&quot;) persoonsgegevens van zakelijke gebruikers van dit groothandelsplatform verzamelt en
            verwerkt, in overeenstemming met de Algemene verordening gegevensbescherming (AVG) van de EU en
            de Nederlandse Uitvoeringswet AVG (UAVG).
          </p>

          <h2>1. Verwerkingsverantwoordelijke</h2>
          <p>
            De verwerkingsverantwoordelijke is Z Global B.V., Parelmoervlinder 10, 3544 DH Utrecht, Nederland,
            KvK 96849568. Voor privacyverzoeken kunt u contact opnemen via{" "}
            <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a>.
          </p>

          <h2>2. Wat we verzamelen</h2>
          <ul>
            <li><strong>Account- &amp; aanvraaggegevens:</strong> naam, zakelijk e-mailadres, bedrijfsnaam, btw-nummer, telefoonnummer, adres en uw geüploade bedrijfslicentie.</li>
            <li><strong>Bestelgegevens:</strong> de producten, aantallen, bezorgadres en opmerkingen die u opgeeft bij het plaatsen van een bestelling.</li>
            <li><strong>Technische gegevens:</strong> authenticatiecookies en basis beveiligings-/loggegevens die nodig zijn om de site te laten werken.</li>
          </ul>

          <h2>3. Waarom we deze verwerken (rechtsgronden)</h2>
          <ul>
            <li>Om uw groothandelsaanvraag te beoordelen en uw account te beheren — <strong>overeenkomst</strong> en ons <strong>gerechtvaardigd belang</strong> bij het verifiëren van zakelijke klanten.</li>
            <li>Om bestellingen te verwerken en uit te voeren en levering en betaling te regelen — <strong>overeenkomst</strong>.</li>
            <li>Om te voldoen aan fiscale, boekhoudkundige en andere wettelijke verplichtingen — <strong>wettelijke verplichting</strong>.</li>
            <li>Om commerciële communicatie te versturen waar u zich hebt aangemeld — <strong>toestemming</strong> (op elk moment intrekbaar).</li>
          </ul>

          <h2>4. Delen</h2>
          <p>
            We delen gegevens alleen voor zover nodig met dienstverleners die namens ons handelen (bijv.
            hosting- en databaseprovider, logistieke partners) en met autoriteiten waar dit wettelijk vereist
            is. Ons platform en onze database worden gehost bij Supabase; hosting/CDN wordt geleverd door onze
            infrastructuurproviders. Wij verkopen geen persoonsgegevens.
          </p>

          <h2>5. Internationale doorgifte</h2>
          <p>
            Sommige van onze dienstverleners verwerken gegevens mogelijk buiten de Europese Economische
            Ruimte. Waar dat gebeurt, vertrouwen we op passende waarborgen zoals de modelcontractbepalingen
            (Standard Contractual Clauses) van de Europese Commissie.
          </p>

          <h2>6. Bewaring</h2>
          <p>
            We bewaren account- en bestelgegevens voor de duur van de zakelijke relatie en daarna zolang als
            wettelijk vereist (bijv. de Nederlandse wettelijke bewaartermijnen voor facturen en
            administratie). Bedrijfslicenties worden alleen bewaard zolang als nodig is om uw account te
            verifiëren en te onderhouden.
          </p>

          <h2>7. Uw rechten</h2>
          <p>
            U hebt het recht op inzage, rectificatie, verwijdering, beperking en overdraagbaarheid van uw
            gegevens, en om bezwaar te maken tegen verwerking. U kunt uw marketingtoestemming op elk moment
            intrekken. Om deze rechten uit te oefenen, mailt u naar{" "}
            <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a>. U kunt ook een klacht indienen bij
            de Autoriteit Persoonsgegevens.
          </p>

          <h2>8. Beveiliging</h2>
          <p>
            We passen passende technische en organisatorische maatregelen toe om uw gegevens te beschermen,
            waaronder versleutelde verbindingen en toegangscontroles. Geüploade bedrijfslicenties worden privé
            opgeslagen en zijn alleen toegankelijk voor bevoegde beheerders.
          </p>

          <h2>9. Wijzigingen</h2>
          <p>We kunnen dit beleid van tijd tot tijd bijwerken; de meest recente versie is altijd op deze pagina beschikbaar.</p>
        </>
      ) : (
        <>
          <p>
            This Privacy Policy explains how <strong>Z Global B.V.</strong> (&quot;ZGlobal&quot;, &quot;we&quot;, &quot;us&quot;) collects
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
        </>
      )}
    </LegalPage>
  );
}
