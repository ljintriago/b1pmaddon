import { ThemeProvider } from '@ui5/webcomponents-react';
import React from 'react';
import { createRoot } from 'react-dom/client';
//import App from './App';
import './assets/index.css';
import LogInForm  from "./features/authorization/components/LogInForm";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ThemeProvider>
    <LogInForm />
  </ThemeProvider>
);


