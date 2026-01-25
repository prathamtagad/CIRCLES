import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Circles from './pages/Circles';
import CreateCircle from './pages/CreateCircle';
import Compose from './pages/Compose';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Transparency from './pages/Transparency';
import SearchPage from './pages/Search';
import Settings from './pages/Settings';
import Team from './pages/Team';
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
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/team" element={<Team />} />
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
