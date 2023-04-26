import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import AccessTokenRefresh from "components/containers/access-token-refresh";
import MainScreen from "components/screens/main-screen";
import ConfirmHandler from "components/contexts/confirm-handler";
import ErrorHandler from "components/contexts/error-handler";
import ApiProvider from "./providers/api-provider";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectLocale, setLocale } from "features/locale-slice";

const apiProviders: React.FC<{}>[] = [];

/**
 * Application component
 */
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { locale } = useAppSelector(selectLocale);

  React.useLayoutEffect(() => {
    dispatch(setLocale(locale));
  }, []);

  return (
    <ErrorHandler>
      <ApiProvider providers={ apiProviders }>
        <ConfirmHandler>
          {/* <AccessTokenRefresh> */}
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={ <MainScreen/> }
              />
            </Routes>
          </BrowserRouter>
          {/* </AccessTokenRefresh> */}
        </ConfirmHandler>
      </ApiProvider>
    </ErrorHandler>
  );
};

export default App;