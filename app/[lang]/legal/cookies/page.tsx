import LegalPage from "@/components/LegalPage";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "en");
  return { title: `${dict.legal.cookies} — ZGlobal` };
}

export default async function CookiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "en");

  return (
    <LegalPage title={dict.legal.cookies} updated="30 September 2026">
      {lang === "nl" ? (
        <>
          <p>
            Dit Cookiebeleid legt uit hoe <strong>Z Global B.V.</strong> cookies en vergelijkbare
            technologieën op deze website gebruikt.
          </p>

          <h2>1. Wat zijn cookies?</h2>
          <p>
            Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer u een website
            bezoekt. Ze zorgen ervoor dat sites werken, onthouden uw voorkeuren en helpen begrijpen hoe een
            site wordt gebruikt.
          </p>

          <h2>2. Cookies die we gebruiken</h2>
          <ul>
            <li>
              <strong>Strikt noodzakelijk</strong> — vereist om het platform te laten werken: u ingelogd
              houden (authenticatie) en uw winkelwagen onthouden. Deze kunnen niet worden uitgeschakeld.
            </li>
            <li>
              <strong>Voorkeuren</strong> — onthouden keuzes zoals uw cookie-toestemming en, in de toekomst,
              uw voorkeurstaal.
            </li>
            <li>
              <strong>Analyse / marketing</strong> — momenteel niet gebruikt. Als we deze toevoegen, plaatsen
              we ze alleen na uw toestemming en wordt deze pagina bijgewerkt.
            </li>
          </ul>

          <h2>3. Cookies beheren</h2>
          <p>
            Bij uw eerste bezoek kunt u in de cookiebanner kiezen voor &quot;Alles accepteren&quot; of
            &quot;Alleen essentieel&quot;. U kunt cookies ook beheren of verwijderen via uw
            browserinstellingen. Het blokkeren van strikt noodzakelijke cookies kan ervoor zorgen dat delen
            van de site (zoals inloggen en afrekenen) niet werken.
          </p>

          <h2>4. Wijzigingen</h2>
          <p>We kunnen dit beleid bijwerken wanneer ons gebruik van cookies verandert. De huidige versie wordt altijd hier getoond.</p>

          <h2>5. Contact</h2>
          <p>
            Vragen over dit beleid? Mail naar <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a>.
          </p>
        </>
      ) : (
        <>
          <p>
            This Cookie Policy explains how <strong>Z Global B.V.</strong> uses cookies and similar
            technologies on this website.
          </p>

          <h2>1. What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They are used to
            make sites work, to remember your preferences, and to understand how a site is used.
          </p>

          <h2>2. Cookies we use</h2>
          <ul>
            <li>
              <strong>Strictly necessary</strong> — required to operate the platform: keeping you signed in
              (authentication) and remembering your cart. These cannot be switched off.
            </li>
            <li>
              <strong>Preferences</strong> — remember choices such as your cookie-consent selection and, in
              future, your preferred language.
            </li>
            <li>
              <strong>Analytics / marketing</strong> — not currently used. If we add them, we will only set
              them after you consent, and this page will be updated.
            </li>
          </ul>

          <h2>3. Managing cookies</h2>
          <p>
            On your first visit you can choose &quot;Accept all&quot; or &quot;Essential only&quot; in the
            cookie banner. You can also control or delete cookies through your browser settings. Blocking
            strictly necessary cookies may prevent parts of the site (such as sign-in and checkout) from
            working.
          </p>

          <h2>4. Changes</h2>
          <p>We may update this policy as our use of cookies changes. The current version is always shown here.</p>

          <h2>5. Contact</h2>
          <p>
            Questions about this policy? Email <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a>.
          </p>
        </>
      )}
    </LegalPage>
  );
}
