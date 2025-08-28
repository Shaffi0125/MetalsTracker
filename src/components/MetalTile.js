import React, { useEffect, useState, useCallback } from 'react';
import { Pressable, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchMetalSnapshot } from '../api/mockApi';
import { formatCurrency, formatTime } from '../utils/format';

export default function MetalTile({ metal, onPress }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetchMetalSnapshot(metal);
      setData(res);
    } catch (e) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [metal]);

  useEffect(() => {
    load();
    const id = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(id);
  }, [load]);

  return (
    <Pressable onPress={() => onPress?.(metal)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <Text style={styles.title}>{metal.toUpperCase()}</Text>
        {loading ? <ActivityIndicator /> : error ? <Text style={styles.error}>!</Text> : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.price}>
          {loading ? '—' : error ? 'Error' : formatCurrency(data?.karat24Price)}
        </Text>
        <Text style={styles.sub}>
          {loading ? 'loading…' : error ? 'tap to retry' : `24K • ${data?.symbol}`}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.time}>
          {loading || error ? '' : `Updated ${formatTime(new Date(data?.lastUpdated))}`}
        </Text>
        {!loading && !error && (
          <Text style={[styles.change, (data?.change ?? 0) >= 0 ? styles.up : styles.down]}>
            {(data?.change ?? 0) >= 0 ? '▲' : '▼'} { (data?.changePercent ?? 0).toFixed(2) }%
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 12
  },
  pressed: { opacity: 0.9 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  error: { color: '#B00020', fontWeight: 'bold' },
  body: { marginTop: 8 },
  price: { fontSize: 24, fontWeight: '800' },
  sub: { color: '#666', marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  time: { color: '#666' },
  change: { fontWeight: '700' },
  up: { color: '#2e7d32' },
  down: { color: '#c62828' }
});
