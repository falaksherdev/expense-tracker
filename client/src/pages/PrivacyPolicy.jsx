import { Link } from "react-router-dom";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingFooter from "../components/landing/LandingFooter";
import { webName, LAST_UPDATED, CONTACT_EMAIL } from "../constants/variables";

function Section({ title, children }) {
  return (
    <section className="mb-9 sm:mb-11">
      <h2 className="font-serif text-lg sm:text-xl text-text mb-3">{title}</h2>
      <div className="text-dim text-sm leading-relaxed space-y-3 max-w-prose">
        {children}
      </div>
    </section>
  );
}

function Bullets({ items }) {
  return (
    <ul className="list-disc pl-5 marker:text-gold space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-dim ">
          {item}
        </li>
      ))}
    </ul>
  );
}

function Em({ children }) {
  return <strong className="text-text font-medium">{children}</strong>;
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-ink">
      <LandingNavbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link
          to="/"
          className="text-dim text-xs hover:text-text transition-colors"
        >
          Back to home
        </Link>

        <h1 className="font-serif text-3xl sm:text-4xl text-text font-semibold mt-6 mb-2">
          Privacy policy
        </h1>
        <p className="text-dim text-sm mb-6">Last updated {LAST_UPDATED}</p>

        <p className="text-dim text-sm leading-relaxed max-w-prose mb-8">
          This policy explains what {webName} stores about you, why it stores
          it, and how you can remove it. We keep it short on purpose.
        </p>

        <div className="border-l-2 border-gold pl-4 sm:pl-5 mb-10 sm:mb-12 max-w-prose">
          <p className="text-text text-sm font-medium mb-2">In short</p>
          <Bullets
            items={[
              "We store only what the app needs: your account and the entries you add.",
              "Your password is hashed. Nobody, including us, can read it.",
              "We don't sell your data, show ads, or run third-party analytics.",
              "You can delete your account and all of your data from Settings at any time.",
            ]}
          />
        </div>

        <Section title="What we store">
          <Bullets
            items={[
              <>
                <Em>Account details.</Em> Your name, your email address, whether
                your email is verified, and your password. The password is
                stored only as a bcrypt hash.
              </>,
              <>
                <Em>Entries you add.</Em> For each transaction: its type,
                category, amount, date, an optional description, and, for
                lending, the name of the person.
              </>,
              <>
                <Em>Categories and settings.</Em> Custom categories you create,
                your currency, and which features (committee, lending,
                investments) you turned on.
              </>,
              <>
                <Em>Feedback.</Em> The message you send, along with the email
                address of your account.
              </>,
            ]}
          />
          <p>
            We don't run analytics or advertising tools. Our hosting providers
            keep standard request logs, and the server briefly uses your IP
            address to limit repeated login attempts.
          </p>
        </Section>

        <Section title="How we use it">
          <Bullets
            items={[
              "To run the app: your dashboard, charts, filters and settings.",
              "To send the emails you trigger, such as email verification and password reset.",
              "To read and respond to the feedback you send.",
              "To protect the service from abuse and repeated login attempts.",
            ]}
          />
          <p>We don't sell your data, and we don't use it to show ads.</p>
        </Section>

        <Section title="Cookies and local storage">
          <p>
            {webName} sets one cookie, named <Em>token</Em>. It keeps you logged
            in for up to 7 days. It is marked httpOnly and Secure, so scripts on
            the page can't read it, and it only travels over HTTPS.
          </p>
          <p>
            Your browser's local storage also holds a copy of your name, email
            and preferences so the app loads faster. Logging out clears it.
          </p>
          <p>We don't use advertising or tracking cookies.</p>
        </Section>

        <Section title="Who handles your data">
          <p>
            We use these services to run {webName}. Each one processes only what
            it needs to do its job.
          </p>
          <Bullets
            items={[
              <>
                <Em>Netlify</Em> hosts the website.
              </>,
              <>
                <Em>Render</Em> runs the server.
              </>,
              <>
                <Em>MongoDB Atlas</Em> stores the database.
              </>,
              <>
                <Em>Brevo</Em> delivers our emails, so it receives your name and
                email address when we send you a message.
              </>,
            ]}
          />
          <p>
            We don't sell or rent your data. We may disclose it if the law
            requires us to.
          </p>
        </Section>

        <Section title="How we protect it">
          <p>
            Connections use HTTPS. MongoDB Atlas encrypts the database at rest.
            Passwords, and the tokens in reset and verification links, are
            stored as hashes. The login cookie is httpOnly, and the server
            applies rate limiting and input sanitising.
          </p>
          <p>
            No system is perfectly secure, and your entries are not end-to-end
            encrypted. That means the person running {webName} can technically
            read stored entries in the database. We only look at them to fix a
            problem, answer a request from you, or comply with the law.
          </p>
        </Section>

        <Section title="How long we keep it, and how to delete it">
          <p>
            We keep your data for as long as your account exists. To remove it,
            open Settings, go to Danger zone, and choose Delete my account. This
            permanently deletes your account, transactions, custom categories
            and feedback messages. It can't be undone.
          </p>
          <p>
            Copies may remain for a short time in our hosting providers' backups
            and logs, and Brevo may keep delivery records of emails sent to you.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can view and edit your transactions, categories and preferences
            in the app, and change your password in Settings. To ask for a copy
            of your data, or to correct something you can't change yourself,
            email us.
          </p>
        </Section>

        <Section title="Children">
          <p>
            {webName} isn't meant for children under 13, and we don't knowingly
            collect their data. If you think a child has created an account,
            email us and we'll delete it.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we change this policy, we'll update the date at the top. For
            significant changes we'll also tell you in the app or by email.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about your data? Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-gold hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </main>

      <LandingFooter />
    </div>
  );
}
