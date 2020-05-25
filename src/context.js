//Criação do contexto para utilizar a lista de leiura já realizadas em toda a aplicação
import React, {useContext} from 'react'

export const Readings = React.createContext()
export const useReadings = () => {
    return useContext(Readings)
}