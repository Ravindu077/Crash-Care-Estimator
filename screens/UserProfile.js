import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, query, where, getDocs, collection } from "firebase/firestore";
import Icon from 'react-native-vector-icons/FontAwesome';

const UserProfileScreen = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [yom, setYom] = useState('');

  const navigation = useNavigation();
  const database = getFirestore();

  const fetchEmail = async () => {
    try {
      const getemail = await AsyncStorage.getItem('email');
      if (getemail) {
        setEmail(getemail);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      const getemail = await AsyncStorage.getItem('email');
      const q = query(collection(database, "User"), where("email", "==", getemail));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const details = doc.data();
        AsyncStorage.setItem('userId', doc.id);
        setUserId(doc.id);
        setName(details.name);
        setVehicleMake(details.vehicle_make);
        setModel(details.model);
        setYom(details.yom);
        setLocation(details.location);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmail();
    getProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Profile</Text>
      <View style={styles.profileInfo}>
        <ProfileDetail label="Name" value={name} icon="user" />
        <ProfileDetail label="Email" value={email} icon="envelope" />
        <ProfileDetail label="Location" value={location} icon="map-marker" />
        <ProfileDetail label="Vehicle Model" value={model} icon="car" />
        <ProfileDetail label="Year of Manufacture" value={yom} icon="calendar" />
        <ProfileDetail label="Vehicle Make" value={vehicleMake} icon="car" />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.button}>
        <Text style={styles.buttonText}>Go back</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')} style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProfileDetail = ({ label, value, icon }) => (
  <View style={styles.row}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={20} color="#333" />
    </View>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileInfo: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 4,
    color: '#333',
    width: 100,
  },
  value: {
    flex: 1,
    color: '#555',
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserProfileScreen;
