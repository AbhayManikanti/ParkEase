import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';
import { ParkingSlot } from '../types';
import { router } from 'expo-router';
import { MapPin, Car, Star, IndianRupee } from 'lucide-react-native';


interface ParkingSlotCardProps {
  parkingSlot: ParkingSlot;
}

const ParkingSlotCard: React.FC<ParkingSlotCardProps> = ({ parkingSlot }) => {
  const handlePress = () => {
    router.push(`/slot/${parkingSlot.id}`);
  };

  // Format date range for display
  const formatDateRange = () => {
    const startDate = new Date(parkingSlot.availableFrom);
    const endDate = new Date(parkingSlot.availableTo);
    
    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const endMonth = endDate.toLocaleString('default', { month: 'short' });
    
    return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <View style={styles.slotBox}>
        <View style={styles.dimensionsContainer}>
          <Car size={24} color={theme.colors.primary[500]} />
          <Text style={styles.dimensions}>
            {parkingSlot.dimensions.width.toFixed(1)} × {parkingSlot.dimensions.length.toFixed(1)} m
          </Text>
          
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{parkingSlot.title}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={theme.colors.warning[500]} fill={theme.colors.warning[500]} />
            <Text style={styles.rating}>{parkingSlot.rating}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MapPin size={16} color={theme.colors.neutral[500]} />
          <Text style={styles.locationText} numberOfLines={2}>{parkingSlot.address}</Text>
        </View>

        <View style={styles.amenitiesContainer}>
          {parkingSlot.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <IndianRupee size={16} color={theme.colors.primary[600]} />
            <Text style={styles.price}>{parkingSlot.pricePerHour}</Text>
            <Text style={styles.priceUnit}>/hour</Text>
          </View>
          <Text style={styles.availability}>Available: {formatDateRange()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing['4'],
    ...theme.shadows.md,
  },
  slotBox: {
    backgroundColor: theme.colors.primary[50],
    padding: theme.spacing['4'],
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary[100],
  },
  dimensionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing['2'],
  },
  dimensions: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.primary[700],
  },
  content: {
    padding: theme.spacing['4'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing['2'],
  },
  title: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.neutral[900],
    flex: 1,
    marginRight: theme.spacing['2'],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning[50],
    paddingHorizontal: theme.spacing['2'],
    paddingVertical: theme.spacing['1'],
    borderRadius: theme.borderRadius.full,
  },
  rating: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.warning[700],
    marginLeft: theme.spacing['1'],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing['3'],
  },
  locationText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[600],
    marginLeft: theme.spacing['2'],
    flex: 1,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing['2'],
    marginBottom: theme.spacing['3'],
  },
  amenityTag: {
    backgroundColor: theme.colors.primary[50],
    paddingHorizontal: theme.spacing['2'],
    paddingVertical: theme.spacing['1'],
    borderRadius: theme.borderRadius.full,
  },
  amenityText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.primary[700],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing['2'],
    paddingTop: theme.spacing['3'],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[100],
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes.xl,
    color: theme.colors.primary[600],
    marginLeft: theme.spacing['1'],
  },
  priceUnit: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[500],
    marginLeft: theme.spacing['1'],
  },
  availability: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[600],
  },
});

export default ParkingSlotCard;