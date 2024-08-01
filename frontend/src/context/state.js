import { createContext, useContext } from "react"

const AppContext = createContext()

export const AppWrapper = ({children}) => {
  let sharedState = {
    foo:'bar'
  }

  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}

export default AppWrapper