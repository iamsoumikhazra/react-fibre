import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  createContext,
  forwardRef
} from 'react';

const MyContext = createContext();

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const ChildComponent = forwardRef((props, ref) => {
  const [childValue, setChildValue] = useState(0);

  useImperativeHandle(ref, () => ({
    incrementChildValue: () => setChildValue(childValue + 1)
  }));

  return (
    <div>
      <p>Child Value: {childValue}</p>
    </div>
  );
});

const MyComponent = () => {
  const [stateValue, setStateValue] = useState(0);
  const [contextValue, setContextValue] = useState(null);
  const inputRef = useRef();
  const childRef = useRef();

  const memoizedValue = useMemo(() => stateValue * 2, [stateValue]);
  const memoizedCallback = useCallback(() => {
    setStateValue(prevState => prevState + 1);
  }, []);

  useEffect(() => {
    const context = useContext(MyContext);
    setContextValue(context);
  }, []);

  useEffect(() => {
    console.log('Component mounted or updated');
    return () => console.log('Component unmounted or about to update');
  }, [stateValue]);

  useLayoutEffect(() => {
    console.log('Layout effect');
  }, []);

  const customHookValue = useCustomHook(stateValue);

  return (
    <div>
      <h1>React Hooks Example</h1>
      <p>State Value: {stateValue}</p>
      <button onClick={memoizedCallback}>Increment State Value</button>

      <p>Context Value: {contextValue}</p>

      <p>Memoized Value: {memoizedValue}</p>

      <input ref={inputRef} placeholder="Input with useRef" />
      <button onClick={() => inputRef.current.focus()}>Focus Input</button>

      <div>
        <button onClick={() => dispatch({ type: 'increment' })}>Increment Reducer Value</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>Decrement Reducer Value</button>
        <p>Reducer Count: {state.count}</p>
      </div>

      <ChildComponent ref={childRef} />
      <button onClick={() => childRef.current.incrementChildValue()}>Increment Child Value</button>
    </div>
  );
};

const App = () => {
  return (
    <MyContext.Provider value="Hello from context!">
      <MyComponent />
    </MyContext.Provider>
  );
};

export default App;
