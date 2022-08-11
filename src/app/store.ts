import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { events } from './events';

export const store = configureStore({
  reducer: {
    events: events.reducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
