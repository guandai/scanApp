import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Button, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useRouter } from 'expo-router'; // Import router for navigation

export default function TabOneScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter(); // For navigation

  // Check for user authentication when the screen loads
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        // If no token, navigate to the login screen
        router.replace('/login');
      }
    };

    checkAuth();

    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Function to handle the barcode scanning result
  const handleBarCodeScanned = (scanningResult: { type: string; data: string }) => {
    setScanned(true); // Set scanned state to true so it doesn't scan continuously

    // Show an alert with the barcode type and data
    Alert.alert(
      'Barcode Scanned',
      `Type: ${scanningResult.type}\nData: ${scanningResult.data}`,
      [{ text: 'OK', onPress: () => setScanned(false) }] // Reset scanned to false so you can scan again
    );

    console.log(`Barcode type: ${scanningResult.type}, Data: ${scanningResult.data}`);
  };

  // Function to toggle between front and back camera
  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  // If camera permission is still being loaded
  if (!permission) {
    return <View />;
  }

  // If camera permission is denied
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  // Render the CameraView component with barcode scanning functionality
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128', 'code39', 'pdf417', 'ean13', 'ean8'], // Add supported barcode types
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
