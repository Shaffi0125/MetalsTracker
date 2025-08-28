import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import MetalTile from '../components/MetalTile';

const METALS = ['gold', 'silver', 'platinum', 'palladium'];

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Live Precious Metals</Text>
      <FlatList
        data={METALS}
        keyExtractor={(m) => m}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <MetalTile
            metal={item}
            onPress={(metal) => navigation.navigate('Details', { metal })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  heading: { fontSize: 22, fontWeight: '800', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }
});
