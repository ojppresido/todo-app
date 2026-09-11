import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

if (!window.PointerEvent) {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    constructor(type, params = {}) {
      super(type, { ...params, bubbles: params.bubbles ?? true, cancelable: true })
    }
  }
}

window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  }))

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})