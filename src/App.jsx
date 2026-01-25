import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Circles from './pages/Circles';
import CreateCircle from './pages/CreateCircle';
import Compose from './pages/Compose';
import Privacy from './pages/Privacy';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';

function AppRoutes() {
  const { currentUser, authLoading, isOnboarded } = useApp();

  // Show loading while checking auth state
  if (authLoading) {
    return <LoadingScreen />;
  }

  // Not logged in - show login
  if (!currentUser) {
    return <Login />;
  }

  // Logged in but not onboarded - show onboarding
  if (!isOnboarded) {
    return <Onboarding />;
  }

  // Fully authenticated and onboarded
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/circles" element={<Circles />} />
          <Route path="/circles/create" element={<CreateCircle />} />
          <Route path="/compose" element={<Compose />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
