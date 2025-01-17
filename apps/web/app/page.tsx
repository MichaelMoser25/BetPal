// app/page.tsx
import { Handshake, Trophy, Shield } from 'lucide-react';
import { ReactNode } from 'react';

// Define TypeScript interface for FeatureCard props
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

// Feature Card Component with type safety
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="p-3 bg-blue-50 rounded-full">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="px-4 py-24 md:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fade-in space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text mb-8">
              Friendly Bets, Better Friends
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Make friendly wagers with your friends, track your bets, and have fun
              without risking real money.
            </p>
            <button className="px-10 py-5 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl">
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Handshake className="w-12 h-12 text-blue-600" />}
              title="Social Betting"
              description="Create fun challenges with friends and track your bets in one place"
            />
            <FeatureCard
              icon={<Trophy className="w-12 h-12 text-blue-600" />}
              title="Challenge Friends"
              description="Compete in friendly wagers and track your winning streak"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-blue-600" />}
              title="Safe & Fun"
              description="Enjoy the thrill of betting without any financial risks"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
