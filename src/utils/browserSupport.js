/*
 * Checks if the user's browser supports modern features.
 */

import __ from './../utils/translation';
import sadSmiley from './../icons/sad-smiley.svg';


// outdated browser warning and a sad smiley
const browserWarning = document.createElement('div')
browserWarning.innerHTML = `<p style="line-height: 26px; margin-top: 100px; font-size: 16px; color: #555">
  ${__('Your browser is out of date!')}<br />${__('Please update to a modern browser, for example:')} <a href="https://www.google.com/chrome/" target="_blank">Chrome</a>!</p>
  <img src="${sadSmiley}"
  style="max-width: 300px; width: 100%; display: block; margin: 0 auto; opacity: 0.4" />`;

browserWarning.setAttribute(
  'style',
  `position: fixed; z-index: 1000; width: 100%; height: 100%; top: 0; left: 0;
  background-color: #f9f9f9; text-align: center; color: #555;`
)


// check for flex and grid support
let divGrid = document.createElement('div')
divGrid.style['display'] = 'grid'
let supportsGrid = divGrid.style['display'] === 'grid'

let divFlex = document.createElement('div')
divFlex.style['display'] = 'flex'
let supportsFlex = divFlex.style['display'] === 'flex'

if(! supportsGrid || ! supportsFlex) {
  document.body.appendChild(browserWarning)
}


