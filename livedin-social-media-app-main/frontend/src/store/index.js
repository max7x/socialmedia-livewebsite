import rootReducer, { INITIAL_STATE } from "../reducers";
import { configureStore } from "@reduxjs/toolkit";

const SESSION_KEY = "session_state";

const preloadState = () => {
  if (sessionStorage.getItem(SESSION_KEY) === null) {
    return INITIAL_STATE;
  }
  return JSON.parse(sessionStorage.getItem(SESSION_KEY));
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloadState(),
});

const unsubscribe = store.subscribe(() => {
  const stateJson = JSON.stringify(store.getState());
  sessionStorage.setItem(SESSION_KEY, stateJson);
});

export default store;
