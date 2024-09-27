import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For token storage
import { useRouter } from 'expo-router'; // For navigation after logout
import EditScreenInfo from '@/components/EditScreenInfo';

export default function TabProfileScreen() {
  const router = useRouter(); // Hook for navigation

  // Logout function
  const handleLogout = async () => {
    try {
      // Clear token and user data from AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userId');

      // Redirect to the login screen
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.separator} />
      <EditScreenInfo path="app/screen/profile.tsx" />

      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
