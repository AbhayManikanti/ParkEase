import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useParking } from '../../contexts/parking-context';
import { useAuth } from '../../contexts/auth-context';
import { theme } from '../../utils/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ParkingSlot } from '../../types';
import { Car, MapPin, Calendar, DollarSign, Info } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HostScreen() {
  const { createParkingSlot } = useParking();
  const { user, updateProfile } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    latitude: '37.7749',
    longitude: '-122.4194',
    width: '2.5',
    length: '5.0',
    pricePerHour: '4.99',
    availableFrom: new Date().toISOString().split('T')[0],
    availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    imageUrl: 'https://images.pexels.com/photos/1004665/pexels-photo-1004665.jpeg',
    amenities: ['Covered', 'Well Lit', '24/7 Access']
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.address) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (isNaN(parseFloat(formData.width)) || isNaN(parseFloat(formData.length))) {
      setError('Dimensions must be valid numbers');
      return false;
    }
    
    if (isNaN(parseFloat(formData.pricePerHour))) {
      setError('Price must be a valid number');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // If user is not a host yet, upgrade their account
      if (!user?.isHost) {
        await updateProfile({ isHost: true });
      }
      
      const newParkingSlot = await createParkingSlot({
        title: formData.title,
        description: formData.description,
        address: formData.address,
        location: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        },
        dimensions: {
          width: parseFloat(formData.width),
          length: parseFloat(formData.length)
        },
        pricePerHour: parseFloat(formData.pricePerHour),
        availableFrom: new Date(formData.availableFrom).toISOString(),
        availableTo: new Date(formData.availableTo).toISOString(),
        imageUrl: formData.imageUrl,
        amenities: formData.amenities
      });
      
      if (newParkingSlot) {
        Alert.alert(
          'Success',
          'Your parking spot has been listed successfully!',
          [{ text: 'OK' }]
        );
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          address: '',
          latitude: '37.7749',
          longitude: '-122.4194',
          width: '2.5',
          length: '5.0',
          pricePerHour: '4.99',
          availableFrom: new Date().toISOString().split('T')[0],
          availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          imageUrl: 'https://images.pexels.com/photos/1004665/pexels-photo-1004665.jpeg',
          amenities: ['Covered', 'Well Lit', '24/7 Access']
        });
      }
    } catch (error) {
      console.error('Error creating parking slot:', error);
      setError('Failed to create parking slot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <Animated.View 
            style={styles.header}
            entering={FadeInDown.delay(200).duration(800)}
          >
            <Text style={styles.headerTitle}>Host a Parking Spot</Text>
            <Text style={styles.headerSubtitle}>
              List your unused parking space and start earning
            </Text>
          </Animated.View>
          
          {error && (
            <Animated.View 
              style={styles.errorContainer}
              entering={FadeInDown.delay(300).duration(800)}
            >
              <Info size={20} color={theme.colors.error[500]} />
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}
          
          <Animated.View 
            style={styles.formSection}
            entering={FadeInDown.delay(400).duration(800)}
          >
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <Input
              label="Title"
              placeholder="e.g., Downtown Secure Parking"
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
            />
            
            <Input
              label="Description"
              placeholder="Describe your parking spot"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              inputStyle={styles.textArea}
            />
            
            <Input
              label="Address"
              placeholder="Full address of the parking spot"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              leftIcon={<MapPin size={20} color={theme.colors.neutral[500]} />}
            />
          </Animated.View>
          
          <Animated.View 
            style={styles.formSection}
            entering={FadeInDown.delay(500).duration(800)}
          >
            <Text style={styles.sectionTitle}>Dimensions</Text>
            
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Input
                  label="Width (m)"
                  placeholder="e.g., 2.5"
                  keyboardType="numeric"
                  value={formData.width}
                  onChangeText={(text) => handleInputChange('width', text)}
                  leftIcon={<Car size={20} color={theme.colors.neutral[500]} />}
                />
              </View>
              
              <View style={styles.halfInput}>
                <Input
                  label="Length (m)"
                  placeholder="e.g., 5.0"
                  keyboardType="numeric"
                  value={formData.length}
                  onChangeText={(text) => handleInputChange('length', text)}
                  leftIcon={<Car size={20} color={theme.colors.neutral[500]} />}
                />
              </View>
            </View>
          </Animated.View>
          
          <Animated.View 
            style={styles.formSection}
            entering={FadeInDown.delay(600).duration(800)}
          >
            <Text style={styles.sectionTitle}>Availability & Pricing</Text>
            
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Input
                  label="Available From"
                  placeholder="YYYY-MM-DD"
                  value={formData.availableFrom}
                  onChangeText={(text) => handleInputChange('availableFrom', text)}
                  leftIcon={<Calendar size={20} color={theme.colors.neutral[500]} />}
                />
              </View>
              
              <View style={styles.halfInput}>
                <Input
                  label="Available To"
                  placeholder="YYYY-MM-DD"
                  value={formData.availableTo}
                  onChangeText={(text) => handleInputChange('availableTo', text)}
                  leftIcon={<Calendar size={20} color={theme.colors.neutral[500]} />}
                />
              </View>
            </View>
            
            <Input
              label="Price per Hour ($)"
              placeholder="e.g., 4.99"
              keyboardType="numeric"
              value={formData.pricePerHour}
              onChangeText={(text) => handleInputChange('pricePerHour', text)}
              leftIcon={<DollarSign size={20} color={theme.colors.neutral[500]} />}
            />
          </Animated.View>
          
          <Animated.View 
            style={[styles.formSection, styles.lastSection]}
            entering={FadeInDown.delay(700).duration(800)}
          >
            <Button
              title="List Parking Spot"
              onPress={handleSubmit}
              isLoading={isLoading}
              size="lg"
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing['4'],
  },
  header: {
    marginTop: theme.spacing['4'],
    marginBottom: theme.spacing['6'],
  },
  headerTitle: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes['2xl'],
    color: theme.colors.neutral[900],
  },
  headerSubtitle: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[600],
    marginTop: theme.spacing['1'],
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.error[50],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing['4'],
    marginBottom: theme.spacing['4'],
  },
  errorText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.error[700],
    marginLeft: theme.spacing['2'],
    flex: 1,
  },
  formSection: {
    marginBottom: theme.spacing['6'],
  },
  lastSection: {
    marginBottom: theme.spacing['20'],
  },
  sectionTitle: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing['3'],
  },
  textArea: {
    height: 100,
    paddingTop: theme.spacing['3'],
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
});