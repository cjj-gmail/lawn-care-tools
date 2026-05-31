import React, { createContext, useContext, useReducer } from 'react'
import { reducer, initialState } from './reducer.js'

const StateCtx    = createContext(null)
const DispatchCtx = createContext(null)

export function AppProvider({ children }) {
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
