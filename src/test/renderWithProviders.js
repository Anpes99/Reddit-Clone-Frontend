import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import appReducer from "../app/slices/appSlice";
import { makeStore } from "../app/store";

export const createTestStore = (appState = {}) => {
  const initialState = appReducer(undefined, { type: "@@INIT" });
  return makeStore({ app: { ...initialState, ...appState } });
};

// Renders the component with a real Redux store and a router. Pass `path`
// (e.g. "/r/:subredditName/submit") together with `route` to make route
// params available to the component.
export const renderWithProviders = (
  ui,
  { appState, store = createTestStore(appState), route = "/", path } = {},
) => {
  const element = path ? (
    <Routes>
      <Route path={path} element={ui} />
      <Route path="*" element={<p>navigated away</p>} />
    </Routes>
  ) : (
    ui
  );

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{element}</MemoryRouter>
      </Provider>,
    ),
  };
};
