import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import TemplateSelectionScreen from '../screens/TemplateSelectionScreen';
import FormFillingScreen from '../screens/FormFillingScreen';
import PreviewScreen from '../screens/PreviewScreen';
import MyPDFsScreen from '../screens/MyPDFsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Invoice Help' }} 
        />
        <Stack.Screen 
          name="TemplateSelection" 
          component={TemplateSelectionScreen} 
          options={{ title: 'Select Template' }} 
        />
        <Stack.Screen 
          name="FormFilling" 
          component={FormFillingScreen} 
          options={{ title: 'Fill Details' }} 
        />
        <Stack.Screen 
          name="Preview" 
          component={PreviewScreen} 
          options={{ title: 'Preview Document' }} 
        />
        <Stack.Screen 
          name="MyPDFs" 
          component={MyPDFsScreen} 
          options={{ title: 'My PDFs' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;