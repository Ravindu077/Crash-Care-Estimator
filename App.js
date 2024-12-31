import React from 'react';
import Cover from './screens/Cover';
import LoginScreen from './screens/LoginScreen';
import { useEffect, useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import SignupScreen from './screens/SignupScreen'
import UserProfileScreen from './screens/UserProfile';
import Workshop from './screens/Workshop';
import DamageReport from './screens/DamageReport';
import DamageDetails from './screens/DamageDetails';
import Upload from './screens/Upload';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

  const Stack = createNativeStackNavigator();

  const App = () => {


    const [showCover, setShowCover] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowCover(false);
      }, 1000); // 5 seconds delay
  
      return () => clearTimeout(timer);
    }, []);

    
  

    return (
      <NavigationContainer>
        {showCover ? (
          <Cover />
        ) : (
          
          <Stack.Navigator initialRouteName={'LoginScreen'}>
              <>
                 <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
                 <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
                 <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }}/>
                 <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} options={{ headerShown: false }}/>
                 <Stack.Screen name="Upload" component={Upload} options={{ headerShown: false }}/>
                 <Stack.Screen name="Workshop" component={Workshop} options={{ headerShown: false }}/>
                 <Stack.Screen name="DamageReport" component={DamageReport} options={{ headerShown: false }}/>
                 <Stack.Screen name="DamageDetails" component={DamageDetails} options={{ headerShown: false }}/>
                 
              </>
            
          </Stack.Navigator>
        )}
      </NavigationContainer>
    );
  };
 
  export default App;



  
