import React, { FC, useContext, useCallback, UIEvent } from 'react'
import { VirtuosoContext } from './VirtuosoContext'

const scrollerStyle: React.CSSProperties = {
  height: '100%',
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  position: 'relative',
}

export const VirtuosoScroller: FC = ({ children }) => {
  const { scrollTop$ } = useContext(VirtuosoContext)!

  const onScrollTop = useCallback(
    (e: UIEvent<HTMLDivElement>) => scrollTop$.next((e.target as HTMLDivElement).scrollTop),
    [scrollTop$]
  )

  return (
    <div onScroll={onScrollTop} style={scrollerStyle}>
      {children}
    </div>
  )
}
