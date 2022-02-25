import "./style.css";

import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { keymap } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentWithTab } from "@codemirror/commands";

let view = new EditorView({
  state: EditorState.create({
    extensions: [basicSetup, oneDark, python(), keymap.of([indentWithTab])],
  }),
  parent: document.querySelector("#editor"),
});

let pyodide;
async function main() {
  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/",
  });
  await pyodide.loadPackage("micropip");
}
main();

async function runPythonClick() {
  let logs = [];
  let oldLog = console.log;
  console.log = function (message) {
    logs.push(message);
  };
  document.querySelector("#output").innerHTML =
    "<pre><code><span class='debug'>Loading...</span></code></pre>";
  let code = view.state.sliceDoc();
  let output = await pyodide.runPythonAsync(code);
  document.querySelector("#output").innerHTML =
    "<pre><code><span class='debug'>" + output + "</span></code></pre>";
  oldLog(logs);
}

document.querySelector("#run").addEventListener("click", runPythonClick);
