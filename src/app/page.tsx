import { Shield } from 'lucide-react';
import { EmailScannerForm } from '@/components/email-scanner-form';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex-1">
        <div className="container mx-auto flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-12 md:px-6">
          <div className="w-full max-w-2xl">
            <header className="mb-10 flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                <Shield className="h-10 w-10" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Mail Guardian
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                Enter your Google email to scan for security risks and receive
                personalized, actionable tips to enhance your account's safety.
              </p>
            </header>

            <EmailScannerForm />
          </div>
        </div>
      </main>
      <footer className="flex h-20 items-center justify-center border-t">
        <p className="text-center text-sm text-muted-foreground">
          Powered by GenAI. Security scans are for informational purposes only.
        </p>
      </footer>
    </div>
  );
}
