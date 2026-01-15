import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BottomNavBarProps {
  activeTab?: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab }) => {
    if(!activeTab){
        activeTab="Home";
    }
  const router = useRouter();

  interface NavItemProps {
    iconName: string;
    label: string;
    isCenter?: boolean;
    route: string;
  }

  const NavItem: React.FC<NavItemProps> = ({ iconName, label, isCenter, route }) => {
    const isActive = activeTab === label;
    
    const handlePress = () => {
      router.push(route as any);
    };
    
    if (isCenter) {
      return (
        <TouchableOpacity 
        style={[
            styles.centerButton,
          ]}
          onPress={handlePress}
        >
          <View style={[styles.centerIconContainer , isActive && { backgroundColor: '#000' }]}>
            <Ionicons name={iconName} size={28}  color={isActive ? '#fff' : '#999'} />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.navItem}
        onPress={handlePress}
      >
        <Ionicons 
          name={iconName} 
          size={24} 
          color={isActive ? '#000' : '#999'} 
        />
        <Text style={[
          styles.label,
          isActive && styles.activeLabel
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.navBar}>
      <NavItem iconName="home-outline" label="Home" route="/home" />
      <NavItem iconName="grid-outline" label="Categories" route="/categories" />
      <NavItem iconName="sparkles-outline" label="AiDiscover" isCenter route="/exploreAi" />
      <NavItem iconName="gift-outline" label="Gifting" route="/gift" />
      <NavItem iconName="person-outline" label="Profile" route="/profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  centerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  centerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#c0c0c0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#000',
    fontWeight: '600',
  },
});

export default BottomNavBar;