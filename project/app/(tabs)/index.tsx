import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  FlatList
} from 'react-native';
import { useAuth } from '../../contexts/auth-context';
import { useParking } from '../../contexts/parking-context';
import { theme } from '../../utils/theme';
import ParkingSlotCard from '../../components/ParkingSlotCard';
import { MapPin, Car, Clock, TrendingUp } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HomeScreen() {
  const { user } = useAuth();
  const { parkingSlots, getUserBookings } = useParking();
  
  const userBookings = getUserBookings();
  const featuredSlots = parkingSlots.slice(0, 5);
  const upcomingBooking = userBookings.find(booking => 
    booking.status === 'confirmed' || booking.status === 'pending'
  );

  // Get the details of the upcoming booking's parking slot
  const upcomingBookingSlot = upcomingBooking 
    ? parkingSlots.find(slot => slot.id === upcomingBooking.parkingSlotId)
    : null;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Animated.View entering={FadeInDown.delay(200).duration(800)}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </Animated.View>
        </View>

        {upcomingBooking && upcomingBookingSlot && (
          <Animated.View 
            style={styles.upcomingBookingCard}
            entering={FadeInDown.delay(300).duration(800)}
          >
            <View style={styles.upcomingBookingHeader}>
              <Text style={styles.upcomingBookingTitle}>Upcoming Booking</Text>
              <View style={styles.upcomingBookingStatus}>
                <Text style={styles.upcomingBookingStatusText}>
                  {upcomingBooking.status.charAt(0).toUpperCase() + upcomingBooking.status.slice(1)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.upcomingBookingName}>{upcomingBookingSlot.title}</Text>
            
            <View style={styles.upcomingBookingDetails}>
              <View style={styles.upcomingBookingDetailItem}>
                <MapPin size={16} color={theme.colors.neutral[500]} />
                <Text style={styles.upcomingBookingDetailText}>{upcomingBookingSlot.address}</Text>
              </View>
              
              <View style={styles.upcomingBookingDetailItem}>
                <Clock size={16} color={theme.colors.neutral[500]} />
                <Text style={styles.upcomingBookingDetailText}>
                  {formatDate(upcomingBooking.startTime)}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        <Animated.View 
          style={styles.section}
          entering={FadeInDown.delay(400).duration(800)}
        >
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={theme.colors.primary[500]} />
            <Text style={styles.sectionTitle}>Featured Parking Spots</Text>
          </View>
          
          {featuredSlots.map((slot, index) => (
            <Animated.View 
              key={slot.id}
              entering={FadeInDown.delay(500 + index * 100).duration(800)}
            >
              <ParkingSlotCard parkingSlot={slot} />
            </Animated.View>
          ))}
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
    padding: theme.spacing['4'],
  },
  header: {
    marginTop: theme.spacing['4'],
    marginBottom: theme.spacing['6'],
  },
  welcomeText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.neutral[600],
  },
  userName: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes['2xl'],
    color: theme.colors.neutral[900],
  },
  upcomingBookingCard: {
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing['4'],
    marginBottom: theme.spacing['6'],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary[500],
  },
  upcomingBookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing['2'],
  },
  upcomingBookingTitle: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary[700],
  },
  upcomingBookingStatus: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing['2'],
    paddingVertical: theme.spacing['1'],
    borderRadius: theme.borderRadius.full,
  },
  upcomingBookingStatusText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.primary[700],
  },
  upcomingBookingName: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes.xl,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing['3'],
  },
  upcomingBookingDetails: {
    gap: theme.spacing['2'],
  },
  upcomingBookingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingBookingDetailText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[700],
    marginLeft: theme.spacing['2'],
  },
  section: {
    marginBottom: theme.spacing['6'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing['4'],
  },
  sectionTitle: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes.xl,
    color: theme.colors.neutral[900],
    marginLeft: theme.spacing['2'],
  },
});