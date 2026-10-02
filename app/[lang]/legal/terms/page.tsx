import LegalPage from "@/components/LegalPage";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "en");
  return { title: `${dict.legal.terms} — ZGlobal` };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "en");

  return (
    <LegalPage title={dict.legal.terms} updated="30 September 2026">
      {lang === "nl" ? (
        <>
          <p>
            Deze Algemene Voorwaarden zijn van toepassing op het gebruik van het ZGlobal-groothandelsplatform
            en alle bestellingen die daarmee worden geplaatst. Het platform is uitsluitend bestemd voor{" "}
            <strong>zakelijke klanten</strong> (B2B). Door een account aan te vragen of een bestelling te
            plaatsen, gaat u akkoord met deze voorwaarden.
          </p>

          <h2>1. Partijen</h2>
          <p>
            De verkoper is <strong>Z Global B.V.</strong>, Parelmoervlinder 10, 3544 DH Utrecht, Nederland,
            KvK 96849568, btw NL867793508B01 (&quot;ZGlobal&quot;). De koper is het bedrijf dat is goedgekeurd
            voor een groothandelsaccount (&quot;Koper&quot;).
          </p>

          <h2>2. Accounts &amp; goedkeuring</h2>
          <p>
            Toegang tot groothandelsprijzen en bestellen vereist een goedgekeurd account. ZGlobal beoordeelt
            elke aanvraag (inclusief de bedrijfslicentie en btw-gegevens) en kan deze naar eigen goeddunken
            goedkeuren of afwijzen. U bent verantwoordelijk voor de juistheid van uw accountgegevens en voor
            het veilig houden van uw inloggegevens.
          </p>

          <h2>3. Prijzen</h2>
          <p>
            Groothandelsprijzen worden exclusief btw getoond en per stuk vermeld. Tenzij anders vermeld,
            worden producten per volledige masterdoos verkocht en gelden minimale bestelhoeveelheden (MOQ).
            Prijzen zijn exclusief verzending en btw en kunnen wijzigen; de toepasselijke prijs is de prijs die
            ZGlobal bij de orderbevestiging bevestigt.
          </p>

          <h2>4. Bestellingen</h2>
          <p>
            Een via het platform ingediende bestelling is een aankoopverzoek en vormt geen bindende
            overeenkomst totdat ZGlobal deze bevestigt. Nadat u een bestelling hebt ingediend, beoordeelt
            ZGlobal deze, berekent de verzending voor uw bestemming en bevestigt het eindtotaal en de
            betalingsgegevens. Elke bestelling wordt afzonderlijk behandeld.
          </p>

          <h2>5. Betaling</h2>
          <p>
            Betaling vindt plaats via <strong>bankoverschrijving</strong>. Er wordt geen betaling via de
            website afgehandeld. Zodra uw bestelling is bevestigd, verstrekt ZGlobal een factuur en de gegevens
            voor de bankoverschrijving. Goedgekeurde accounts kunnen naar goeddunken van ZGlobal
            betalingsvoorwaarden aangeboden krijgen (bijv. NET 30 / NET 60). De goederen blijven eigendom van
            ZGlobal totdat de betaling volledig is ontvangen (eigendomsvoorbehoud).
          </p>

          <h2>6. Levering</h2>
          <p>
            Tenzij anders overeengekomen, worden producten geleverd op <strong>EXW (Ex Works)</strong>-basis
            vanuit een EU-magazijn (Incoterms® 2020); verzending wordt per bestelling afzonderlijk geoffreerd
            op basis van bestemming en volume. Levertijden zijn indicatief en niet gegarandeerd. Het risico
            gaat over op de Koper in overeenstemming met de overeengekomen Incoterm.
          </p>

          <h2>7. Beschikbaarheid</h2>
          <p>
            Alle aanbiedingen zijn onder voorbehoud van voorraadbeschikbaarheid en definitieve
            orderbevestiging. Wanneer een artikel niet beschikbaar is, informeert ZGlobal de Koper en kan een
            alternatief voorstellen of de betreffende regel annuleren.
          </p>

          <h2>8. Retouren &amp; klachten</h2>
          <p>
            Als B2B-leverancier is het wettelijke herroepingsrecht voor consumenten niet van toepassing. De
            Koper moet de goederen bij ontvangst inspecteren en eventuele zichtbare gebreken, schade of
            tekorten binnen 7 dagen na ontvangst schriftelijk melden bij{" "}
            <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a>. Retouren vereisen voorafgaande
            schriftelijke toestemming van ZGlobal; ongeautoriseerde retouren worden niet geaccepteerd.
          </p>

          <h2>9. Aansprakelijkheid</h2>
          <p>
            Voor zover wettelijk toegestaan, is de aansprakelijkheid van ZGlobal beperkt tot de waarde van de
            betreffende bestelling en is indirecte of gevolgschade uitgesloten. Niets in deze voorwaarden
            beperkt aansprakelijkheid die op grond van toepasselijk recht niet kan worden uitgesloten.
          </p>

          <h2>10. Toepasselijk recht</h2>
          <p>
            Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de
            bevoegde rechter te Utrecht, Nederland, tenzij dwingend recht anders bepaalt.
          </p>
        </>
      ) : (
        <>
          <p>
            These General Terms &amp; Conditions govern the use of the ZGlobal wholesale platform and all
            orders placed through it. The platform is intended exclusively for <strong>business customers</strong>{" "}
            (B2B). By requesting an account or placing an order you agree to these terms.
          </p>

          <h2>1. Parties</h2>
          <p>
            The seller is <strong>Z Global B.V.</strong>, Parelmoervlinder 10, 3544 DH Utrecht, The
            Netherlands, KvK 96849568, VAT NL867793508B01 (&quot;ZGlobal&quot;). The buyer is the business that has
            been approved for a wholesale account (&quot;Buyer&quot;).
          </p>

          <h2>2. Accounts &amp; approval</h2>
          <p>
            Access to wholesale pricing and ordering requires an approved account. ZGlobal reviews each
            application (including the business licence and VAT details) and may approve or reject it at its
            discretion. You are responsible for the accuracy of your account details and for keeping your
            credentials secure.
          </p>

          <h2>3. Prices</h2>
          <p>
            Wholesale prices are shown net of VAT and are quoted per unit. Unless stated otherwise, products
            are sold by full master carton and are subject to minimum order quantities (MOQ). Prices exclude
            shipping and VAT and may change; the price applicable is the one confirmed by ZGlobal at order
            confirmation.
          </p>

          <h2>4. Orders</h2>
          <p>
            An order submitted through the platform is a request to purchase and does not constitute a
            binding contract until ZGlobal confirms it. After you submit an order, ZGlobal reviews it,
            calculates shipping for your destination, and confirms the final total and payment details. Each
            order is handled individually.
          </p>

          <h2>5. Payment</h2>
          <p>
            Payment is made by <strong>bank transfer</strong>. No payment is taken through the website. Once
            your order is confirmed, ZGlobal will provide an invoice and bank-transfer details. Approved
            accounts may be offered payment terms (e.g. NET 30 / NET 60) at ZGlobal&apos;s discretion. Goods
            remain the property of ZGlobal until payment is received in full (retention of title).
          </p>

          <h2>6. Delivery</h2>
          <p>
            Unless agreed otherwise, products are supplied on an <strong>EXW (Ex Works)</strong> basis from an
            EU warehouse (Incoterms® 2020); shipping is quoted separately per order based on destination and
            volume. Delivery times are indicative and not guaranteed. Risk passes to the Buyer in accordance
            with the agreed Incoterm.
          </p>

          <h2>7. Availability</h2>
          <p>
            All offers are subject to stock availability and final order confirmation. Where an item is
            unavailable, ZGlobal will inform the Buyer and may propose an alternative or cancel the affected
            line.
          </p>

          <h2>8. Returns &amp; complaints</h2>
          <p>
            As a B2B supplier, the statutory consumer right of withdrawal does not apply. The Buyer must
            inspect goods on receipt and report any visible defects, damage or shortages in writing to{" "}
            <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a> within 7 days of receipt. Returns
            require ZGlobal&apos;s prior written authorisation; unauthorised returns will not be accepted.
          </p>

          <h2>9. Liability</h2>
          <p>
            To the extent permitted by law, ZGlobal&apos;s liability is limited to the value of the order
            concerned and excludes indirect or consequential loss. Nothing in these terms limits liability
            that cannot be excluded under applicable law.
          </p>

          <h2>10. Governing law</h2>
          <p>
            These terms are governed by the laws of the Netherlands. Disputes shall be submitted to the
            competent court in Utrecht, the Netherlands, unless mandatory law provides otherwise.
          </p>
        </>
      )}
    </LegalPage>
  );
}
