import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, query, where, getDocs, collection } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const DamageReport = () => {
  const [reports, setReports] = useState([]);
  const navigation = useNavigation();
  const database = getFirestore();

  const fetchData = async () => {
    try {
      const getemail = await AsyncStorage.getItem('email');
      const q = query(collection(database, 'Damages'), where('email', '==', getemail));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach(doc => {
        const details = doc.data();
        data.push({
          id: doc.id,
          date: details.date,
          // Add other properties as needed
        });
      });
      setReports(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleItemPress = (item) => {
    navigation.navigate('DamageDetails', { item });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tile}
      onPress={() => {
        handleItemPress(item)
      }}
    >
      <Text style={styles.title}>{item.date}</Text>
    </TouchableOpacity>
  );

  const handleGoBack = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Damage Reports
      </Text>
      
      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContainer}
        
        
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
    backgroundColor: '#fff',
    paddingTop: 230,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  flatListContainer: {
    paddingHorizontal: 20,
    paddingTop:20
  },
  tile: {
    backgroundColor: '#0096FF',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  bottomButton: {
    backgroundColor: '#0782F9',
    marginBottom:20,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 365,
    height: 70,
    alignSelf: 'center',
    paddingBottom:30
    
   
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

export default DamageReport;
