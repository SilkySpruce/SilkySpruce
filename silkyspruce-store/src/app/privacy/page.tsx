export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#d1d5db] px-6 py-20 flex justify-center">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        <div className="border-b border-[#2A2A2A] pb-6">
          <span className="text-xs uppercase tracking-widest text-[#788E7D] font-semibold">Legal Documentation</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">Privacy Policy</h1>
          <p className="text-xs text-[#6b7280] mt-2">Last updated: November 2026</p>
        </div>

        <section className="flex flex-col gap-4 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-4">1. Introduction</h2>
          <p>
            Welcome to Silky Spruce (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (silkyspruce.com) and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">2. Data We Collect About You</h2>
          <p>
            Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li><strong>Identity Data:</strong> Includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> Includes billing address, delivery address, email address, and telephone numbers.</li>
            <li><strong>Financial Data:</strong> Includes payment card details or mobile money transaction tokens processed securely via our payment partners (e.g., Paystack).</li>
            <li><strong>Transaction Data:</strong> Includes details about payments to and from you and other details of products you have purchased from us.</li>
            <li><strong>Technical Data:</strong> Includes internet protocol (browser type and version, time zone setting, browser plug-in types and versions, operating system and platform).</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-4">3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., processing and delivering your skincare orders).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-4">4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">5. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at fountaincreations@gmail.com.
          </p>
        </section>
      </div>
    </main>
  );
}