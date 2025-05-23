import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';
import { Booking } from '../types';
import { Calendar, Clock, Car } from 'lucide-react-native';
import Button from './ui/Button';


interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  // Format date and time for display
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status color
  const getStatusColor = () => {
    switch (booking.status) {
      case 'confirmed':
        return {
          bg: theme.colors.success[50],
          text: theme.colors.success[700]
        };
      case 'pending':
        return {
          bg: theme.colors.warning[50],
          text: theme.colors.warning[700]
        };
      case 'completed':
        return {
          bg: theme.colors.primary[50],
          text: theme.colors.primary[700]
        };
      case 'cancelled':
        return {
          bg: theme.colors.error[50],
          text: theme.colors.error[700]
        };
      default:
        return {
          bg: theme.colors.neutral[50],
          text: theme.colors.neutral[700]
        };
    }
  };

  const statusColor = getStatusColor();
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  const handleCancel = () => {
    if (onCancel && canCancel) {
      onCancel(booking.id);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{booking.parkingSlotTitle}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
          <Text style={[styles.statusText, { color: statusColor.text }]}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={theme.colors.neutral[500]} />
          <Text style={styles.detailText}>
            {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Clock size={16} color={theme.colors.neutral[500]} />
          <Text style={styles.detailText}>
            {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Car size={16} color={theme.colors.neutral[500]} />
          <Text style={styles.detailLabel}>
            Booking ID: 
          </Text>
          <Text style={styles.detailText}>
            {booking.id}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${booking.totalPrice.toFixed(2)}</Text>
        </View>

        {canCancel && onCancel && (
          <Button 
            title="Cancel" 
            variant="outline" 
            size="sm"
            onPress={handleCancel}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing['4'],
    marginBottom: theme.spacing['4'],
    ...theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing['3'],
  },
  title: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.neutral[900],
    flex: 1,
    marginRight: theme.spacing['2'],
  },
  statusBadge: {
    paddingHorizontal: theme.spacing['2'],
    paddingVertical: theme.spacing['1'],
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.xs,
  },
  detailsContainer: {
    marginBottom: theme.spacing['3'],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing['2'],
  },
  detailLabel: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[700],
    marginLeft: theme.spacing['1'],
    marginRight: theme.spacing['1'],
  },
  detailText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[700],
    marginLeft: theme.spacing['1'],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing['3'],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[200],
  },
  totalLabel: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[600],
  },
  totalPrice: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.primary[600],
  },
});

export default BookingCard;