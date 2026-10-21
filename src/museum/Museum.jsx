import React, { useEffect, useRef } from 'react'
import { startMuseum } from './startMuseum'
import './museum.css'

/**
 * Full-screen 3D celebration museum (wedding, birthday, mother-to-be).
 * Props:
 *   onExit — called when the visitor taps "Back to site".
 */
export default function Museum({ onExit }) {
  const ref = useRef(null)
  const exitRef = useRef(onExit)
  exitRef.current = onExit

  useEffect(() => {
    const dispose = startMuseum(ref.current, { onExit: () => exitRef.current && exitRef.current() })
    return () => dispose()
  }, [])

  return <div ref={ref} className="museum-root" />
}