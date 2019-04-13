import React, { useState, useRef, useEffect } from "react";

const Foo = props => {
  // We're dynamically creating state and refs for each child component.
  // This will work because the count and order will be
  // consistent across invocations.

  // Array of [state,setState] pairs,one for each child
  // populated below
  const showFlags = [];

  // Array of refs for communicating with children
  // populated below
  const refs = [];

  // Array of child private state containers
  // (also populate the showFlags and refs arrays)
  const states = props.children.map(() => {
    showFlags.push(useState(true));
    refs.push(useRef());
    return useState(0);
  });

  // Log mount & dismount events
  useEffect(() => {
    console.log(`Mounted Foo`);
    return () => console.log(`Dismounted Foo`);
  }, []);

  // Inject props into the children. I'm ignoring
  // the case here where children already have a key prop
  const children = props.children.map((child, key) => {
    const [initState, saveState] = states[key];
    const ref = refs[key];
    return React.cloneElement(child, { initState, saveState, ref, key });
  });

  // Toggle the display of the child component. Hiding it
  // will unmount it. We're accessing the child through
  // the ref, to allow it to prevent being hidden
  const toggle = key => {
    const [show, setShow] = showFlags[key];
    const ref = refs[key];

    // Toggle the display of the child if:
    if (
      !show || // a. it is currently hidden, or
      !ref.current || // b. the child hasn't set a canHide ref, or
      !ref.current.canHide ||
      ref.current.canHide() // c. child.canHide() returns true
    ) {
      setShow(!show);
    }
  };

  return (
    <>
      This is Foo.
      <br />
      {// Toggle button for each child
      children.map((child, key) => (
        <button onClick={() => toggle(key)} key={`toggle${key}`}>
          {`${showFlags[key][0] ? "Hide" : "Show"} ${key}`}
        </button>
      ))}
      {// Only render children where showFlag = true
      children.filter((child, key) => showFlags[key][0])}
    </>
  );
};

export default Foo;
