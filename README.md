# Persona Q Fusion Calculator
A tool to help calculate fusions in Persona Q: Shadow of the Labyrinth

## Running the tool
You can see the latest version working at:
https://triprojects.herokuapp.com/projects/pqfusion

But you can just grab the latest release at the
[releases section](https://github.com/trigork/persona-fusion-calculator)
of this repo and serve it on any HTML server.

## Dev Requirements
The tool doesn't use NodeJS for routing or any server-side code so it can be
runned form any server, even if it only allows client-side code. NPM and Bower
are used just to manage packages dependencies and keeping the libraries up to
date. Gulp is used to minify the web and produce a distributable and minified
version.

To run the latest version of the tool locally just clone the repo and run:
```
npm install
bower install
gulp build
```

After that you should have a ready-to-serve distirbution of the tool at the
`/dist/` folder.

## Acknowledgements

Forked from https://github.com/Wasuregusa/persona-fusion-calculator, demo for P3,
P3FES, P4 and P4Golden available at: http://wasuregusa.github.io/persona-fusion-calculator

Credit to the previous authors:
[arantius](https://github.com/arantius/persona-fusion-calculator)
[wasuregusa](https://github.com/Wasuregusa/persona-fusion-calculator)
