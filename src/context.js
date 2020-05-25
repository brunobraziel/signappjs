import React, {useContext} from 'react'

export const Readings = React.createContext()
export const useReadings = () => {
    return useContext(Readings)
}