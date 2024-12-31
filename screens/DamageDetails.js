import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const DamageDetailsScreen = ({ route }) => {
  const { item } = route.params;
  const [damageDetails, setDamageDetails] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchDamageDetails = async () => {
      const database = getFirestore();

      try {
        // Retrieve the document from the 'Damages' collection based on 'id'
        const damageDocRef = doc(database, 'Damages', item.id);
        const damageDocSnap = await getDoc(damageDocRef);

        if (damageDocSnap.exists()) {
          const damageData = damageDocSnap.data();
          const damageArray = damageData.damage;

          // Fetch details for each damaged part
          const details = [];
          let totalAmount = 0;
          for (const damageItem of damageArray) {
            const q = query(collection(database, 'Parts'), where('Damage', '==', damageItem));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const partDoc = querySnapshot.docs[0];
              const { Damage, Cost, Suggestion } = partDoc.data();
              details.push({ Damage, Cost, Suggestion });
              totalAmount = totalAmount+ parseFloat(Cost); 
            }
          }

          setDamageDetails(details);
          setTotalCost(totalAmount);
        }
      } catch (error) {
        console.log('Error fetching damage details:', error);
      }
    };

    fetchDamageDetails();
  }, [item]); // Run effect when 'item' changes

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Damage Details</Text>
      <Text>Date: {item.date}</Text>

      {/* Render damage details */}
      <View style={styles.damageContainer}>
        {damageDetails.map((damage, index) => (
          <View key={index} style={styles.damageItem}>
            <Text style={styles.damageItemName}>{damage.Damage}</Text>
            <Text>Cost: Rs.{damage.Cost}</Text>
            <Text>Suggestion: {damage.Suggestion}</Text>
          </View>
        ))}
      </View>

      {/* Render total estimated value */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Estimated Value:</Text>
        <Text style={styles.totalAmount}>Rs.{totalCost}</Text>
      </View>
    </View>
  );
};

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
  damageContainer: {
    marginTop: 20,
    width: '100%',
  },
  damageItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  damageItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  totalContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default DamageDetailsScreen;
