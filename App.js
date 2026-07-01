import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import IdentidadScreen from './src/screens/IdentidadScreen';
import MundoScreen from './src/screens/MundoScreen';
import MediaScreen from './src/screens/MediaScreen';
import AboutScreen from './src/screens/AboutScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Inicio') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Identidad') {
                iconName = focused ? 'person' : 'person-outline';
              } else if (route.name === 'Mundo') {
                iconName = focused ? 'globe' : 'globe-outline';
              } else if (route.name === 'Media') {
                iconName = focused ? 'play-circle' : 'play-circle-outline';
              } else if (route.name === 'Acerca de') {
                iconName = focused ? 'information-circle' : 'information-circle-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4f46e5',
            tabBarInactiveTintColor: '#64748b',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopWidth: 1,
              borderTopColor: '#e2e8f0',
              paddingBottom: 8,
              paddingTop: 8,
              height: 64,
            },
            headerStyle: {
              backgroundColor: '#ffffff',
              borderBottomWidth: 1,
              borderBottomColor: '#e2e8f0',
            },
            headerTitleStyle: {
              fontWeight: '700',
              color: '#1e293b',
              fontSize: 18,
            },
            headerTitleAlign: 'center',
          })}
        >
          <Tab.Screen 
            name="Inicio" 
            component={HomeScreen} 
            options={{ title: 'Caja de Herramientas' }}
          />
          <Tab.Screen 
            name="Identidad" 
            component={IdentidadScreen} 
            options={{ title: 'Identidad' }}
          />
          <Tab.Screen 
            name="Mundo" 
            component={MundoScreen} 
            options={{ title: 'Mundo & Clima' }}
          />
          <Tab.Screen 
            name="Media" 
            component={MediaScreen} 
            options={{ title: 'Contenido y Medios' }}
          />
          <Tab.Screen 
            name="Acerca de" 
            component={AboutScreen} 
            options={{ title: 'Contacto Desarrollador' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
