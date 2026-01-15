import * as Location from 'expo-location';
import { Alert } from 'react-native';

export async function getUserPincode() {
  // Ask permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission denied', 'Location permission is required');
    return null;
  }

  // Get current GPS location
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const { latitude, longitude } = location.coords;

  // Reverse geocode
  const address = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  if (address.length > 0) {
    return address[0].postalCode; // <-- PINCODE
  }

  return null;
}