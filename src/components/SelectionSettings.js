import React from 'react';
import './SelectionSettings.scss';

import __ from './../utils/translation';

import SelectionColorSettings from './SelectionColorSettings';
import SelectionBorderSettings from './SelectionBorderSettings';
import SelectionTextSettings from './SelectionTextSettings';
import SelectionAlignSettings from './SelectionAlignSettings';
import SelectionObjectSettings from './SelectionObjectSettings';
import SelectionEffectSettings from './SelectionEffectSettings';



const SelectionSettings = ({ canvas, activeSelection, isTextEditing }) => {

  return (
    <>
      <p className="title">{__('SELECTION SETTINGS')}</p>

      {
        activeSelection.type !== 'image' &&
        activeSelection.type !== 'line' &&
        activeSelection.type !== 'activeSelection' &&
        activeSelection.type !== 'group' &&
        activeSelection.type !== 'textbox' &&
        <SelectionColorSettings canvas={canvas} activeSelection={activeSelection} />
      }


      { activeSelection.type === 'textbox' &&
        <>
          <p className="subtitle">{__('Font style')}</p>
          <SelectionTextSettings canvas={canvas} activeSelection={activeSelection} isTextEditing={isTextEditing} />
        </>
      }


      { activeSelection.type !== 'group' && !isTextEditing &&
        <>
          <p className="subtitle">{__('Border')}</p>
          <SelectionBorderSettings canvas={canvas} activeSelection={activeSelection} />
        </>
      }


      { !isTextEditing &&
        <>
          <p className="subtitle">{__('Alignment')}</p>
          <SelectionAlignSettings canvas={canvas} activeSelection={activeSelection} />
        </>
      }

      { !isTextEditing &&
        <>
          <p className="subtitle">{__('Object options')}</p>
          <SelectionObjectSettings canvas={canvas} activeSelection={activeSelection} />
        </>
      }


      {activeSelection.type === 'image' &&
        <>
          <p className="subtitle">{__('Effects')}</p>
          <SelectionEffectSettings canvas={canvas} activeSelection={activeSelection} />
        </>
      }


    </>
  )
}

export default SelectionSettings
