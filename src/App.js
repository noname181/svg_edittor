/*
 * SVG Editor
 * version: 1.0.1
 *
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { fabric } from "fabric";

import Notification from "./components/Notification";
import Header from "./components/Header";
import Button from "./components/Button";
import FloatingMenu from "./components/FloatingMenu";
import Menu from "./components/Menu";
import Toolbar from "./components/Toolbar";
import FabricCanvas from "./components/FabricCanvas";
import ToolPanel from "./components/ToolPanel";
import SelectionSettings from "./components/SelectionSettings";
import CanvasSettings from "./components/CanvasSettings";
import DrawSettings from "./components/DrawSettings";
import Shapes from "./components/Shapes";
import UploadSettings from "./components/UploadSettings";

import __ from "./utils/translation";
import saveInBrowser from "./utils/saveInBrowser";
import { downloadImage, downloadSVG } from "./utils/downloadImage";
import { undo, redo } from "./utils/undoRedo";
import { editorTips } from "./utils/editorTips";
import { handleDrawingModes } from "./utils/handleDrawingModes";
import {
  applyZoom,
  zoomWithKeys,
  zoomWithMouse,
  zoomOptions,
} from "./utils/zoom";

import logo from "./images/logo.png";
import { ReactComponent as IconGear } from "./icons/gear.svg";
import { ReactComponent as IconUndo } from "./icons/undo.svg";
import { ReactComponent as IconRedo } from "./icons/redo.svg";
import { ReactComponent as IconTick } from "./icons/tick.svg";
import { ReactComponent as IconDownload } from "./icons/down.svg";
import { ReactComponent as IconClose } from "./icons/close.svg";
import { ReactComponent as IconBrush } from "./icons/brush.svg";
import { ReactComponent as IconCursor } from "./icons/cursor.svg";
import { ReactComponent as IconLine } from "./icons/line.svg";
import { ReactComponent as IconPath } from "./icons/path.svg";
import { ReactComponent as IconShape } from "./icons/shape.svg";
import { ReactComponent as IconText } from "./icons/text.svg";
import { ReactComponent as IconUpload } from "./icons/upload.svg";
import { ReactComponent as IconZoom } from "./icons/zoom.svg";

const App = () => {
  // states
  const [notification, setNotification] = useState({
    message: null,
    type: null,
    seconds: null,
  });
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [activeTool, setActiveTool] = useState("select");

  const [canvas, setCanvas] = useState();
  const [loadSavedCanvas, setLoadSavedCanvas] = useState(true);
  const [activeSelection, setActiveSelection] = useState(null);
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [history, setHistory] = useState({ index: null, states: [] });
  const [selectionInfo, setSelectionInfo] = useState(
    editorTips[Math.floor(Math.random() * editorTips.length)]
  );
  const [zoom, setZoom] = useState(1);
  const [tnId, setTnId] = useState(null);
  const [tnSVG, setTnSVG] = useState(null);
  //--------------------------------------------------------------------
  useEffect(() => {
    window.addEventListener("message", ({ data, source }) => {
      if (data?.call == "sendValue") {
        console.log(data?.value);
        setTnId(data?.value);
      }
    });
  }, []);

  useEffect(() => {
    if (tnId) {
      var formData = new FormData();
      formData.append("tn_id", tnId);
      formData.append("type", "get_svg");
      axios
        .post("https://pms.riansoft.net/task_new_edit_svg.php", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res?.data?.tn_svg);
          setTnSVG(res?.data?.tn_svg);
          if (res?.data?.tn_svg && canvas) {
            canvas.clear();
            canvas.backgroundColor = "#ffffff";
            let width =
              document.getElementsByClassName("canvas-holder")[0].offsetWidth - 17;
            let height =
              document.getElementsByClassName("canvas-holder")[0].offsetHeight - 8;
            fabric.loadSVGFromURL(
              `https://pms.riansoft.net${res?.data?.tn_svg}`,
              function (_objects, _options, _elements) {
                let group = fabric.util.groupSVGElements(_objects, _options);
                let _width = group.width;
                let _height = group.height;
                if(_width > width || _height > height){
                  canvas.setDimensions({ width: _width, height: _height });
                }
                // const fabricCanvas = new fabric.Canvas("c").setDimensions({
                //   width: _width,
                //   height: _height,
                // });
                // fabricCanvas.originalW = fabricCanvas.width;
                // fabricCanvas.originalH = fabricCanvas.height;
                // fabricCanvas.backgroundColor = "#ffffff";

                fabric.loadSVGFromURL(
                  `https://pms.riansoft.net${res?.data?.tn_svg}`,
                  function (objects, options, elements) {

                    objects.forEach((obj, index) => {
                      if (obj.text) {
                        var element = elements[index];
                        var childrens = [].slice.call(element.childNodes);
                        var value = "";
                        childrens.forEach(function (el, index, array) {
                          if (el.nodeName == "tspan") {
                            value += el.childNodes[0].nodeValue;
                          } else if (el.nodeName == "#text") {
                            value += el.nodeValue;
                          }

                          if (index < childrens.length - 1) {
                            value += "\n";
                          }
                        });
                        value =
                          obj["text-transform"] == "uppercase"
                            ? value.toUpperCase()
                            : value;
                        var _textAlign = obj.get("textAnchor")
                          ? obj.get("textAnchor")
                          : "left";
                        var text = new fabric.Textbox(obj.text, obj.toObject());
                        text.set({
                          text: value,
                          type: "textbox",
                        });

                        text.set({
                          left:
                            parseFloat(obj.left) +
                            parseFloat(element.firstChild.getAttribute("x")),
                          top:
                            parseFloat(obj.top) +
                            parseFloat(element.firstChild.getAttribute("y")),
                          textAlign: _textAlign,
                        });
                        canvas.add(text).renderAll();
                      } else {
                        obj.set({ left: obj?.left, top: obj?.top });
                        canvas.add(obj).renderAll();
                      }
                    });

                    // let scaleRatio = Math.min(fabricCanvas.getWidth()/width, fabricCanvas.getHeight()/height);
                    // fabricCanvas.setDimensions({ width: fabricCanvas.getWidth() * scaleRatio, height: fabricCanvas.getHeight() * scaleRatio });
                    // fabricCanvas.setZoom(scaleRatio)
                    // canvas.setDimensions({ width: fabricCanvas.getWidth() * scaleRatio, height: fabricCanvas.getHeight() * scaleRatio });
                    // console.log('width canvas: ' + fabricCanvas.getWidth())
                    // console.log('height canvas: ' + fabricCanvas.getHeight())
                    // console.log('width: ' + width)
                    // console.log('height: ' + height)
                    // console.log('scaleRatio: ' + scaleRatio)
                    // canvas = fabricCanvas;
                  }

                );
            })

          } else {
            canvas.clear();
            canvas.backgroundColor = "#ffffff";
          }
        });
    }
  }, [tnId]);

  // on start: check if there is a saved canvas in this browser and ask if we should load it
  useEffect(() => {
    if (canvas && loadSavedCanvas) {
      const savedCanvas = saveInBrowser.load("canvasEditor");
      // if (savedCanvas && window.confirm( __('We found a project saved in this browser! Do you want to load it?') )) {
      //   canvas.loadFromJSON(savedCanvas, canvas.renderAll.bind(canvas));
      // }

      setLoadSavedCanvas(false);
    }
  }, [canvas, loadSavedCanvas]);

  //--------------------------------------------------------------------

  // on active selection update: change active tool to select
  useEffect(() => {
    if (!activeSelection) return;

    setActiveTool("select");

    // scroll to top in tool panel
    document.querySelector(".toolpanel .holder").scrollTop = 0;
  }, [activeSelection]);

  //--------------------------------------------------------------------

  // on active tool change: deselect all object, handle drawing modes
  useEffect(() => {
    if (!canvas) return;

    if (activeTool !== "select")
      canvas.discardActiveObject().requestRenderAll();

    handleDrawingModes(canvas, activeTool, setSelectionInfo);
  }, [canvas, activeTool]);

  //--------------------------------------------------------------------

  // save history and unsaved work alert
  const maxHistory = 10;
  useEffect(() => {
    if (!canvas) return;

    const saveHistory = () => {
      let updatedHistory = [...history.states];

      // if any action happens after undo, clear all (redo) actions after current state
      if (history.index < history.states.length - 1)
        updatedHistory.splice(history.index + 1);

      // add current state to history
      updatedHistory.push(canvas.toJSON());
      if (updatedHistory.length > maxHistory) updatedHistory.shift();

      setHistory({ index: updatedHistory.length - 1, states: updatedHistory });
    };
    canvas.on("object:modified", saveHistory);
    canvas.on("path:created", saveHistory);

    const unsavedWorkAlert = (e) => {
      if (history.states.length > 1)
        e.returnValue = __(`Are you sure you want to leave?`);
    };
    window.addEventListener("beforeunload", unsavedWorkAlert);

    // cleanup
    return () => {
      canvas.off("object:modified", saveHistory);
      canvas.off("path:created", saveHistory);

      window.removeEventListener("beforeunload", unsavedWorkAlert);
    };
  }, [canvas, history]);

  //--------------------------------------------------------------------

  // keyboard & mouse shortcuts
  useEffect(() => {
    if (!canvas) return;

    // select tool (v)
    const keyV = (e) => {
      const key = e.which || e.keyCode;
      if (
        key === 86 &&
        document.querySelectorAll("textarea:focus, input:focus").length === 0
      ) {
        setActiveTool("select");
      }
    };
    document.addEventListener("keydown", keyV);

    // undo/redo (ctrl z/y)
    const ctrZY = (e) => {
      const key = e.which || e.keyCode;

      if (
        key === 90 &&
        e.ctrlKey &&
        document.querySelectorAll("textarea:focus, input:focus").length === 0
      ) {
        undo(canvas, history, setHistory);
      }

      if (
        key === 89 &&
        e.ctrlKey &&
        document.querySelectorAll("textarea:focus, input:focus").length === 0
      ) {
        redo(canvas, history, setHistory);
      }
    };
    document.addEventListener("keydown", ctrZY);

    // zoom out/in/reset (ctr + -/+/0)
    const keyZoom = (e) => zoomWithKeys(e, canvas, setZoom, applyZoom);
    document.addEventListener("keydown", keyZoom);

    // zoom out/in with mouse
    const mouseZoom = (e) => zoomWithMouse(e, canvas, setZoom, applyZoom);
    document.addEventListener("wheel", mouseZoom, { passive: false });

    // cleanup
    return () => {
      document.removeEventListener("keydown", keyV);
      document.removeEventListener("keydown", ctrZY);
      document.removeEventListener("keydown", keyZoom);
      document.removeEventListener("wheel", mouseZoom);
    };
  }, [canvas, history]);

  //--------------------------------------------------------------------

  // render layout
  return (
    <div id="app">
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <Header logo={logo}>
        {/* {tnId && <Button title={__("TaskID")}>{tnId}</Button>}
        <Button
          title={__("Undo")}
          handleClick={() => undo(canvas, history, setHistory)}
          className={!history.index || history.index === 0 ? "disabled" : ""}
        >
          <IconUndo />
        </Button>
        <Button
          title={__("Redo")}
          handleClick={() => redo(canvas, history, setHistory)}
          className={
            history.index < history.states.length - 1 ? "" : "disabled"
          }
        >
          <IconRedo />
        </Button>
        <div className="separator"></div>

        <Button
          title={__("Save")}
          handleClick={() => {
            var formData = new FormData();
            var svgBlob = new Blob([canvas.toSVG()], {
              type: "image/svg+xml;charset=utf-8",
            });
            formData.append("svg", svgBlob, "task.svg");
            formData.append("tn_id", tnId);
            axios
              .post(
                "https://pms.riansoft.net/task_new_edit_svg.php",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
              .then((res) => {
                alert('Saved!');
                console.log(res);
              });
            // saveInBrowser.save("canvasEditor", canvas.toJSON());
            // setNotification({
            //   message: __("Project is saved in this browser!"),
            //   seconds: 3,
            // });
          }}
        >
          <IconTick />
        </Button>
        <Button
          title={__("Download as..")}
          className="download"
          handleClick={() => setDownloadMenuVisible(!downloadMenuVisible)}
        >
          <IconDownload />
        </Button>
        <Button
          title={__("Close and open new")}
          handleClick={() => {
            if (
              window.confirm(__("This will clear the canvas! Are you sure?"))
            ) {
              setHistory({ index: null, states: [] });
              canvas.clear();
              saveInBrowser.remove("canvasEditor");
            }
          }}
          className="close"
        >
          <IconClose />
        </Button> */}

        <FloatingMenu
          visible={downloadMenuVisible}
          setVisible={setDownloadMenuVisible}
        >
          <Menu
            handleClick={() => {
              setZoom(1);
              applyZoom(canvas, 1);
              setDownloadMenuVisible(false);
              downloadSVG(canvas.toSVG());
            }}
          >
            {__("Download as SVG")}
          </Menu>
          <Menu
            handleClick={() => {
              setZoom(1);
              applyZoom(canvas, 1);
              setDownloadMenuVisible(false);
              downloadImage(canvas.toDataURL());
            }}
          >
            {__("Download as PNG")}
          </Menu>
          <Menu
            handleClick={() => {
              setZoom(1);
              applyZoom(canvas, 1);
              setDownloadMenuVisible(false);
              downloadImage(
                canvas.toDataURL({ format: "jpeg" }),
                "jpg",
                "image/jpeg"
              );
            }}
          >
            {__("Download as JPG")}
          </Menu>
        </FloatingMenu>
      </Header>

      <Toolbar activeTool={activeTool}>
        <Button
          name="select"
          title={__("Select/move object (V)")}
          handleClick={() => setActiveTool("select")}
        >
          <IconCursor />
        </Button>
        <Button
          name="shapes"
          title={__("Shapes")}
          handleClick={() => setActiveTool("shapes")}
        >
          <IconShape />
        </Button>
        <Button
          name="line"
          title={__("Line")}
          handleClick={() => setActiveTool("line")}
        >
          <IconLine />
        </Button>
        <Button
          name="path"
          title={__("Connectable lines & curves")}
          handleClick={() => setActiveTool("path")}
        >
          <IconPath />
        </Button>
        <Button
          name="draw"
          title={__("Free draw")}
          handleClick={() => setActiveTool("draw")}
        >
          <IconBrush />
        </Button>
        <Button
          name="textbox"
          title={__("Text box")}
          handleClick={() => setActiveTool("textbox")}
        >
          <IconText />
        </Button>
        <Button
          name="upload"
          title={__("Upload image")}
          handleClick={() => setActiveTool("upload")}
        >
          <IconUpload />
        </Button>
        <div className="separator"></div>
        <Button
          title={__("Undo")}
          handleClick={() => undo(canvas, history, setHistory)}
          className={!history.index || history.index === 0 ? "disabled" : ""}
        >
          <IconUndo />
        </Button>
        <Button
          title={__("Redo")}
          handleClick={() => redo(canvas, history, setHistory)}
          className={
            history.index < history.states.length - 1 ? "" : "disabled"
          }
        >
          <IconRedo />
        </Button>
        <div className="separator"></div>

        {/* <Button
          title={__("Download as..")}
          className="download"
          handleClick={() => setDownloadMenuVisible(!downloadMenuVisible)}
        >
          <IconDownload />
        </Button> */}
        <Button
          title={__("Close and open new")}
          handleClick={() => {
            if (
              window.confirm(__("This will clear the canvas! Are you sure?"))
            ) {
              setHistory({ index: null, states: [] });
              canvas.clear();
              saveInBrowser.remove("canvasEditor");
            }
          }}
          className="close"
        >
          <IconClose />
        </Button>
        <Button
          style={{backgroundColor: 'rgb(63, 87, 167)', opacity: '0.9'}}
          title={__("Save")}
          handleClick={() => {
            var formData = new FormData();
            var svgBlob = new Blob([canvas.toSVG()], {
              type: "image/svg+xml;charset=utf-8",
            });
            formData.append("svg", svgBlob, "task.svg");
            formData.append("tn_id", tnId);
            axios
              .post(
                "https://pms.riansoft.net/task_new_edit_svg.php",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
              .then((res) => {
                // alert("Saved!");
                window.parent.postMessage({
                  call: 'onSave'
                }, "*");
                console.log(res);
              });
            // saveInBrowser.save("canvasEditor", canvas.toJSON());
            // setNotification({
            //   message: __("Project is saved in this browser!"),
            //   seconds: 3,
            // });
          }}
        >
          <IconTick  />
        </Button>
        {/* <div className="separator"></div>
        <Button
          name="background"
          title={__("Canvas options")}
          handleClick={() => setActiveTool("background")}
        >
          <IconGear />
        </Button> */}
      </Toolbar>

      <ToolPanel
        visible={
          activeSelection ||
          (activeTool !== "select" &&
            activeTool !== "line" &&
            activeTool !== "path" &&
            activeTool !== "textbox")
        }
      >
        {activeSelection && (
          <SelectionSettings
            canvas={canvas}
            activeSelection={activeSelection}
            isTextEditing={isTextEditing}
          />
        )}

        {activeTool === "background" && !activeSelection && (
          <CanvasSettings canvas={canvas} />
        )}

        {activeTool === "draw" && !activeSelection && (
          <DrawSettings canvas={canvas} />
        )}

        {activeTool === "shapes" && !activeSelection && (
          <Shapes canvas={canvas} />
        )}

        {activeTool === "upload" && !activeSelection && (
          <UploadSettings canvas={canvas} />
        )}
      </ToolPanel>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          top: 0,
        }}
      >
        <FabricCanvas
          canvas={canvas}
          setCanvas={setCanvas}
          selectionInfo={selectionInfo}
          setSelectionInfo={setSelectionInfo}
          setActiveSelection={setActiveSelection}
          setIsTextEditing={setIsTextEditing}
          setHistory={setHistory}
          tnSVG={tnSVG}
        />
      </div>

      <div className="bottom-info">
        <IconZoom />
        <select
          onChange={(e) => {
            setZoom(e.target.value);
            applyZoom(canvas, e.target.value);
          }}
          value={zoom}
        >
          {zoomOptions.map((z, index) => {
            if (index === 0 && !zoomOptions.includes(Number(zoom))) {
              return (
                <option key={zoom} value="">
                  {Number(zoom * 100).toFixed(0)}%
                </option>
              );
            }

            return (
              <option key={z} value={z}>
                {Number(z * 100).toFixed(0)}%
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default App;
