import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";

const Bar = (props, ref) => {
  // Initialize counter from the initial state
  // stored by your parent.
  // Of course, props.initState could store
  // anything you want- not just a single value.
  const [counter, setCounter] = useState(props.initState);
  // Flag to determine if we persist our state
  const [persist, setPersist] = useState(true);
  // Flag to determine if we allow to be hidden
  const [allowHide, setAllowHide] = useState(true);

  // log mount/dismount events
  useEffect(() => {
    console.log(`Mounted Bar ${props.id}`);
    return () => console.log(`Dismounted Bar ${props.id}`);
  }, []);

  // Register a "call-in" ref allowing the parent
  // to ask you if you can be hidden
  useImperativeHandle(ref, () => ({
    canHide: () => {
      console.log(`${allowHide ? "Alllowing" : "Preventing"} hide ${props.id}`);
      // We're about to be hidden- which will cause dismount
      // if we want our private state persistented, now is a good
      // time to do that.
      if (allowHide && persist) {
        console.log(`Persisting state ${props.id}`);
        props.saveState(counter);
      }
      return allowHide;
    }
  }));
  return (
    <div
      style={{
        border: "1px solid black",
        padding: 5,
        margin: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      }}
    >
      <h1
        style={{
          width: 50,
          textAlign: "center",
          margin: 0,
          padding: 5
        }}
      >
        {props.id}
      </h1>
      <div>
        <div>{props.children}</div>
        <div style={{ backgroundColor: "#F5F5F5", padding: 5 }}>
          <div>
            initState: {props.initState} counter: {counter} Persist:{" "}
            {persist ? "Yes" : "No"} Allow Hide: {allowHide ? "Yes" : "No"}
          </div>
          <button onClick={() => setCounter(counter + 1)}>Increment</button>
          <button onClick={() => setPersist(!persist)}>Persist</button>
          <button onClick={() => setAllowHide(!allowHide)}>Allow Hide</button>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(Bar);
