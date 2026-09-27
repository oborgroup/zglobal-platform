import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Terms & Conditions — ZGlobal" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms &amp; Conditions">
      <p>
        These General Terms &amp; Conditions govern the use of the ZGlobal wholesale platform and all
        orders placed through it. The platform is intended exclusively for <strong>business customers</strong>{" "}
        (B2B). By requesting an account or placing an order you agree to these terms.
      </p>

      <h2>1. Parties</h2>
      <p>
        The seller is <strong>ZGlobal B.V.</strong>, [Registered address], KvK [KvK number], VAT
        [VAT/BTW number] ("ZGlobal"). The buyer is the business that has been approved for a wholesale
        account ("Buyer").
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
        inspect goods on receipt and report visible defects or shortages without undue delay. [Insert
        ZGlobal&apos;s returns/complaints procedure and timeframes.]
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
        competent court in [Court / district], unless mandatory law provides otherwise.
      </p>
    </LegalPage>
  );
}
