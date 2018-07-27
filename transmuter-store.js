/**
 * Store container object
 *
 * @author Iain van der Wiel
 * @param {String} name Name of store
 * @param {Object} target Target object containing the state to watch
 * @param {Element} context Element or object to dispatch events on
 * @returns {TransmuterStore} Store object containing name, context and state Proxy
 */
class TransmuterStore {
  constructor(name, target, context = window) {
    this.name = name;
    this.context = context;
    this.state = new Proxy(target, TransmuterStore.createHandler(this));
  }
}

TransmuterStore.createHandler = store => ['set', 'deleteProperty', 'apply', 'defineProperty'].reduce((handler, method) => {
  handler[method] = (state, prop, value) => {
    const success = Reflect[method](state, prop, value);

    if (success) {
      // Setup custom event
      const event = new CustomEvent(`${store.name}:${prop}`, {
        detail: {
          prop,
          value,
          oldValue: state[prop],
          state: store.state,
        },
      });

        // Dispatch name:prop event on context
      store.context.dispatchEvent(event);
    }

    return success;
  };

  return handler;
}, {});

/**
 * Store listener
 * @param {TransmuterStore} store Store object to listen to
 * @param {String|Array} props Prop(s) of the store to watch
 * @param {Function} handler Handler function that's called when a property changes
 */
const listen = ({ name, context }, props, handler) => {
  // Concat props in new array. This allows strings and arrays of props to listen to.
  let propsToListen = [].concat(props);

  // Listener callback that destructures values from event.detail
  const listener = ({
    detail: {
      prop, value, oldValue, state,
    },
  }) => handler(prop, value, oldValue, state);

  // Listen to single prop
  const listenToProp = prop => context.addEventListener(`${name}:${prop}`, listener);

  // Stop listening to single prop
  const stopListeningToProp = prop => context.removeEventListener(`${name}:${prop}`, listener);

  // Apply listener to watched props
  const start = () => propsToListen.forEach(listenToProp);

  // Remove listener to watched props
  const stop = () => propsToListen.forEach(stopListeningToProp);

  // Add prop to listen to
  const addProp = (propToAdd) => {
    listenToProp(propToAdd);
    propsToListen = [...propsToListen, propToAdd];
  };

  // Remove listened prop
  const removeProp = (propToRemove) => {
    stopListeningToProp(propToRemove);
    propsToListen = propsToListen.filter(prop => prop !== propToRemove);
  };

  // Kickstart the listening
  start();

  // Return listener API
  return {
    start,
    stop,
    addProp,
    removeProp,
  };
};

export { TransmuterStore, listen };
