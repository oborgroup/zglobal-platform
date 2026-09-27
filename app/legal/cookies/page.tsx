import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Cookie Policy — ZGlobal" };

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy">
      <p>
        This Cookie Policy explains how <strong>ZGlobal B.V.</strong> uses cookies and similar
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
          <strong>Preferences</strong> — remember choices such as your cookie consent and, in future,
          your language. [Confirm if used.]
        </li>
        <li>
          <strong>Analytics / marketing</strong> — not currently used. If we add them, we will only set
          them after you consent, and this page will be updated. [Update when applicable.]
        </li>
      </ul>

      <h2>3. Managing cookies</h2>
      <p>
        On your first visit you can choose "Accept all" or "Essential only" in the cookie banner. You can
        also control or delete cookies through your browser settings. Blocking strictly necessary cookies
        may prevent parts of the site (such as sign-in and checkout) from working.
      </p>

      <h2>4. Changes</h2>
      <p>We may update this policy as our use of cookies changes. The current version is always shown here.</p>

      <h2>5. Contact</h2>
      <p>
        Questions about this policy? Email <a href="mailto:info@zglobalcorp.com">info@zglobalcorp.com</a>.
      </p>
    </LegalPage>
  );
}
