import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './modules/app/App';
import { InventoryPage } from './modules/inventory/InventoryPage';
import { UploadPage } from './modules/upload/UploadPage';
import { RecipesPage } from './modules/recipes/RecipesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <InventoryPage /> },
      { path: 'upload', element: <UploadPage /> },
      { path: 'recipes', element: <RecipesPage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

