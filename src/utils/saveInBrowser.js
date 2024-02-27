/*
 * Saves strings or objects as JSON strings in browser storage.
 */

import __ from './../utils/translation';


// check if localStorage is supported
let localStorageSupported;
try {
  localStorage.setItem('test', 'item');
  localStorage.removeItem('test');
  localStorageSupported = true;
} catch (e) {
  localStorageSupported = false;
}


// detect if string is a stringified JSON
const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}


// save
const save = (name, value) => {
  if (!localStorageSupported){
    alert(__('Browser storage is not supported in this browser!'));
    return;
  }

  // if item is an object, stringify
  if (value instanceof Object) {
    value = JSON.stringify(value);
  }

  localStorage.setItem(name, value);
}


// load
const load = (name) => {
  let value = localStorage.getItem(name);

  // if item is JSON, unstringify
  if (isJsonString(value)) {
    value = JSON.parse(value);
  }

  return value;
}


// remove
const remove = (name) => {
  localStorage.removeItem(name);
}


const saveInBrowser = {
  save, load, remove
}
export default saveInBrowser
