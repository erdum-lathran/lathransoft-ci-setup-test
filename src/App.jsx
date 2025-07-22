import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataHandler, Util } from './utils';
import { setIsLoading } from './reducer/general';
import { GlobalLoader } from './components';
import NavigationScreens from './routes';
import configureAppStore from './store';
import './css/App.css';

export default function App() {
  const [storeState, setStoreState] = useState(null);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000,
      },
    },
  });

  useEffect(() => {
    configureAppStore(store => {
      DataHandler.setStore(store);
      DataHandler.dispatchAction(setIsLoading(false));
      setStoreState(store);
    });
  }, []);

  if (storeState === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={storeState}>
        <RouterProvider router={NavigationScreens} />
        <ToastContainer
          className={'fs-14'}
          limit={3}
          stacked={true}
          newestOnTop={true}
        />
        <GlobalLoader />
      </Provider>
    </QueryClientProvider>
  );
}
