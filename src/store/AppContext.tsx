import React, { createContext, useContext, useReducer } from 'react'
import { reducer, initialState } from './reducer.js'

const StateCtx    = createContext<any>(null)
const DispatchCtx = createContext<React.Dispatch<any>>(null as any)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>
        {children}
      </DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}

export function useAppState()    { return useContext(StateCtx) }
export function useAppDispatch() { return useContext(DispatchCtx) }
