import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { BookOpen, Camera, Heart, Home, Utensils } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

interface TabIconProps {
  icon: React.ReactNode;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>{icon}</View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Home size={22} color={focused ? Colors.primary : Colors.textMuted} strokeWidth={focused ? 2.5 : 1.8} />}
              label="Ana Sayfa"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="beslenme"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Utensils size={22} color={focused ? Colors.primary : Colors.textMuted} strokeWidth={focused ? 2.5 : 1.8} />}
              label="Beslenme"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ruh-hali"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Heart size={22} color={focused ? Colors.primary : Colors.textMuted} strokeWidth={focused ? 2.5 : 1.8} />}
              label="Ruh Hali"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notlar"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<BookOpen size={22} color={focused ? Colors.primary : Colors.textMuted} strokeWidth={focused ? 2.5 : 1.8} />}
              label="Notlar"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="galeri"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Camera size={22} color={focused ? Colors.primary : Colors.textMuted} strokeWidth={focused ? 2.5 : 1.8} />}
              label="Anılar"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    height: 72,
    paddingBottom: 8,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconWrapper: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  iconWrapperActive: {
    backgroundColor: Colors.primaryLight,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
