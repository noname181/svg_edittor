/*
 * Access previous prop values before they changed
 */

import { useRef, useEffect } from 'react';


const usePrevious = (value) => {
  const ref = useRef()
  
  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

export default usePrevious
