import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { auth } from './Firebase/firebase';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("LoginScreen");
      })
      .catch(error => alert(error.message));
  }

  return (
    <ImageBackground source={require('../assets/bg.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('UserProfileScreen')} style={styles.button}>
            <Icon name="person-circle-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Workshop')} style={styles.button}>
            <Icon name="search-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Find Workshops</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Upload')} style={styles.button}>
            <Icon name="cloud-upload-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Scan Vehicle</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('DamageReport')} style={styles.button}>
            <Icon name="document-text-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Damage Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Icon name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0782F9',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%', 
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },
});
