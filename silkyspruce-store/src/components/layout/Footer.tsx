// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full bg-[#111111] py-24 flex flex-col items-center justify-center border-t border-[#2A2A2A]">
      
      <div className="max-w-2xl text-center px-4">
        <h4 className="text-[10px] tracking-widest uppercase text-gray-400 mb-4 font-semibold">
          Join the Ritual
        </h4>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Silky Spruce Knowledge & Exclusive Offers
        </h2>
        
        <p className="text-gray-300 mb-10 text-sm md:text-base">
          Get how-to guides, ingredient spotlights, and early access to new collections — straight to your inbox.
        </p>

        {/* Subscription Form */}
        <form className="flex flex-col sm:flex-row items-center justify-center w-full max-w-lg mx-auto border-b border-[#2A2A2A] pb-2 mb-4">
          <input 
            type="email" 
            placeholder="your@email.com" 
            className="bg-transparent text-white w-full px-4 py-3 outline-none placeholder-gray-500"
            required
          />
          <button 
            type="submit" 
            className="bg-[#788E7D] hover:bg-[#687C6D] text-white px-8 py-3 font-semibold text-sm transition-colors whitespace-nowrap mt-4 sm:mt-0 w-full sm:w-auto"
          >
            SUBSCRIBE
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </div>

    </footer>
  );
}