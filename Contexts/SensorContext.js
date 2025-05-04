import { createContext, useState } from "react";


export const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
    const [soilSensorId, setSoilSensorId] = useState(null);
    const [lightSensorId, setLightSensorId] = useState(null);

    const updateSoilSensorId = (newSensorId) => {
        setSoilSensorId(newSensorId);
    }

    const updateLightSensorId = (newSensorId) => {
        setLightSensorId(newSensorId);
    }

    const clearSensorId = () => {
        setSoilSensorId(null);
        setLightSensorId(null);
    }

    return (
        <SensorContext.Provider value={{
            soilSensorId,
            lightSensorId,
            updateSoilSensorId,
            updateLightSensorId,
            clearSensorId
        }}>
            { children }
        </SensorContext.Provider>
    )
}