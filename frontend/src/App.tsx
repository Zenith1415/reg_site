import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import RegistrationForm from './components/RegistrationForm';
import SuccessPage from './components/SuccessPage';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import { TeamRegistrationData } from './types';
import { ThemeProvider } from './hooks/useTheme';

function App() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [teamData, setTeamData] = useState<TeamRegistrationData | null>(null);

  const handleStartRegistration = () => {
    setShowRegistration(true);
  };

  const handleRegistrationSuccess = (data: TeamRegistrationData) => {
    setTeamData(data);
    setRegistrationComplete(true);
  };

  const handleBackToHome = () => {
    setShowRegistration(false);
    setRegistrationComplete(false);
    setTeamData(null);
  };

  return (
    <ThemeProvider>
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg, #fff)',
            color: 'var(--toast-color, #334155)',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          },
        }}
      />
      
      <Header onLogoClick={handleBackToHome} />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {registrationComplete && teamData ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <SuccessPage teamData={teamData} onBackToHome={handleBackToHome} />
            </motion.div>
          ) : showRegistration ? (
            <motion.div
              key="registration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <RegistrationForm 
                onSuccess={handleRegistrationSuccess}
                onBack={handleBackToHome}
              />
            </motion.div>
          ) : (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSection onStartRegistration={handleStartRegistration} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <Footer />
      <ChatBot />
    </div>
    </ThemeProvider>
  );
}

export default App;
