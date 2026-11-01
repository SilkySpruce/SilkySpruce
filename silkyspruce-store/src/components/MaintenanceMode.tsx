export default function MaintenanceMode() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Under Maintenance</h1>
        <p className="text-sm text-gray-600">
          Silky Spruce is currently undergoing scheduled updates to improve your experience. We will be back online shortly. Thank you for your patience!
          Contact us at {" "}
          <a href="mailto:fountaincreations@gmail.com" className="underline hover:text-gray-900">fountaincreations@gmail.com</a>{" "}
          or call us at {" "}
          <a href="tel:+254757225004" className="underline hover:text-gray-900">+254 757 225 004</a>{" "} 
          to make an order or for any inquiries.
        </p>
      </div>
    </main>
  );
}