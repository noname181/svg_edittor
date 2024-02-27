/*
 * Turns on/off drawing modes: line, multi-line and free draw.
 */

import __ from './../utils/translation';


export const handleDrawingModes = (canvas, activeTool, setSelectionInfo) => {

  // reset all modes
  canvas.set('isDrawingMode', false)
  canvas.set('isDrawingLineMode', false)
  canvas.set('isDrawingPathMode', false)
  canvas.set('isDrawingTextMode', false)
  canvas.defaultCursor = 'default'
  canvas.selection = true
  canvas.forEachObject(o => {
    o.selectable = true
    o.evented = true
  });


  // drawing mode
  if (activeTool === 'draw') {
    canvas.set('isDrawingMode', true)
  }


  // drawing line mode
  if (activeTool === 'line') {
    setSelectionInfo(__('Tip: hold Shift key for 15° angle jumps!'))
    canvas.isDrawingLineMode = true
    canvas.defaultCursor = 'crosshair'
    canvas.selection = false
    canvas.forEachObject(o => {
      o.selectable = false
      o.evented = false
    });
  }


  // drawing path mode
  if (activeTool === 'path') {
    setSelectionInfo(__('Tip: click to place points, press and pull for curves! Click outside or press Esc to cancel!'));
    canvas.isDrawingPathMode = true
    canvas.defaultCursor = 'crosshair'
    canvas.selection = false
    canvas.forEachObject(o => {
      o.selectable = false
      o.evented = false
    });
  }


  // drawing text mode
  if (activeTool === 'textbox') {
    canvas.isDrawingTextMode = true
    canvas.defaultCursor = 'crosshair'
    canvas.selection = false
    canvas.forEachObject(o => {
      o.selectable = false
      o.evented = false
    });
  }

}
