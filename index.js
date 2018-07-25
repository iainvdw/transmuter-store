import { Transmuter, listen } from './transmuter.js';

// Set up intial state
const initialState = {
  name: 'lala',
  isIt: true,
  count: 123,
};

// Setup store
const storeName = 'shed';
const store = new Transmuter(storeName, initialState);

// Logger factory
const logger = name => (prop, value, oldValue) => {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<p><strong>Logging ${name}</strong>
    <br>
    Prop changed: ${prop}. Value: ${value}. Old value: ${oldValue}</p>`,
  );
};

// Listen to single prop
const listener1 = listen(store, 'name', logger('single prop'));

// Listen to multiple props
const listener2 = listen(store, ['name', 'count', 'isIt'], logger('multiple props'));

// Listen to props that don't exist yet
const listener3 = listen(store, 'notYet', logger('non-existing prop'));

// Add props to a listener
listener1.addProp('count');

// Remove prop from a listener
listener2.removeProp('isIt');

// Modify store state
store.state.name = 'testing!';
store.state.count = 456;
store.state.notYet = 'yes!'; // Set non-existent property

// Stop listener
listener1.stop();

// Modify store state again
store.state.name = 'testing again!';
store.state.notYet = 'uhuh!';

// Start listener again
listener1.start();

// More modifications!
store.state.name = 'and again!';
