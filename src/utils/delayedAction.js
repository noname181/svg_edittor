/*
 * Delays an action, e.g.: saving history when picking a color.
 */

let actionTimer
const delayedAction = (milisec, callback) => {
  clearTimeout(actionTimer)
  actionTimer = setTimeout(() => {
    callback()
  }, milisec)
}

export default delayedAction
