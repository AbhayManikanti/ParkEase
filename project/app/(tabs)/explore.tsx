import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { useParking } from '../../contexts/parking-context';
import { theme } from '../../utils/theme';
import ParkingSlotCard from '../../components/ParkingSlotCard';
import { Search, Filter, MapPin } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ExploreScreen() {
  const { parkingSlots } = useParking();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSlots, setFilteredSlots] = useState(parkingSlots);
  const [activeFilter, setActiveFilter] = useState('all');

  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredSlots(parkingSlots);
    } else {
      const filtered = parkingSlots.filter(slot => 
        slot.title.toLowerCase().includes(text.toLowerCase()) ||
        slot.address.toLowerCase().includes(text.toLowerCase()) ||
        slot.description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSlots(filtered);
    }
  };

  // Apply filter
  const applyFilter = (filter: string) => {
    setActiveFilter(filter);
    
    switch (filter) {
      case 'all':
        setFilteredSlots(parkingSlots);
        break;
      case 'price_low':
        setFilteredSlots([...parkingSlots].sort((a, b) => a.pricePerHour - b.pricePerHour));
        break;
      case 'price_high':
        setFilteredSlots([...parkingSlots].sort((a, b) => b.pricePerHour - a.pricePerHour));
        break;
      case 'rating':
        setFilteredSlots([...parkingSlots].sort((a, b) => (b.rating || 0) - (a.rating || 0)));
        break;
      default:
        setFilteredSlots(parkingSlots);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View 
          style={styles.header}
          entering={FadeInDown.delay(200).duration(800)}
        >
          <Text style={styles.headerTitle}>Find Parking</Text>
          <Text style={styles.headerSubtitle}>Discover available parking spots</Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.searchContainer}
          entering={FadeInDown.delay(300).duration(800)}
        >
          <View style={styles.searchInputContainer}>
            <Search size={20} color={theme.colors.neutral[500]} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by location or name"
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor={theme.colors.neutral[400]}
            />
          </View>
          
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={theme.colors.neutral[700]} />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View 
          style={styles.filterOptions}
          entering={FadeInDown.delay(400).duration(800)}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip 
              label="All" 
              active={activeFilter === 'all'} 
              onPress={() => applyFilter('all')} 
            />
            <FilterChip 
              label="Lowest Price" 
              active={activeFilter === 'price_low'} 
              onPress={() => applyFilter('price_low')} 
            />
            <FilterChip 
              label="Highest Price" 
              active={activeFilter === 'price_high'} 
              onPress={() => applyFilter('price_high')} 
            />
            <FilterChip 
              label="Top Rated" 
              active={activeFilter === 'rating'} 
              onPress={() => applyFilter('rating')} 
            />
          </ScrollView>
        </Animated.View>
        
        <FlatList
          data={filteredSlots}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInDown.delay(500 + index * 100).duration(800)}
            >
              <ParkingSlotCard parkingSlot={item} />
            </Animated.View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MapPin size={48} color={theme.colors.neutral[300]} />
              <Text style={styles.emptyText}>No parking spots found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

// Filter Chip Component
import { ScrollView } from 'react-native-gesture-handler';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        active ? styles.activeFilterChip : null,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterChipText,
          active ? styles.activeFilterChipText : null,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

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
  headerSubtitle: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[600],
    marginTop: theme.spacing['1'],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing['4'],
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing['3'],
    height: 48,
    marginRight: theme.spacing['2'],
  },
  searchIcon: {
    marginRight: theme.spacing['2'],
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[900],
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterOptions: {
    marginBottom: theme.spacing['4'],
  },
  filterChip: {
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['2'],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral[100],
    marginRight: theme.spacing['2'],
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary[500],
  },
  filterChipText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[700],
  },
  activeFilterChipText: {
    color: theme.colors.white,
  },
  listContent: {
    paddingBottom: theme.spacing['20'],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing['8'],
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
  },
});