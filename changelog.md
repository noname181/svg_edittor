# Changelog

## v1.1.2
- fix: after fitting canvas to content, clicking download resets canvas to previous size
- updated files:
    - package.json
    - src/components/CanvasSettings.js
    - src/components/SelectionTextSettings.js

## v1.1.1
- fix: textbox issue, after typing we couldn't change font style on other textboxes
- fix: textbox overall stylings are displayed properly now on direct textbox switch
- fix: now you can copy paste text from/to textbox editing
- fix: overflow-y vertical scrollbar
- updated files:
    - package.json
    - src/App.js, index.scss
    - src/components/FabricCanvas.js, InputAmout.js, InputAmount.scss, SelectionObjectSettings.js, SelectionSettings.js, SelectionTextSettings.js, ToolPanel.scss
    - src/utils/copyPaste.js, textBoxDrawing.js, usePrevious.js

## v1.1.0
- added a changelog
- base app update, package updates, fixed a bunch of deprecated warnings
- app now supports latest LTS Node version (v16.17.1)
- updated Fabric to latest 3.x.x version (v4 and v5 contains breaking changes, it will be a bigger update later)
- updated app render to React 18
- fixed SASS lint issues
- fix: when only a part of a text was selected, font size change didn't work
- fix: CTRL + scroll zoom issues
- fix: alignment tools didn't work well when zoomed in/out
- fix: downloaded image size changed when zommed in/out
- fix: ungrouping just grouped objects didn't work
- fix: selection settings panel disappeared after ungrouping
- updated files:
    - package.json
    - src/App.js, index.js
    - src/components/Button.scss, FloatingMenu.js, GradientPicker.scss, InputRange.scss, SelectionAlignSettings.js, SelectionObjectSettings.js, SelectionTextSettings.js
    - utils/saveInBrowser.js, zoom.js

## v1.0.1
- fix: Shape component's title was untranslated
- fix: after free draw selecting the object produced an error
- updated files: src/components/Shapes.js, src/components/SelectionColorSettings.js, src/languages/en.json

## v1.0.0
- initial release
