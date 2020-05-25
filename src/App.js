import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './components/Welcome';
import Home from './components/Home';
import PlotExistingChart from './components/PlotExistingChart';
import Settings from './components/Settings';
import PlotRealTime from './components/PlotRealTime';
import ReadingsList from './components/ReadingsList';
import './globals.js'
import { Readings } from './context'

export default function App() {
    const [readings, setReadings] = useState([])
    const MainNav = createStackNavigator();
    console.disableYellowBox = true;

    return (
      <NavigationContainer>
        <Readings.Provider value={{readings, setReadings}}>
          <MainNav.Navigator
            screenOptions={{ headerShown: false }}>
            <MainNav.Screen name="Home" component={Home} />
            <MainNav.Screen name="Welcome" component={Welcome} />
            <MainNav.Screen name="Plot Existing Chart" component={PlotExistingChart} />
            <MainNav.Screen name="Settings" component={Settings} />
            <MainNav.Screen name="Plot Real Time" component={PlotRealTime} />
            <MainNav.Screen name="Readings List" component={ReadingsList} />
          </MainNav.Navigator>
        </Readings.Provider>
      </NavigationContainer>
    )
};
