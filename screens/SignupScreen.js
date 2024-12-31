import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { auth } from './Firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, addDoc } from "firebase/firestore";



const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [vehiclemake, setVehicleMake] = useState('')
  const [model, setModel] = useState('')
  const [location, setLocation] = useState('')
  const [yom, setYom] = useState('')

  const database = getFirestore();
  const ref = collection(database, "User");

  const navigation = useNavigation()


  const handleSignUp = () => {
      createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {

        try {
          const user = { email: email , name: name , vehicle_make: vehiclemake , model: model, location : location, yom : yom };
          addDoc(ref, user);
      }catch (e){
          alert(e);
          console.log(e);
      }
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        navigation.navigate('LoginScreen');
      })
      .catch(error => alert(error.message))
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Make"
          value={vehiclemake}
          onChangeText={text => setVehicleMake(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Model"
          value={model}
          onChangeText={text => setModel(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Location"
          value={location}
          onChangeText={text => setLocation(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Year of Manufacture"
          value={yom}
          onChangeText={text => setYom(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
})
