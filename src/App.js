import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './components/Welcome';
import Home from './components/Home';
import PlotExistingChart from './components/PlotExistingChart';

export default class App extends Component {
  render() {
    const MainNav = createStackNavigator();

    return (
      <NavigationContainer>
        <MainNav.Navigator 
          screenOptions={{headerShown: false}}>
          <MainNav.Screen name="Home" component={Home} />
          <MainNav.Screen name="Welcome" component={Welcome} />
          <MainNav.Screen name="Plot Existing Chart" component={PlotExistingChart} />
        </MainNav.Navigator>
      </NavigationContainer>
    )
  }
};
