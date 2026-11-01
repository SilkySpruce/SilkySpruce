export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#d1d5db] px-6 py-20 flex justify-center">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        <div className="border-b border-[#2A2A2A] pb-6">
          <span className="text-xs uppercase tracking-widest text-[#788E7D] font-semibold">Legal Documentation</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">Terms of Service</h1>
          <p className="text-xs text-[#6b7280] mt-2">Last updated: November 2026</p>
        </div>

        <section className="flex flex-col gap-4 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-4">1. Agreement to Terms</h2>
          <p>
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&ldquo;you&rdquo;) and Silky Spruce (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), concerning your access to and use of the silkyspruce.com website as well as any related media form, media channel, mobile website, or application related thereto.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">2. Products and Purchases</h2>
          <p>
            All products are subject to availability. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change without notice. We reserve the right to limit the quantities of any products or services that we offer.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">3. User Accounts</h2>
          <p>
            If you create an account with us, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">4. Loyalty Program & Points</h2>
          <p>
            Silky Spruce offers loyalty points on qualifying purchases. Points have no cash value, cannot be transferred, and may be modified or terminated in accordance with our store promotional guidelines.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">5. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with applicable local and international commercial laws, and you irrevocably submit to the exclusive jurisdiction of the courts in the operating region.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">6. Contact Information</h2>
          <p>
            Questions about the Terms of Service should be sent to us at fountaincreations@gmail.com.
          </p>
        </section>
      </div>
    </main>
  );
}