// Store factory, returns store object
const setupStore = (name, target, context = window) => ({
  name,
  context,
  state: new Proxy(target, {
    // Proxy trap when setting property in store
    set: (target, prop, newValue) => {
      // Setup custom event
      const event = new CustomEvent(`${name}:${prop}`, {
        detail: {
          prop,
          newValue,
          oldValue: target[prop]
        }
      });

      // Set value like normal
      target[prop] = newValue;

      // Dispatch name:prop event on context
      context.dispatchEvent(event);

      // Assignment of property in store succeeded, required per strict mode
      return true;
    }
  })
});

// Store listener factory
const listenToStore = (store, props, handler) => {
  // Concat props in new array. This allows strings and arrays of props to listen to.
  const propsToListen = [].concat(props);

  // Listener callback that destructures values from event.detail
  const listener = ({ detail: { prop, newValue, oldValue } }) =>
    handler(prop, newValue, oldValue);

  // Apply listener to watched props
  propsToListen.forEach(prop => {
    store.context.addEventListener(`${store.name}:${prop}`, listener);
  });

  // Return stop() method to stop listening
  return {
    stop: () =>
      propsToListen.forEach(prop =>
        store.context.removeEventListener(`${store.name}:${prop}`, listener)
      )
  };
};

export { setupStore, listenToStore };
