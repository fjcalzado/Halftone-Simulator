 # D3 & React
D3 handles the DOM natively while React do it virtually. A React component does not expect anybody mutating the DOM outside the render method, which will be the case with a D3 embedded into React. Thus, React will ignore any D3 changes to DOM on each re-render and will follow what the render methods says. We wont see any D3 work in our chart embedded into React. There are several approach to overcome this issue:
 
  - Let React take care of DOM manipulation while D3 is used only for maths. This must be crafted carefully and requires a bit of work.
      - PROS: React virtual DOM performance.
      - CONS: We loose some D3 features, mainly animations.
      - Usage: Only for complex charts where we can benefit from React DOM performance with no animations involved.
 
   - Faux React DOM: a third party library to create a fake DOM to be manipulated by D3 and then transformed to a React render phase.
     - PROS: Cool approach, D3 native code, transparent.
     - CONS: Not mature enough (as of April 2017).
     - Usage: I did not considered this solution at the begining, but ended up implementing it at the end to check if we had any gain.
 
   - Keep React out of the game when necessary. Lets just use React to render the component root element where our chart will be attached to while D3 will handle the rest of the DOM from that point downwards.
     - PROS: Very easy approach, few lines of code. Native D3 code.
     - CONS: We have left React out of game from the component root element which means that no React component can be attached as children in a native way. We can manually control a children React component render process though.
     - Usage: as it retains full D3 functionality and it is very easy to implement,  have considered this solution.


# Implementations

I ended up implementing approaches 2 and 3.

### Faux React DOM. Implemented in `SimulatorFauxDOMComponent`.
### React out of the render game. Implemented in `SimulatorNativeDOMComponent`.

- In general terms, I don't see any performance benefit in using a fake DOM for D3 to play with it. The nature of the problem is the same regardless we isolate D3 behind a virtual playground: at the end, React receives a huge set of new nodes to be appended, and this reconciliation task is really the culprit of the performance hit. Actually I see a downgrade in performance when using the faux node because of the fake resulting nodes being converted into React components.
- When applying update operations, for example, layer sorting where no new nodes are added or deleted, NativeDOM behaves much more stable and efficient as D3 is aware of the real DOM and can make use of enter/exit/update scenarios. However, in faux DOM, D3 receives a blank new fake node to play with it so each tiny modification will force a whole new rendering from scratch.
- Quick tests shows that NativeDOM is faster when number of nodes increase to high
numbers. For example 300k. In that case, NativeDOM is around 3-4x faster than FauxDOM. So there is no gain in a fake DOM for D3 when thousands of nodes are involved as the copies from fake to real DOM and reconciliations represent a serious penalty.


# Unexplored implementations.

- I have not discarded FauxDOM as it is a good step towards server side rendering. Ideally, we could implement a web worker that renders into a fake node.     
  - If results in a low number of nodes then we could pass the SVG nodes to the main thread to reconciliate them into our real DOM.
  - If result is a high number of nodes that will trash our React performance, just convert it to an image preview and send it back to our real DOM. 