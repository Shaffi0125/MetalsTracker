import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import MetalTile from '../components/MetalTile';

const METALS = ['gold', 'silver', 'platinum', 'palladium'];

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  //****
  const [refreshSignal, setRefreshSignal] = React.useState(0); //this will force tiles to refetch
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshSignal((n) => n+1); //notify tiles to reload
    setLastUpdated(new Date()); //update header time
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    //****
    <View style={styles.header}>
        <Text style={styles.heading}>Live Precious Metals</Text>
        <Text style={styles.title}>
             Updated {lastUpdated.toLocaleTimeString()}
        </Text>
    </View>

      <FlatList
        data={METALS}
        keyExtractor={(item) => item}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <MetalTile
            metal={item}
            refreshSignal={refreshSignal}
            onPress={(metal) => navigation.navigate('Details', { metal })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  title: { fontSize: 13, color: '#666', marginLeft: 15 },
  heading: { fontSize: 21, fontWeight: '800', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }
});
