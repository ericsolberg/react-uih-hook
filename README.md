### Test of React useImperativeHandle hook

I wanted to play with the various hooks, and useImperativeHandle seemed the most unclear to me- both from the official docs and from the examples one can find floating around.

Knowing how to make it work is one thing, but understanding why it's there is really what I was after.

My take on it is: useImperativeHandle is a generalization of React references. References are designed to be used in a JSX context, with special ref takes placed in the JSX, which are connected to the injected ref instance. JSX just translates to code, so this could obviously be done manually- potentially allowing refs to be used in other scenarios (I haven't tried, so I don't know for sure).

But why would you want to generalize a ref? The common example used for references, is in order for a parent to set the focus on a field in it's child. The ref then connects directly to the underlying DOM element, and, voila, you can set focus to the right field when you need to. 

In React, data and props flow down the DOM. Since callbacks are passed as data, then the program flow of callbacks goes back up the tree. References are the one way, that I know of at least (and I'm sure there's much I don't know), to call down into the tree.

So when might you want to call down into a tree? An example I can think of, is when you have a component that will mount/dismount it's children. This is, of course, done all the time in React. Routers do this. Page animators / sliders do it. Lots of components mount/dismount their children. But what if the child is doing something important, and doesn't want to be unmounted? Or what if you have some other handshake that you want to implement with your child components - something that isn't best done through passing properties?

This seems to be what useImperativeHandle is for. Perhaps this is considered bad form, or an anti-pattern in React - so just because this can be done, doesn't mean that it should. And to be sure, it could be accomplished through state, props and callbacks. It is just a little cleaner, this way IMO.

Here's what I've implemented. Let's say I've create a component Foo. Inside of Foo, I have an arbitrary collection/depth of child components. In my case, of course, I have Bar's:

```javascript
const App = props => {
  return (
    <Foo>
      <Bar>This is Bar 0</Bar>
      <Bar>This is Bar 1</Bar>
      <Bar>This is Bar 2</Bar>
    </Foo>
  );
};
```
Foo wants to be able to control the mount/dismount of it's children. But these children are arbitray components- they should work without knowing anything about Foo. But mounting/dismounting components can be a problem, if the component is managing local state and doesn't expected to be dismounted when the app is running.

So I wanted to do two things:

1) For Foo to provide an interface to it's child components that can be used to persist child state. The child could use this state for every state update - but this would result in unecessary re-rendering. Instead, it just initializes it's local state from this state, persists it back to the parent state-stash prior to being dismounted. This is already pretty useful and searching StackOverflow shows lots of people have struggle with re-initializing state for various reasons. But ...
2) What if the child component is doing something important and doesn't want to be dismounted by the parent? In this case, the parent can call the child and ask "Can I dismount you now?", giving the component the option to veto the dismount.

Again, I don't know if this is good React practice. And I do know this can also be accomlished with state and callbacks. But using useImperativeHandle seems to be a cleaner way for a child to say to the parent "Heres some functions you can call to notify me of ...".

I guess the risk, is this can lead to developers introducing all sorts of different component-specific lifecyle 'call-ins' - and these could easily conflict with React. But it's useful to understand the paradigm. After all, if setting inputFocus is a legitimate reason for a parent to call down into it's children, there are bound to be other valid scenarios.

In my test scenario, The Foo class has 3 buttons to toggle the display of it's children. But before hiding them, Foo will call down into Bar to ask the component if it can be hidden. Foo also passes initialState into the components - by injecting a state object and a setter for that state. Foo then passes a reference through the normal forwardRef HOC.

If the child component knows nothing of the injected props, it will just work like a normal component. But - it will get reinitialized whenever Foo hides/unhides it. By accessing the ref, with useImperativeHandle and providing a canHide "call-in", it can coordinate with the parent. It can then use the injected initState and saveState methods to save it's state across mount/dismount.

This implementation of Bar has two flags- perists (to decide whether to save state before dismountig) and allowHide, to determine whether it can be dismounted. It then has toggle buttons to play with these. The actual state of Bar is just a counter, which you can also increment.

It's pretty much a bare-bones use case for a real-world use of useImperativeHandle.
