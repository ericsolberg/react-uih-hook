import React from "react";

import Foo from "./Foo";
import Bar from "./Bar";

const App = props => {
  return (
    <div style={{ width: 425, margin: "auto", padding: 20 }}>
      <Foo>
        <Bar id="0">This is Bar 0</Bar>
        <Bar id="1">This is Bar 1</Bar>
        <Bar id="2">This is Bar 2</Bar>
      </Foo>
    </div>
  );
};

export default App;
