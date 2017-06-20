# Halftone Simulator

## Visit live demo

[Click here to go live](https://fjcalzado.github.io/Halftone-Simulator/)

## What is halftone?

Halftone is a reprographic technique that simulates continuous tone imagery through the use of dots, varying its properties like size, shape or pattern, and thus generating a gradient-like effect.
Where continuous tone imagery contains an infinite range of colors or greys, the halftone process reduces visual reproductions to an image that is printed with only one color of ink. This reproduction relies on a basic optical illusion: the tiny halftone dots are blended into smooth tones by the human eye.
CMYK printing is the result of combining four halftone images, one per each ink, with dot grid patterns usually rotated from each other.

## Motivation

This project was originally developed as a testbed to find out SVG limits in terms of performance and responsiveness when heavily populating a DOM with thousands of nodes. Haltone technique applied to images served perfectly for this purpose, as it potentially generates thousands of dots in one shot. D3.js seemed like the way to go in order to render high ammounts of SVG elements directly binded to data.
Finally, the idea got momentum and growed till it became a full simulation web app made with React.

#### Disclaimer
You may experience sluggishness or bad performance under certain situations where resources are limited (mobile devices) or a large ammount of dots are involved in the simulation. This is intended, let me remember the main goal explained in [Motivation](#motivation) section: test how a large ammount of SVG elements embedded in the document impacts application responsiveness.
I have plans to research and evaluate strategies to overcome these issues. Please, read on [What is next](#what-is-next) section.

## What is next
- Apply Redux to centralize the state.
- Evaluate rendering strategies to provide different **Simulation Modes** that pursuit a trade off between performance and precision. For example:
  - Precision Mode: Render SVG elements directly to DOM. __PROS__: Vector graphics as a result. __CONS__: Hit in performance for certain situations.
  - Performance Mode: Render either directly on a Canvas using D3 custom namespace or provide a faux DOM to D3 to avoid polluting our real DOM and then rasterize the faux DOM to an image. __PROS__: Responsiveness. No SVG nodes in DOM making it slow. __CONS__: Raster graphics as a result. 
- Evaluate if web workers are feasible for these strategies and how they can contribute to performance.