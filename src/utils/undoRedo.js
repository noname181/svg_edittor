/*
 * Undo and Redo functions for FabricJs.
 */


export const undo = (canvas, history, setHistory) => {
  let updatedIndex = history.index === 0 ? 0 : history.index - 1
  canvas.loadFromJSON(history.states[updatedIndex], canvas.renderAll.bind(canvas))
  setHistory({ index: updatedIndex, states: [...history.states] })
}


export const redo = (canvas, history, setHistory) => {
  if (history.index === history.states.length - 1) return

  let updatedIndex = history.index + 1
  canvas.loadFromJSON(history.states[updatedIndex], canvas.renderAll.bind(canvas))
  setHistory({ index: updatedIndex, states: [...history.states] })
}
