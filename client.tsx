import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/views/App';

const root = document.getElementById('root');
if (root == null) {
  throw new Error('a div with root id must be present in the dom.');
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
