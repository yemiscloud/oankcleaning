import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F382C]">{title}</h2>
    <div className="space-y-3 text-sm sm:text-base leading-7 text-slate-700">{children}</div>
  </section>
);

export const PrivacyPage: React.FC = () => (
  <main className="bg-slate-50 py-12 sm:py-16">
    <article className="mx-auto max-w-4xl px-4 sm:px-8">
      <header className="mb-10 rounded-3xl bg-[#0F382C] p-7 sm:p-10 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">OANK Cleaning CIC</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-bold">Privacy Policy</h1>
        <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-slate-200">
          This policy explains how OANK Cleaning CIC collects, uses, stores and shares personal information when you visit our website, contact us, request a quote or use our online chat.
        </p>
        <p className="mt-4 text-xs text-slate-300">Last updated: 15 November 2026</p>
      </header>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 mb-10">
        This policy describes the website features currently identified in our project. We will update it if our services, systems or data practices change. Please do not send sensitive personal information through the website or chat unless it is necessary for your enquiry.
      </div>

      <div className="space-y-9">
        <Section title="1. Who we are">
          <p>OANK Cleaning CIC is the organisation responsible for the personal information described in this policy (the data controller).</p>
          <p><strong>Contact:</strong> <a className="font-semibold text-[#0F382C] underline" href="mailto:info@oankcleaning.co.uk">info@oankcleaning.co.uk</a> · <a className="font-semibold text-[#0F382C] underline" href="tel:+447731956727">+44 77 3195 6727</a></p>
          <p>We provide cleaning services across the whole of Renfrewshire and Glasgow. We operate as a service-area business and do not receive customers at a public office.</p>
        </Section>

        <Section title="2. Personal information we collect">
          <p>Depending on how you use the website, we may collect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Contact and enquiry details:</strong> your name, email address, telephone number, service requested, postcode or general location, preferred date or days, and the message you send us.</li>
            <li><strong>Quote and booking-request details:</strong> property type, number of bedrooms and bathrooms, cleaning frequency, selected service and add-ons, preferred days or date, postcode, contact details, notes and the starting-price guidance displayed in the quote request form.</li>
            <li><strong>Chat information:</strong> the messages you send to our website receptionist and its replies, a generated session reference, timestamps, your IP address and browser user-agent information. Chat messages are recorded by our website system for enquiry handling, service review and security.</li>
            <li><strong>Cookie and device information:</strong> your saved cookie preferences and, only where you consent, information collected by Google Analytics and Meta Pixel. These services may use cookies or similar technologies and collect information such as device/browser details, pages viewed and interactions.</li>
            <li><strong>Job tracking information:</strong> the job reference, service requested, preferred date and job status. Customers can use their reference code to view limited job details; authorised administrators can view additional job information after email verification.</li>
            <li><strong>Technical and security information:</strong> information generated when your browser communicates with our website, which may include IP address, browser type, timestamps and diagnostic or error information.</li>
          </ul>
        </Section>

        <Section title="3. How and why we use your information">
          <ul className="list-disc pl-6 space-y-2">
            <li>To respond to questions, contact you about your enquiry and provide requested quotes.</li>
            <li>To assess cleaning requirements, arrange appointments and provide services you ask us to provide.</li>
            <li>To maintain enquiry, booking, customer-service and business records.</li>
            <li>To operate, protect, troubleshoot and improve the website and its chat feature.</li>
            <li>To understand website usage and measure advertising performance through Google Analytics and Meta Pixel, but only if you give the relevant optional consent.</li>
            <li>To meet legal, regulatory, accounting and record-keeping obligations, and to establish or defend legal claims where necessary.</li>
          </ul>
        </Section>

        <Section title="4. Our lawful bases">
          <p>Under UK data protection law, we rely on the following lawful bases, depending on the purpose:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Steps before a contract and contract:</strong> handling a quote or service request you make and providing an agreed cleaning service.</li>
            <li><strong>Legitimate interests:</strong> responding to general enquiries, maintaining appropriate business records, operating and securing the website, reviewing chat interactions and preventing misuse. We consider the impact on individuals and use this basis only where their interests and rights do not override ours.</li>
            <li><strong>Legal obligation:</strong> keeping or disclosing records where the law requires us to do so.</li>
            <li><strong>Consent:</strong> using optional analytics and advertising technologies. You can withdraw or change this consent at any time through Cookie settings. Withdrawing consent does not affect processing that took place before withdrawal.</li>
          </ul>
        </Section>

        <Section title="5. Cookies, Google Analytics and Meta Pixel">
          <p>Our website uses essential browser storage to remember your cookie choice and support core website functions. Optional analytics and marketing technologies are kept off unless you choose to enable them.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Analytics:</strong> Google Analytics (measurement ID G-LQB16ZXJEC) helps us understand how visitors use the website. It is enabled only if you accept Analytics.</li>
            <li><strong>Marketing:</strong> Meta Pixel (ID 1801963148593783), connected to OANK Cleaning's Meta Business account, helps measure advertising and campaign performance. It is enabled only if you accept Marketing.</li>
          </ul>
          <p>Select <strong>Accept all</strong>, <strong>Reject optional cookies</strong> or <strong>Cookie settings</strong> in the website consent panel. After making a choice, use the Cookie settings control shown on the website to change it. Rejecting optional technologies does not prevent you from using the website.</p>
        </Section>

        <Section title="6. Who we share information with">
          <p>We do not sell your personal information. We may share information where necessary with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Website hosting, database and technical service providers that support the operation and security of our website.</li>
            <li>Email and communications providers used to deliver enquiry notifications and replies.</li>
            <li>Google, when you consent to Analytics, and Meta, when you consent to Marketing. These providers may process information under their own privacy terms as well as the arrangements applicable to our use of their services.</li>
            <li>Professional advisers, regulators, law-enforcement bodies or other authorities where disclosure is required by law or is necessary to protect rights and safety.</li>
          </ul>
          <p>Our website receptionist uses a locally configured information and response engine. The current website chat code does not send chat messages to an external generative-AI service.</p>
        </Section>

        <Section title="7. International transfers">
          <p>Some technology providers, including analytics and advertising providers, may process information in countries outside the United Kingdom. Where a restricted international transfer takes place, we will use a lawful transfer mechanism and appropriate safeguards required by UK data protection law. You can contact us at <a className="font-semibold text-[#0F382C] underline" href="mailto:info@oankcleaning.co.uk">info@oankcleaning.co.uk</a> for further information about applicable safeguards.</p>
        </Section>

        <Section title="8. How long we keep information">
          <p>We keep personal information only for as long as it is reasonably needed for the purpose for which it was collected, including handling your enquiry, providing services, maintaining appropriate business records, meeting legal or accounting requirements, resolving disputes and protecting our systems.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Enquiries and quote requests:</strong> kept while we deal with the request and any resulting customer relationship, then only for as long as needed for legitimate business, legal, accounting or claims purposes.</li>
            <li><strong>Unsuccessful enquiries and quote requests:</strong> proposed retention is 12 months after the last meaningful contact, unless a complaint, dispute or legal requirement means the record must be kept longer.</li>
            <li><strong>Confirmed customer and service records:</strong> retained for as long as needed to manage the customer relationship and meet applicable accounting, legal and claims requirements. We do not apply the unsuccessful-enquiry period to active customer records.</li>
            <li><strong>Chat records:</strong> proposed retention is 90 days after the last interaction, unless a complaint, security incident or legal requirement justifies longer retention.</li>
            <li><strong>Cookie preferences:</strong> kept in your browser storage until you change or clear the preference or clear your browser data.</li>
            <li><strong>Analytics and advertising information:</strong> subject to the retention settings and policies of Google and Meta, as well as the consent choices you make.</li>
          </ul>
          <p>These periods are our proposed operational schedule and will be applied once the retention and deletion process has been implemented and checked. Retention depends on the nature of the record, the service provided, applicable legal obligations and whether a dispute or claim remains possible. We review information and delete or anonymise it when it is no longer required.</p>
        </Section>

        <Section title="9. Keeping information secure">
          <p>We use technical and organisational measures intended to protect personal information against unauthorised access, loss, misuse or disclosure. Information sent between your browser and our website is intended to be protected using HTTPS where supported by the connection. No website or method of electronic storage can be guaranteed completely secure.</p>
        </Section>

        <Section title="10. Your data protection rights">
          <p>Depending on the circumstances and the lawful basis we use, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request access to the personal information we hold about you.</li>
            <li>Ask us to correct inaccurate or incomplete information.</li>
            <li>Ask us to erase information where the law gives you that right.</li>
            <li>Ask us to restrict certain processing.</li>
            <li>Object to processing based on legitimate interests, including the right to object to direct marketing where applicable.</li>
            <li>Request a copy of certain information in a portable format where the right applies.</li>
            <li>Withdraw consent where processing is based on consent.</li>
          </ul>
          <p>To exercise a right, email <a className="font-semibold text-[#0F382C] underline" href="mailto:info@oankcleaning.co.uk">info@oankcleaning.co.uk</a>. We may need to verify your identity before responding. We normally respond within one month, subject to any lawful extension.</p>
        </Section>

        <Section title="11. Complaints">
          <p>If you are concerned about how we use your information, please contact us first so we can try to resolve the issue. You also have the right to complain to the UK Information Commissioner's Office (ICO): <a className="font-semibold text-[#0F382C] underline" href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noreferrer">ico.org.uk/make-a-complaint</a>.</p>
        </Section>

        <Section title="12. Children">
          <p>Our website and cleaning services are intended for people arranging services or making business enquiries, not for children to use independently. Please do not knowingly submit a child's personal information through the website unless it is necessary for a legitimate enquiry and you are authorised to provide it.</p>
        </Section>

        <Section title="13. Third-party websites and services">
          <p>Our website may link to external services such as WhatsApp or social-media platforms. If you follow an external link, that provider's own privacy policy and terms will apply to your use of its service. We do not control how external websites collect or use information.</p>
        </Section>

        <Section title="14. Changes to this policy">
          <p>We may update this policy when our website, services or legal obligations change. The latest version will be published on this page with its updated date.</p>
        </Section>

        <div className="border-t border-slate-200 pt-6 text-sm text-slate-600">
          <p><strong>Contact our team:</strong> <a className="font-semibold text-[#0F382C] underline" href="mailto:info@oankcleaning.co.uk">info@oankcleaning.co.uk</a> · <a className="font-semibold text-[#0F382C] underline" href="tel:+447731956727">+44 77 3195 6727</a></p>
        </div>
      </div>
    </article>
  </main>
);
