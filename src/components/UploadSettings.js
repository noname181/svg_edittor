import React, { useRef } from 'react';
import './UploadSettings.scss';

import { fabric } from 'fabric';

import __ from './../utils/translation';

import { ReactComponent as IconSadSmiley } from './../icons/sad-smiley.svg';



const UploadSettings = ({ canvas }) => {

  const inputFile = useRef(null)
  const dropArea = useRef(null)


  // check if HTML5 File API is supported by the browser
  if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {
    return (
      <div className="file-upload no-support">
        <p>{__(`Your browser doesn't support file upload. Please upgrade to a modern browser, for example:`)} <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">Chrome!</a></p>
        <p><IconSadSmiley /></p>
      </div>
    )
  }


  const processFiles = (e, files) => {
    e.preventDefault()

    dropArea.current.style.backgroundColor = '#fff'

    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml']

    for (let file of files) {
      // check type
      if (!allowedTypes.includes(file.type)) continue

      let reader = new FileReader()

      // handle svg
      if (file.type === 'image/svg+xml') {
        reader.onload = (f) => {
          fabric.loadSVGFromString(f.target.result, (objects, options) => {
            let obj = fabric.util.groupSVGElements(objects, options)
            obj.set({left: 0, top: 0}).setCoords()
            canvas.add(obj)

            canvas.renderAll()
            canvas.trigger('object:modified')
          })
        }
        reader.readAsText(file)
        continue
      }

      // handle image, read file, add to canvas
      reader.onload = (f) => {
        fabric.Image.fromURL(f.target.result, (img) => {
          img.set({left: canvas.getWidth() - 300, top: 0})
          img.scaleToHeight(300)
          img.scaleToWidth(300)
          canvas.add(img)

          canvas.renderAll()
          canvas.trigger('object:modified')
        })
      }

      reader.readAsDataURL(file)
    }
  }


  return (
    <>
      <p className="title">{__('UPLOAD IMAGE')}</p>

      <div className="file-upload">

        <p>{__(`File upload happens via HTML5 File API, so we don't use the server to store user images. You can also copy paste an image from the clipboard!`)}</p>

        <div className="drop" ref={dropArea} onClick={() => inputFile.current.click()}
          onDrop={(e) => processFiles(e, e.dataTransfer.files)}
          onDragOver={(e) => {
            e.preventDefault()
            dropArea.current.style.backgroundColor = '#ddd'
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            dropArea.current.style.backgroundColor = '#fff'
          }}>
          <div className="info">{__('Drag & drop files')}<br />{__('or click to browse.')}<br />{__('JPG, PNG or SVG only!')}</div>
        </div>

        <input type="file" onChange={(e) => processFiles(e, inputFile.current.files)} multiple
          ref={inputFile} style={{display: 'none'}} />

      </div>
    </>
  )

}


export default UploadSettings
