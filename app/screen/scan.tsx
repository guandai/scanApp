import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Button, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useFocusEffect, useRouter } from 'expo-router'; 

export default function TabOneScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isFocused, setIsFocused] = useState(true); // Manage tab focus state
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter(); 

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

  // Use useFocusEffect to manage tab focus state
  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true); // Tab is focused
      return () => setIsFocused(false); // Tab is unfocused
    }, [])
  );

  // Function to handle the barcode scanning result
  const handleBarCodeScanned = (scanningResult: { type: string; data: string }) => {
    setScanned(true);

    Alert.alert(
      'Barcode Scanned',
      `Type: ${scanningResult.type}\nData: ${scanningResult.data}`,
      [{ text: 'OK', onPress: () => setScanned(false) }]
    );

    console.log(`Barcode type: ${scanningResult.type}, Data: ${scanningResult.data}`);
  };

  // Function to toggle between front and back camera
  function toggleCameraFacing() {
    setFacing((current) => current === 'back' ? 'front' : 'back');
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  // Conditionally render the CameraView component only when the tab is focused
  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'code128', 'code39', 'pdf417', 'ean13', 'ean8'],
          }}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
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
