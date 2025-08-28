import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Metals' }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={({ route }) => ({ title: (route.params?.metal || 'Details').toUpperCase() })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
