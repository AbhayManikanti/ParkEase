import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useParking } from '../../contexts/parking-context';
import { theme } from '../../utils/theme';
import Button from '../../components/ui/Button';
import { 
  MapPin, 
  Clock, 
  Car, 
  IndianRupee, 
  Star, 
  ArrowLeft,
  Calendar,
  User
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import GoogleMapView from '../../components/GoogleMapView';

export default function ParkingSlotDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getParkingSlotById, createBooking } = useParking();
  
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoursToBook, setHoursToBook] = useState(2);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  const parkingSlot = getParkingSlotById(id as string);
  
  if (!parkingSlot) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen 
          options={{
            headerShown: true,
            headerTitle: 'Not Found',
            headerBackTitle: 'Back',
          }}
        />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Parking spot not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date range for display
  const formatDateRange = () => {
    const startDate = new Date(parkingSlot.availableFrom);
    const endDate = new Date(parkingSlot.availableTo);
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const calculateTotalPrice = () => {
    return parkingSlot.pricePerHour * hoursToBook;
  };

  const handleBookNow = () => {
    // Set initial date to next hour
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    setSelectedDate(nextHour);
    setShowBookingForm(true);
  };

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    
    try {
      // Calculate start and end time
      const startTime = new Date(selectedDate);
      const endTime = new Date(selectedDate);
      endTime.setHours(endTime.getHours() + hoursToBook);

      // Validate booking time
      const now = new Date();
      if (startTime < now) {
        throw new Error('Cannot book for past time');
      }

      const availableFrom = new Date(parkingSlot.availableFrom);
      const availableTo = new Date(parkingSlot.availableTo);
      
      if (startTime < availableFrom || endTime > availableTo) {
        throw new Error('Selected time is outside available period');
      }
      
      const booking = await createBooking(
        parkingSlot.id,
        startTime.toISOString(),
        endTime.toISOString()
      );
      
      if (booking) {
        Alert.alert(
          'Booking Confirmed',
          `You have successfully booked this parking spot from ${formatDate(startTime)} to ${formatDate(endTime)}.`,
          [
            {
              text: 'View Bookings',
              onPress: () => router.push('/bookings'),
            },
            {
              text: 'OK',
              onPress: () => router.back(),
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Booking Failed', error instanceof Error ? error.message : 'There was an error processing your booking. Please try again.');
    } finally {
      setIsBooking(false);
      setShowBookingForm(false);
    }
  };

  const handleDecrementHours = () => {
    if (hoursToBook > 1) {
      setHoursToBook(hoursToBook - 1);
    }
  };

  const handleIncrementHours = () => {
    if (hoursToBook < 24) {
      setHoursToBook(hoursToBook + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerBackTitle: 'Back',
          headerTintColor: theme.colors.white,
        }}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: parkingSlot.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <Animated.View 
          style={styles.contentContainer}
          entering={FadeInDown.delay(200).duration(800)}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{parkingSlot.title}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={theme.colors.warning[500]} fill={theme.colors.warning[500]} />
              <Text style={styles.rating}>{parkingSlot.rating}</Text>
              <Text style={styles.reviewCount}>({parkingSlot.reviewCount} reviews)</Text>
            </View>
          </View>

          <View style={styles.searchBarContainer}>
            {/* Map and Details in a row */}
            <View style={styles.rowContainer}>
              {/* Left: Details and Book Button (50%) */}
              <View style={styles.leftInfoColumn}>
                <View style={styles.detailsColumn}>
                  <View style={styles.infoItem}>
                    <MapPin size={22} color={theme.colors.neutral[600]} />
                    <Text style={[styles.infoText, {flexShrink: 1}]}>{parkingSlot.address}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Car size={22} color={theme.colors.neutral[600]} />
                    <Text style={styles.infoText}>
                      {parkingSlot.dimensions.width.toFixed(1)} × {parkingSlot.dimensions.length.toFixed(1)} meters
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Clock size={22} color={theme.colors.neutral[600]} />
                    <Text style={[styles.infoText, {flexShrink: 1}]}>Available: {formatDateRange()}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <IndianRupee size={22} color={theme.colors.neutral[600]} />
                    <Text style={styles.infoText}>
                      <Text style={styles.priceHighlight}>₹{parkingSlot.pricePerHour}</Text> per hour
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <User size={22} color={theme.colors.neutral[600]} />
                    <Text style={styles.infoText}>Hosted by {parkingSlot.hostName}</Text>
                  </View>
                </View>
                <View style={styles.bookButtonRow}>
                  <Button
                    title="Book Now"
                    onPress={handleBookNow}
                    size="lg"
                    style={styles.bookButtonSmaller}
                  />
                </View>
              </View>
              {/* Right: Map (50%) */}
              <View style={styles.rightMapColumn}>
                <Text style={styles.mapLabelXL}>Search Location:</Text>
                <View style={styles.mapContainerTaller}>
                  <GoogleMapView initialAddress={parkingSlot.address} />
                </View>
              </View>
            </View>
          </View>
          
          {/* Booking Form overlays the map/buttons when active */}
          {showBookingForm && (
            <Animated.View 
              style={styles.bookingFormOverlay}
              entering={FadeInDown.delay(300).duration(800)}
            >
              <Text style={styles.sectionTitle}>Confirm Booking</Text>
              <View style={styles.bookingFormRow}>
                <Text style={styles.bookingFormLabel}>Start Time:</Text>
                <Text style={styles.bookingFormValue}>
                  {formatDate(selectedDate)}
                </Text>
              </View>
              <View style={styles.bookingFormRow}>
                <Text style={styles.bookingFormLabel}>Duration:</Text>
                <View style={styles.hoursSelector}>
                  <TouchableOpacity 
                    style={styles.hoursSelectorButtonLarge}
                    onPress={handleDecrementHours}
                  >
                    <Text style={styles.hoursSelectorButtonTextLarge}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.hoursTextLarge}>{hoursToBook} hour{hoursToBook !== 1 ? 's' : ''}</Text>
                  <TouchableOpacity 
                    style={styles.hoursSelectorButtonLarge}
                    onPress={handleIncrementHours}
                  >
                    <Text style={styles.hoursSelectorButtonTextLarge}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.bookingFormRow}>
                <Text style={styles.bookingFormLabel}>End Time:</Text>
                <Text style={styles.bookingFormValue}>
                  {formatDate(new Date(selectedDate.getTime() + hoursToBook * 60 * 60 * 1000))}
                </Text>
              </View>
              <View style={styles.bookingFormRow}>
                <Text style={styles.bookingFormLabel}>Price per Hour:</Text>
                <Text style={styles.bookingFormValue}>₹{parkingSlot.pricePerHour}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <View style={styles.totalPriceContainer}>
                  <IndianRupee size={24} color={theme.colors.primary[600]} />
                  <Text style={styles.totalPrice}>{calculateTotalPrice()}</Text>
                </View>
              </View>
              <Button
                title="Confirm Booking"
                onPress={handleConfirmBooking}
                isLoading={isBooking}
                size="lg"
                style={styles.confirmButtonLarge}
              />
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowBookingForm(false)}
                size="lg"
                style={styles.cancelButtonLarge}
              />
            </Animated.View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{parkingSlot.description}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {parkingSlot.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
    container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.neutral[800],
  },
  reviewCount: {
    marginLeft: 4,
    fontSize: 14,
    color: theme.colors.neutral[600],
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 8,
  },
  searchBarContainer: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20, // wider search bar
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  leftInfoColumn: {
    flex: 1,
    minWidth: 0,
    maxWidth: '50%',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  rightMapColumn: {
    flex: 1,
    minWidth: 0,
    maxWidth: '50%',
    alignItems: 'flex-end',
  },
  mapLabelXL: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: theme.colors.neutral[700],
    alignSelf: 'flex-start',
  },
  mapContainerTaller: {
    width: '100%',
    minWidth: 160,
    height: 260, // increased height
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  rightColumn: {
    flex: 2,
    paddingLeft: 8,
    justifyContent: 'space-between',
  },
  detailsColumn: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.neutral[800],
  },
  priceHighlight: {
    fontWeight: 'bold',
    fontSize: 15,
    color: theme.colors.success[700],
  },
  bookButtonRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  bookButtonSmaller: {
    width: '100%',
  },
  bookingFormOverlay: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  bookingFormRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bookingFormLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.neutral[700],
  },
  bookingFormValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.neutral[900],
  },
  hoursSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursSelectorButtonLarge: {
    backgroundColor: theme.colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  hoursSelectorButtonTextLarge: {
    fontSize: 18,
    color: theme.colors.primary[700],
    fontWeight: 'bold',
  },
  hoursTextLarge: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.neutral[300],
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.neutral[800],
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary[600],
    marginLeft: 4,
  },
  confirmButtonLarge: {
    marginBottom: 12,
  },
  cancelButtonLarge: {
    marginBottom: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.neutral[900],
  },
  description: {
    fontSize: 14,
    color: theme.colors.neutral[700],
    lineHeight: 20,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    backgroundColor: theme.colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  amenityText: {
    fontSize: 13,
    color: theme.colors.primary[700],
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    color: theme.colors.neutral[700],
    textAlign: 'center',
  },
});