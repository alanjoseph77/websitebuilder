import React, { useRef, useEffect, useState } from 'react'

const ANIMATIONS = {
  fade: {
    hidden: { opacity: 0, transform: 'none' },
    visible: { opacity: 1, transform: 'none' },
  },
  'slide-up': {
    hidden: { opacity: 0, transform: 'translateY(48px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'slide-down': {
    hidden: { opacity: 0, transform: 'translateY(-48px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'slide-left': {
    hidden: { opacity: 0, transform: 'translateX(-60px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'slide-right': {
    hidden: { opacity: 0, transform: 'translateX(60px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  zoom: {
    hidden: { opacity: 0, transform: 'scale(0.82)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'zoom-out': {
    hidden: { opacity: 0, transform: 'scale(1.12)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  flip: {
    hidden: { opacity: 0, transform: 'rotateX(-25deg)' },
    visible: { opacity: 1, transform: 'rotateX(0deg)' },
  },
}

export default function ScrollReveal({ animation, duration = 600, delay = 0, children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(!animation || animation === 'none')

  useEffect(() => {
    if (!animation || animation === 'none') {
      setVisible(true)
      return
    }
    setVisible(false)
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [animation])

  if (!animation || animation === 'none') return <>{children}</>

  const anim = ANIMATIONS[animation] || ANIMATIONS.fade
  const currentStyle = visible ? anim.visible : anim.hidden

  return (
    <div
      ref={ref}
      style={{
        ...currentStyle,
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
        willChange: 'opacity, transform',
        perspective: animation === 'flip' ? '800px' : undefined,
      }}
    >
      {children}
    </div>
  )
}
