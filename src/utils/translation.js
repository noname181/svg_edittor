/*
 * Translates the strings.
 */

import strings from '../languages/en.json' // set the path to your language file


// translator function
const __ = (str) => {
  if (!strings || !strings[str]) return str

  return strings[str]
}

export default __
