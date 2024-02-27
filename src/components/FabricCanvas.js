import React, { useEffect } from "react";
import { fabric } from "fabric";

import __ from "./../utils/translation";
import copyPaste from "./../utils/copyPaste";
import lineDrawing from "./../utils/lineDrawing";
import pathDrawing from "./../utils/pathDrawing";
import textBoxDrawing from "./../utils/textBoxDrawing";
import demoContent from "./../utils/demoContent";

import "./FabricCanvas.scss";

const FabricCanvas = (props) => {
  // init fabric canvas once
  useEffect(() => {
    // the code below runs only once
    if (props.canvas) return;

    // create instance
    let width =
      document.getElementsByClassName("canvas-holder")[0].offsetWidth - 17;
    let height =
      document.getElementsByClassName("canvas-holder")[0].offsetHeight - 8;
    const fabricCanvas = new fabric.Canvas("c").setDimensions({
      width: width,
      height: height,
    });
    fabricCanvas.originalW = fabricCanvas.width;
    fabricCanvas.originalH = fabricCanvas.height;
    fabricCanvas.backgroundColor = "#ffffff";

    // set up selection style
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.borderColor = "#C00000";
    fabric.Object.prototype.cornerColor = "#C00000";
    fabric.Object.prototype.cornerStrokeColor = "#FFF";
    fabric.Object.prototype.padding = 0;

    // retrieve active selection to react state
    fabricCanvas.on("selection:created", (e) =>
      props.setActiveSelection(e.target)
    );
    fabricCanvas.on("selection:updated", (e) => {
      props.setActiveSelection(e.target);
    });
    fabricCanvas.on("selection:cleared", (e) => props.setActiveSelection(null));

    // snap to an angle on rotate if shift key is down
    fabricCanvas.on("object:rotating", (e) => {
      if (e.e.shiftKey) {
        e.target.snapAngle = 15;
      } else {
        e.target.snapAngle = false;
      }
    });

    // display selected object info
    fabricCanvas.on("object:scaling", (e) => {
      const obj = e.target;
      props.setSelectionInfo(`${__("width")}: ${Math.round(
        obj.getScaledWidth()
      )}px |
       ${__("height")}: ${Math.round(obj.getScaledHeight())}px`);
    });
    fabricCanvas.on("object:scaled", (e) => props.setSelectionInfo(null));
    fabricCanvas.on("object:rotating", (e) =>
      props.setSelectionInfo(__("Tip: hold Shift key for 15° angle jumps!"))
    );
    fabricCanvas.on("object:rotated ", (e) => props.setSelectionInfo(null));

    // keep objects within frame
    fabricCanvas.on("object:moving", (e) => {
      const obj = e.target;

      // if object is too big ignore
      if (
        obj.currentHeight > obj.canvas.height ||
        obj.currentWidth > obj.canvas.width
      ) {
        return;
      }

      // set offset for moving out the canvas (20px of object persists in canvas)
      const offsetWidth = obj.getBoundingRect().width - 20;
      const offsetHeight = obj.getBoundingRect().height - 20;

      obj.setCoords();

      // top-left corner
      if (
        obj.getBoundingRect().top < -offsetHeight ||
        obj.getBoundingRect().left < -offsetWidth
      ) {
        obj.top = Math.max(
          obj.top,
          obj.top - (obj.getBoundingRect().top + offsetHeight)
        );
        obj.left = Math.max(
          obj.left,
          obj.left - (obj.getBoundingRect().left + offsetWidth)
        );
      }

      // bot-right corner
      if (
        obj.getBoundingRect().top + obj.getBoundingRect().height >
          obj.canvas.height + offsetHeight ||
        obj.getBoundingRect().left + obj.getBoundingRect().width >
          obj.canvas.width + offsetWidth
      ) {
        obj.top = Math.min(
          obj.top,
          obj.canvas.height -
            obj.getBoundingRect().height +
            obj.top -
            obj.getBoundingRect().top +
            offsetHeight
        );
        obj.left = Math.min(
          obj.left,
          obj.canvas.width -
            obj.getBoundingRect().width +
            obj.left -
            obj.getBoundingRect().left +
            offsetWidth
        );
      }
    });

    // move objects with arrow keys
    document.addEventListener("keydown", (e) => {
      const key = e.which || e.keyCode;
      let activeObject;

      if (document.querySelectorAll("textarea:focus, input:focus").length > 0)
        return;

      if (key === 37 || key === 38 || key === 39 || key === 40) {
        e.preventDefault();
        activeObject = fabricCanvas.getActiveObject();
        if (!activeObject) {
          return;
        }
      }

      if (key === 37) {
        activeObject.left -= 1;
      } else if (key === 39) {
        activeObject.left += 1;
      } else if (key === 38) {
        activeObject.top -= 1;
      } else if (key === 40) {
        activeObject.top += 1;
      }

      if (key === 37 || key === 38 || key === 39 || key === 40) {
        activeObject.setCoords();
        fabricCanvas.renderAll();
        fabricCanvas.trigger("object:modified");
      }
    });

    // deselect active object on outside click
    const deselectActiveObject = (e) => {
      if (e.target.id === "app") {
        fabricCanvas.discardActiveObject().requestRenderAll();
      }
    };

    document.addEventListener("mousedown", deselectActiveObject);
    document.addEventListener("touchstart", deselectActiveObject);

    // copy/paste
    copyPaste(fabricCanvas, fabric);

    // delete object on del key
    document.addEventListener("keydown", (e) => {
      console.log(e)
      const key = e.which || e.keyCode;
      if (
        key === 46 &&
        document.querySelectorAll("textarea:focus, input:focus").length === 0
      ) {
        fabricCanvas.getActiveObjects().forEach((obj) => {
          fabricCanvas.remove(obj);
        });

        fabricCanvas.discardActiveObject().requestRenderAll();
        fabricCanvas.trigger("object:modified");
      }
    });

    // line drawing
    lineDrawing(fabricCanvas, fabric);

    // path drawing
    pathDrawing(fabricCanvas, fabric);

    // textbox drawing
    textBoxDrawing(fabricCanvas, fabric);

    // textbox editing
    fabricCanvas.on("text:editing:entered", () => props.setIsTextEditing(true));
    fabricCanvas.on("text:editing:exited", () => props.setIsTextEditing(false));

    // add demo objects
    //demoContent(fabricCanvas, fabric)

    // save history's first state on startup
    setTimeout(() => {
      let states = [];
      states.push(fabricCanvas.toJSON());
      props.setHistory({
        index: 0,
        states: states,
      });
    }, 800);

    if (props.tnSVG) {
      fabric.loadSVGFromURL(
        `https://pms.riansoft.net${props.tnSVG}`,
        function (objects, options) {
          objects.forEach((element, index) => {
            element.set({ left: element?.left, top: element?.top });
            fabricCanvas.add(element).renderAll();
          });
        }
      );
    }

    // add to state
    props.setCanvas(fabricCanvas);
  }, [props]);

  // useEffect(() => {
  //   // create instance
  //   let width =
  //     document.getElementsByClassName("canvas-holder")[0].offsetWidth - 102;
  //   let height =
  //     document.getElementsByClassName("canvas-holder")[0].offsetHeight - 110;
  //   const fabricCanvas = new fabric.Canvas("c").setDimensions({
  //     width: width,
  //     height: height,
  //   });
  //   fabricCanvas.originalW = fabricCanvas.width;
  //   fabricCanvas.originalH = fabricCanvas.height;
  //   fabricCanvas.backgroundColor = "#ffffff";

  //   // set up selection style
  //   fabric.Object.prototype.transparentCorners = false;
  //   fabric.Object.prototype.cornerStyle = "circle";
  //   fabric.Object.prototype.borderColor = "#C00000";
  //   fabric.Object.prototype.cornerColor = "#C00000";
  //   fabric.Object.prototype.cornerStrokeColor = "#FFF";
  //   fabric.Object.prototype.padding = 0;

  //   // retrieve active selection to react state
  //   fabricCanvas.on("selection:created", (e) =>
  //     props.setActiveSelection(e.target)
  //   );
  //   fabricCanvas.on("selection:updated", (e) => {
  //     props.setActiveSelection(e.target);
  //   });
  //   fabricCanvas.on("selection:cleared", (e) => props.setActiveSelection(null));

  //   // snap to an angle on rotate if shift key is down
  //   fabricCanvas.on("object:rotating", (e) => {
  //     if (e.e.shiftKey) {
  //       e.target.snapAngle = 15;
  //     } else {
  //       e.target.snapAngle = false;
  //     }
  //   });

  //   // display selected object info
  //   fabricCanvas.on("object:scaling", (e) => {
  //     const obj = e.target;
  //     props.setSelectionInfo(`${__("width")}: ${Math.round(
  //       obj.getScaledWidth()
  //     )}px |
  //      ${__("height")}: ${Math.round(obj.getScaledHeight())}px`);
  //   });
  //   fabricCanvas.on("object:scaled", (e) => props.setSelectionInfo(null));
  //   fabricCanvas.on("object:rotating", (e) =>
  //     props.setSelectionInfo(__("Tip: hold Shift key for 15° angle jumps!"))
  //   );
  //   fabricCanvas.on("object:rotated ", (e) => props.setSelectionInfo(null));

  //   // keep objects within frame
  //   fabricCanvas.on("object:moving", (e) => {
  //     const obj = e.target;

  //     // if object is too big ignore
  //     if (
  //       obj.currentHeight > obj.canvas.height ||
  //       obj.currentWidth > obj.canvas.width
  //     ) {
  //       return;
  //     }

  //     // set offset for moving out the canvas (20px of object persists in canvas)
  //     const offsetWidth = obj.getBoundingRect().width - 20;
  //     const offsetHeight = obj.getBoundingRect().height - 20;

  //     obj.setCoords();

  //     // top-left corner
  //     if (
  //       obj.getBoundingRect().top < -offsetHeight ||
  //       obj.getBoundingRect().left < -offsetWidth
  //     ) {
  //       obj.top = Math.max(
  //         obj.top,
  //         obj.top - (obj.getBoundingRect().top + offsetHeight)
  //       );
  //       obj.left = Math.max(
  //         obj.left,
  //         obj.left - (obj.getBoundingRect().left + offsetWidth)
  //       );
  //     }

  //     // bot-right corner
  //     if (
  //       obj.getBoundingRect().top + obj.getBoundingRect().height >
  //         obj.canvas.height + offsetHeight ||
  //       obj.getBoundingRect().left + obj.getBoundingRect().width >
  //         obj.canvas.width + offsetWidth
  //     ) {
  //       obj.top = Math.min(
  //         obj.top,
  //         obj.canvas.height -
  //           obj.getBoundingRect().height +
  //           obj.top -
  //           obj.getBoundingRect().top +
  //           offsetHeight
  //       );
  //       obj.left = Math.min(
  //         obj.left,
  //         obj.canvas.width -
  //           obj.getBoundingRect().width +
  //           obj.left -
  //           obj.getBoundingRect().left +
  //           offsetWidth
  //       );
  //     }
  //   });

  //   // move objects with arrow keys
  //   document.addEventListener("keydown", (e) => {
  //     const key = e.which || e.keyCode;
  //     let activeObject;

  //     if (document.querySelectorAll("textarea:focus, input:focus").length > 0)
  //       return;

  //     if (key === 37 || key === 38 || key === 39 || key === 40) {
  //       e.preventDefault();
  //       activeObject = fabricCanvas.getActiveObject();
  //       if (!activeObject) {
  //         return;
  //       }
  //     }

  //     if (key === 37) {
  //       activeObject.left -= 1;
  //     } else if (key === 39) {
  //       activeObject.left += 1;
  //     } else if (key === 38) {
  //       activeObject.top -= 1;
  //     } else if (key === 40) {
  //       activeObject.top += 1;
  //     }

  //     if (key === 37 || key === 38 || key === 39 || key === 40) {
  //       activeObject.setCoords();
  //       fabricCanvas.renderAll();
  //       fabricCanvas.trigger("object:modified");
  //     }
  //   });

  //   // deselect active object on outside click
  //   const deselectActiveObject = (e) => {
  //     if (e.target.id === "app") {
  //       fabricCanvas.discardActiveObject().requestRenderAll();
  //     }
  //   };

  //   document.addEventListener("mousedown", deselectActiveObject);
  //   document.addEventListener("touchstart", deselectActiveObject);

  //   // copy/paste
  //   copyPaste(fabricCanvas, fabric);

  //   // delete object on del key
  //   document.addEventListener("keydown", (e) => {
  //     const key = e.which || e.keyCode;
  //     if (
  //       key === 46 &&
  //       document.querySelectorAll("textarea:focus, input:focus").length === 0
  //     ) {
  //       fabricCanvas.getActiveObjects().forEach((obj) => {
  //         fabricCanvas.remove(obj);
  //       });

  //       fabricCanvas.discardActiveObject().requestRenderAll();
  //       fabricCanvas.trigger("object:modified");
  //     }
  //   });

  //   // line drawing
  //   lineDrawing(fabricCanvas, fabric);

  //   // path drawing
  //   pathDrawing(fabricCanvas, fabric);

  //   // textbox drawing
  //   textBoxDrawing(fabricCanvas, fabric);

  //   // textbox editing
  //   fabricCanvas.on("text:editing:entered", () => props.setIsTextEditing(true));
  //   fabricCanvas.on("text:editing:exited", () => props.setIsTextEditing(false));

  //   // add demo objects
  //   // demoContent(fabricCanvas, fabric)

  //   // save history's first state on startup
  //   setTimeout(() => {
  //     let states = [];
  //     states.push(fabricCanvas.toJSON());
  //     props.setHistory({
  //       index: 0,
  //       states: states,
  //     });
  //   }, 800);

  //   if (props.tnSVG) {
  //     console.log(`222https://pms.riansoft.net${props.tnSVG}`)
  //     fabric.loadSVGFromURL(
  //       `https://pms.riansoft.net${props.tnSVG}`,
  //       function (objects, options) {
  //         objects.forEach((element, index) => {
  //           element.set({ left: element?.left, top: element?.top });
  //           fabricCanvas.add(element).renderAll();
  //         });
  //       }
  //     );
  //   }

  //   // add to state
  //   props.setCanvas(fabricCanvas);
  // }, [props.tnSVG]);

  return (
    <div className="canvas-holder">
      <canvas id="c"></canvas>
      {props.canvas && <div className="canvas-info">{props.selectionInfo}</div>}
    </div>
  );
};

export default FabricCanvas;
