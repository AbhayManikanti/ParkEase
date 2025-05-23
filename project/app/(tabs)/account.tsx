import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView 
} from 'react-native';
import { useAuth } from '../../contexts/auth-context';
import { theme } from '../../utils/theme';
import { User, LogOut, Mail, Phone, ChevronRight, CreditCard, Car, Bell, ShieldCheck, CircleHelp as HelpCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

export default function AccountScreen() {
  const { user, logout, updateProfile } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleBecomeHost = async () => {
    if (user) {
      await updateProfile({ isHost: true });
      Alert.alert(
        'Success',
        'You are now a host!',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={styles.header}
          entering={FadeInDown.delay(200).duration(800)}
        >
          <Text style={styles.headerTitle}>Account</Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.profileCard}
          entering={FadeInDown.delay(300).duration(800)}
        >
          <View style={styles.profileIconContainer}>
            <User size={32} color={theme.colors.primary[500]} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            
            <View style={styles.profileDetail}>
              <Mail size={16} color={theme.colors.neutral[500]} />
              <Text style={styles.profileDetailText}>{user?.email}</Text>
            </View>
            
            {user?.phone && (
              <View style={styles.profileDetail}>
                <Phone size={16} color={theme.colors.neutral[500]} />
                <Text style={styles.profileDetailText}>{user.phone}</Text>
              </View>
            )}
            
            {user?.isHost && (
              <View style={styles.hostBadge}>
                <Text style={styles.hostBadgeText}>Host</Text>
              </View>
            )}
          </View>
        </Animated.View>
        
        <Animated.View 
          style={styles.section}
          entering={FadeInDown.delay(400).duration(800)}
        >
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <View style={styles.menuCard}>
            {!user?.isHost && (
              <TouchableOpacity style={styles.menuItem} onPress={handleBecomeHost}>
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.success[50] }]}>
                    <Car size={18} color={theme.colors.success[500]} />
                  </View>
                  <Text style={styles.menuItemText}>Become a Host</Text>
                </View>
                <ChevronRight size={20} color={theme.colors.neutral[400]} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.primary[50] }]}>
                  <CreditCard size={18} color={theme.colors.primary[500]} />
                </View>
                <Text style={styles.menuItemText}>Payment Methods</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.neutral[400]} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.warning[50] }]}>
                  <Bell size={18} color={theme.colors.warning[500]} />
                </View>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.neutral[400]} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.error[50] }]}>
                  <ShieldCheck size={18} color={theme.colors.error[500]} />
                </View>
                <Text style={styles.menuItemText}>Privacy & Security</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.neutral[400]} />
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <Animated.View 
          style={styles.section}
          entering={FadeInDown.delay(500).duration(800)}
        >
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.neutral[100] }]}>
                  <HelpCircle size={18} color={theme.colors.neutral[600]} />
                </View>
                <Text style={styles.menuItemText}>Help Center</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.neutral[400]} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.logoutItem]} 
              onPress={handleLogout}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.error[50] }]}>
                  <LogOut size={18} color={theme.colors.error[500]} />
                </View>
                <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>Park Ease v1.0.0</Text>
        </View>
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
    marginBottom: theme.spacing['4'],
  },
  headerTitle: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes['2xl'],
    color: theme.colors.neutral[900],
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing['4'],
    marginBottom: theme.spacing['6'],
    ...theme.shadows.md,
  },
  profileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing['4'],
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes.xl,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing['2'],
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing['1'],
  },
  profileDetailText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[600],
    marginLeft: theme.spacing['2'],
  },
  hostBadge: {
    backgroundColor: theme.colors.success[50],
    paddingHorizontal: theme.spacing['2'],
    paddingVertical: theme.spacing['1'],
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: theme.spacing['2'],
  },
  hostBadgeText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.success[700],
  },
  section: {
    marginBottom: theme.spacing['6'],
  },
  sectionTitle: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing['3'],
  },
  menuCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing['3'],
  },
  menuItemText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[800],
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: theme.colors.error[600],
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing['6'],
    marginBottom: theme.spacing['20'],
  },
  versionText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[500],
  },
});