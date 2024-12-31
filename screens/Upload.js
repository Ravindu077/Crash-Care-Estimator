import axios from "axios";
import React, { useState, useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

const Upload = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState('');
  const navigation = useNavigation(); // Initialize navigation hook
  const database = getFirestore();
  const ref = collection(database, "Damages");

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedDate = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;

  const fetchemail = async () => {
    try {
      const getemail = await AsyncStorage.getItem('email');
      if (getemail) {
        setEmail(getemail);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchemail();
  }, []);

  const gallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    try {
      if (image) {
        setUploading(true);

        const response = await fetch(image);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = async () => {
          const base64data = reader.result.split(",")[1];

          await axios.post(
            "https://detect.roboflow.com/crash-care-estimator/2",
            base64data,
            {
              params: {
                api_key: "0UzFjfNCyGS4A1uPHi8L"
              },
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          ).then(function (response) {
            console.log(response.data);
            const filteredClasses = response.data.predictions
              .filter(prediction => prediction.confidence * 100 > 50)
              .map(prediction => prediction.class);
            console.log(filteredClasses);
            try {
              if (filteredClasses.length !== 0) {
                const data = {
                  email: email, damage: filteredClasses, date: formattedDate
                };
                addDoc(ref, data);
              }
              else {
                alert("No damages found");
              }
            } catch (e) {
              alert(e);
              console.log(e);
            }
          });
          setUploading(false);
          setImage(null);
          navigation.navigate('DamageReport'); // Navigate to DamageReport.js after successful upload
        };

        reader.readAsDataURL(blob);
      }
    } catch (error) {
      console.log('Error', error);
      setUploading(false);
    }
  };

  const deleteImage = () => {
    setImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        )}

        <View style={styles.options}>
          <TouchableOpacity onPress={gallery}>
            <View style={styles.optionButton}>
              <Feather name="image" size={28} style={styles.optionIcon} />
              <Text style={styles.optionText}>Gallery</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={takePhoto}>
            <View style={styles.optionButton}>
              <Ionicons name="camera" size={28} style={styles.optionIcon} />
              <Text style={styles.optionText}>Camera</Text>
            </View>
          </TouchableOpacity>

          {image && (
            <TouchableOpacity onPress={deleteImage}>
              <View style={styles.optionButton}>
                <Feather name="trash-2" size={28} style={styles.optionIcon} />
                <Text style={styles.optionText}>Remove</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.uploadButton}>
          <TouchableOpacity onPress={uploadImage} style={styles.uploadBut}>
            <Text style={styles.uploadText}>
              {uploading ? 'Uploading...' : 'SUBMIT!'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.backBut}>
            <Text style={styles.backText}>BACK TO HOMEPAGE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    borderRadius: 15,
    width: 320,
    height: 320,
    borderColor: '#ddd',
    borderWidth: 2,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  optionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  optionIcon: {
    marginBottom: 5,
    color: '#555',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  uploadButton: {
    width: '80%',
    alignItems: 'center',
    marginTop: 30,
  },
  uploadBut: {
    width: '100%',
    backgroundColor: '#007bff',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  backButton: {
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  backBut: {
    width: '100%',
    backgroundColor: '#6c757d',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  backText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default Upload;
