import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import { useParking } from '../../contexts/parking-context';
import { theme } from '../../utils/theme';
import BookingCard from '../../components/BookingCard';
import { Calendar, CircleAlert as AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BookingsScreen() {
  const { getUserBookings, cancelBooking } = useParking();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const userBookings = getUserBookings();
  const address = '1600 Amphitheatre Parkway, Mountain View, CA';
  
  // Split bookings into upcoming and past
  const upcomingBookings = userBookings.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'pending'
  );
  
  const pastBookings = userBookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'cancelled'
  );
  
  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleCancelBooking = async (bookingId: string) => {
    await cancelBooking(bookingId);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // In a real app, you would fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View 
          style={styles.header}
          entering={FadeInDown.delay(200).duration(800)}
        >
          <Text style={styles.headerTitle}>Your Bookings</Text>
          
        </Animated.View>
        
        <Animated.View 
          style={styles.tabsContainer}
          entering={FadeInDown.delay(300).duration(800)}
        >
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'upcoming' ? styles.activeTab : null
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'upcoming' ? styles.activeTabText : null
              ]}
            >
              Upcoming
            </Text>
            {upcomingBookings.length > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{upcomingBookings.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'past' ? styles.activeTab : null
            ]}
            onPress={() => setActiveTab('past')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'past' ? styles.activeTabText : null
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        <FlatList
          data={displayedBookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInDown.delay(400 + index * 100).duration(800)}
            >
              <BookingCard 
                booking={item} 
                onCancel={handleCancelBooking} 
              />
            </Animated.View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <Animated.View 
              style={styles.emptyContainer}
              entering={FadeInDown.delay(400).duration(800)}
            >
              {activeTab === 'upcoming' ? (
                <>
                  <Calendar size={48} color={theme.colors.neutral[300]} />
                  <Text style={styles.emptyText}>No upcoming bookings</Text>
                  <Text style={styles.emptySubtext}>
                    Browse available parking spots to make a reservation
                  </Text>
                </>
              ) : (
                <>
                  <AlertCircle size={48} color={theme.colors.neutral[300]} />
                  <Text style={styles.emptyText}>No past bookings</Text>
                  <Text style={styles.emptySubtext}>
                    Your booking history will appear here
                  </Text>
                </>
              )}
            </Animated.View>
          }
        />
      </View>
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
    marginBottom: theme.spacing['4'],
  },
  headerTitle: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes['2xl'],
    color: theme.colors.neutral[900],
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing['3'],
    marginRight: theme.spacing['6'],
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary[500],
  },
  tabText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[600],
  },
  activeTabText: {
    color: theme.colors.primary[500],
    fontFamily: theme.fontFamily.bold,
  },
  badgeContainer: {
    backgroundColor: theme.colors.primary[500],
    borderRadius: 99,
    paddingHorizontal: theme.spacing['2'],
    paddingVertical: theme.spacing['0.5'],
    marginLeft: theme.spacing['2'],
  },
  badgeText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.white,
  },
  listContent: {
    paddingBottom: theme.spacing['20'],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing['8'],
    marginTop: theme.spacing['8'],
  },
  emptyText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.neutral[700],
    marginTop: theme.spacing['4'],
  },
  emptySubtext: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing['2'],
    textAlign: 'center',
  },
});