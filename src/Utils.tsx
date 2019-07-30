import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import { TInput, TOutput } from './rxio'

type UseHeight = (
  input: TInput<number>,
  onMount?: (ref: CallbackRefParam) => void,
  onResize?: (ref: HTMLElement) => void
) => (ref: CallbackRefParam) => void

export type CallbackRefParam = HTMLElement | null

export const useHeight: UseHeight = (input, onMount, onResize) => {
  const ref = useRef<CallbackRefParam>(null)
  const currentHeight = useRef(0)
  const animationFrameID = useRef(null);
  const observer = new ResizeObserver(entries => {
    const newHeight = entries[0].contentRect.height
    if (currentHeight.current !== newHeight) {
      currentHeight.current = newHeight
      if (onResize) {
        animationFrameID.current = window.requestAnimationFrame(() =>
          onResize(entries[0].target as HTMLElement)
        );
      }
      input(newHeight)
    }
  })

  const callbackRef = (elRef: CallbackRefParam) => {
    if (elRef) {
      observer.observe(elRef)
      if (onMount) {
        onMount(elRef)
      }
      ref.current = elRef
    } else {
      observer.unobserve(ref.current!)
      ref.current = null
    }
  }
                         
  useEffect(() => () =>
    window.cancelAnimationFrame(animationFrameID.current)
  );
  return callbackRef
}

export function useOutput<T>(output: TOutput<T>, initialValue: T): T {
  const [value, setValue] = useState(initialValue)

  useLayoutEffect(() => {
    output(setValue)
  }, [])

  return value
}
