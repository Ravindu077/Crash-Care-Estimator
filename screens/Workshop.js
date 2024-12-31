import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, query, where, getDocs, collection } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const Workshop = () => {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [shops, setShops] = useState([]);
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

  const getShops = async () => {
    try {
      const getemail = await AsyncStorage.getItem('email');
      const q = query(collection(database, 'User'), where('email', '==', getemail));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const details = doc.data();
        setLocation(details.location);

        const shopQuery = query(collection(database, 'Autoshops'), where('location', '==', details.location));
        const shopSnapshot = await getDocs(shopQuery);
        const shopData = shopSnapshot.docs.map((shopDoc) => shopDoc.data());
        setShops(shopData);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmail();
    getShops();
  }, []);

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.tile}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>Contact: {item.contact}</Text>
      <TouchableOpacity style={styles.linkContainer} onPress={() => openLink(item.map)}>
        <Icon name="map-marker" size={20} color="blue" style={styles.mapIcon} />
        <Text style={styles.linkText}>Visit Workshop</Text>
      </TouchableOpacity>
      {/* Add more shop details here */}
    </TouchableOpacity>
  );


  const handleGoBack = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Available Workshops</Text>
        <Text style={styles.location}>Near: {location}</Text>
      </View>

      <FlatList
        data={shops}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.shopList}
      />

      <TouchableOpacity onPress={handleGoBack} style={styles.bottomButton}>
        <Text style={styles.bottomButtonText}>Go Back to Home</Text>
        <Icon name="home" size={20} color="white" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingTop:60,
    marginBottom: 20,
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  shopList: {
    flexGrow: 1,
  },
  
  tile: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  bottomButton: {
    backgroundColor: '#0782F9',
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
   
  },
  bottomButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  icon: {
    marginRight: 5,
  },
});

export default Workshop;
