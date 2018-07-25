# TransmuterStore

A store container that reacts to _transmutations_ of properties of the store itself by emitting events.

## Getting started

First, install `transmuter-store` via:

**NPM**

`npm install transmuter-store`

**Yarn**

`yarn add transmuter-store`

## Basic concept

A TransmuterStore consists of 3 things:

- The name of the store;
- The store itself, which could be an object with pre-existing properties as an initial state;
- The context on which to fire the events on.

By default, a TransmuterStore will fire events on a context element when a property of the store changes. This event is namespaced with the name of the store and the name of the property that changed. For example: if the store is named `'shed'` and the property that changed is called `items`, then the event fired will be `shed:items`.

How does this work, you ask? The magic of `transmuter-store` lies in wrapping the store object in a `Proxy` with a `set` handler. The `set` handler is called each time a property of the store is being added or changed. This handler then fires an event on the context element, specifying which property has changed.

`transmuter-store` provides you with 2 things: the store container that fires the events, and a listener helper function (`listen`) that eases the setting up of store listeners.

## How to use

In its simplest form, you can use `transmuter-store` like this:

```js
import { TransmuterStore, listen } from 'transmuter-store';

// Set up an initial state for the store
const initialState = {
  items: [1, 2, 3],
  isMenuOpen: false
};

// Create a new store and apply the initial state object. Returns a store with name, context and state properties.
const store = new TransmuterStore('app', initialState);

console.log(store.name); // 'app'
console.log(store.context); // window
console.log(store.state); // State object Proxy, this is where the ✨ magic ✨ happens

// Listener function. This is called when a property changes with the name of the prop, the new value and the old value.
function logger(prop, value, oldValue) {
  console.log('property:', prop);
  console.log('new value:', value);
  console.log('old value:', oldValue);
}

// Add a store listener that listens to both the items and isMenuOpen properties and calls the above logger() function`
const listener = listen(store, ['items', 'isMenuOpen'], logger);

// Now when you change a property of the store, the change is logged using the listener function.
store.state.isMenuOpen = true;

// Add new items to array.
// ℹ️ See 'Limitations' below
store.state.items = [...store.state.items, 4];
```

## Limitations

As a `set` handler of a `Proxy` only watches direct properties of the object it wraps, changes to nested objects or items in arrays won't propagate to the `set` handler. Use array/object destructuring for this and assigning the new result directly to the store, or use something like [Immutable.js](https://github.com/facebook/immutable-js/).

**Plain JS, does _not_ trigger event**:

```js
// This does *not* trigger a TransmuterStore event unfortunately
store.state.items.push(4); // ❌
```

**Plain JS, does trigger event**:

```js
// This *does* trigger a TransmuterStore event
store.state.items = [...store.state.items, 4]; // ✅
```

**Using Immutable.js**

```js
import { TransmuterStore } from 'transmuter-store';
import { List } from 'immutable';

// Set up state
const initialState = {
  items: List([1, 2, 3]) // Use an Immutable List
};

// Set up store
const store = new TransmuterStore('store', initialState);

// Returns a new List containing the added item and assign it to the store.
store.state.items = store.state.items.push(4); // ✅
```

## Thanks

[Heydon Pickering](http://www.heydonworks.com/), for inspiring me with [Mutilator.js](https://gist.github.com/Heydon/9de1a8b55dd1448281fad013503a5b7a) to research and develop this library.

## License

TransmuterStore is [MIT-licensed](./LICENSE).
