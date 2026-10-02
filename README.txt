580 WEB LAB
Modern Calculator. Familiar Experience.

Version: Casio-style UI refresh

Open index.html directly in a modern browser. No build step and no server are required.

Structure
580-web-lab/
├── index.html
├── css/
│   ├── style.css
│   ├── calculator.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── state.js
│   ├── calculator.js
│   ├── tokenizer.js
│   ├── parser.js
│   ├── evaluator.js
│   ├── formatter.js
│   ├── history.js
│   ├── storage.js
│   ├── keyboard.js
│   ├── themes.js
│   └── modes/
│       ├── basic.js
│       ├── complex.js
│       ├── statistics.js
│       ├── table.js
│       ├── matrix.js
│       └── equation.js
├── lib/
│   └── math.js
└── assets/
    ├── logo.svg
    └── favicon.svg

UI notes
- Main keypad now prioritizes frequently used scientific-calculator keys.
- Less frequently used but useful actions are grouped in Tools.
- A compact right-side utility rail provides Tools, History, Settings, and Focus.
- The calculator scales to the viewport to avoid page scrolling.
- Copyright text is fixed at the lower-left corner:
  580 web lab
  Hoang Thai Duong edition
