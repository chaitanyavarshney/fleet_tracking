// App.tsx
import Dashboard from './components/templates/Dashboard.jsx';
import { JSX } from 'react';
// import Dashboard2 from './components/templates/Dashboard2';
import { ThemeProvider } from './components/theme/ThemeProvider';

function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;