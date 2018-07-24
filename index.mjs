import { setupStore, listenToStore } from './store.mjs';

// Set up intial state
const initialState = {
  name: 'lala',
  isIt: true,
  count: 123
};

// Setup store
const storeName = 'shed';
const store = setupStore(storeName, initialState);

// Setup store listeners
const listener = listenToStore(
  store,
  ['name', 'isIt'],
  (prop, newValue, oldValue) => console.log(1, { prop, newValue, oldValue })
);
const listener2 = listenToStore(
  store,
  ['name', 'isIt', 'count'],
  (prop, newValue, oldValue) => console.log(2, { prop, newValue, oldValue })
);

// Modify store state
store.state.name = 'testing!';
store.state.isIt = false;
store.state.count = 456;
store.state.foo = 'wtf?'; // Set non-existent property

// Log the state values
console.log(store.state.name);
console.log(store.state.isIt);
console.log(store.state.count);
console.log(store.state.foo);

// Stop store listener, should not call handler again
listener.stop();

// Modify store state again
store.state.name = 'testing again!';
store.state.isIt = true;
store.state.count = 789;
store.state.foo = 'uhuh!';

// Log the state values again
console.log(store.state.name);
console.log(store.state.isIt);
console.log(store.state.count);
console.log(store.state.foo);
