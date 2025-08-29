import React, { useEffect, useState, useCallback } from 'react';
import { Pressable, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchMetalSnapshot } from '../api/mockApi';
import { formatCurrency, formatTime } from '../utils/format';
import { Colors, Shadows, Spacing } from '../utils/theme';

const GRADIENTS = {
  gold: ['#fff8dc', '#ffd700'],
  silver: ['#f0f0f0', '#c0c0c0'],
  platinum: ['#e5e4e2', '#bcc6cc'],
  palladium: ['#eaf4fc', '#aebfcf'],
};

const ICONS = {
  gold: 'gold',
  silver: 'silverware-variant',
  platinum: 'ring',
  palladium: 'diamond-stone',
};

export default function MetalTile({ metal, onPress, refreshSignal }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
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
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (refreshSignal) load();
  }, [refreshSignal, load]);

  // choose gradient
  const gradientColors = GRADIENTS[metal] || ['#ffffff', '#f8fbff'];
  const icon = ICONS[metal] || 'chart-line';

  return (
    <Pressable
      onPress={() => !loading && !error && onPress?.(metal)}
      android_ripple={{ color: '#eaeaea' }}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && { transform: [{ scale: 0.99 }], opacity: 0.95 },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, Shadows.card]}
      >
        <View style={styles.rowTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={Colors.brand}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.symbol}>{metal.toUpperCase()}</Text>
          </View>

          {!loading && !error && (
            <View style={[styles.pill, (data?.change ?? 0) >= 0 ? styles.pillUp : styles.pillDown]}>
              <Text style={styles.pillText}>
                {(data?.change ?? 0) >= 0 ? '▲' : '▼'} {(data?.changePercent ?? 0).toFixed(2)}%
              </Text>
            </View>
          )}
        </View>

        <View style={{ marginTop: 10, minHeight: 34 }}>
          {loading ? (
            <ActivityIndicator />
          ) : error ? (
            <Pressable onPress={load}>
              <Text style={styles.error}>Tap to retry</Text>
            </Pressable>
          ) : (
            <Text style={styles.price}>
              {data?.karat24Price != null ? formatCurrency(data.karat24Price) : (data?.close != null ? formatCurrency(data.close) : '--')}
            </Text>
          )}
        </View>

        <View style={styles.rowBottom}>
          <Text style={styles.sub}>
            {data?.lastUpdated ? `Updated ${formatTime(new Date(data.lastUpdated))}` : ''}
          </Text>

          {!loading && !error && (
            <Text style={[styles.delta, (data?.change ?? 0) >= 0 ? styles.up : styles.down]}>
              {formatCurrency(Math.abs(data?.change ?? 0))}
            </Text>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const TILE_H = 120;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: TILE_H,
    marginBottom: 12,
  },

  card: {
    borderRadius: 16,
    padding: Spacing.cardPad ?? 12,
    borderWidth: 1,
    borderColor: Colors.border ?? 'rgba(0,0,0,0.06)',
    backgroundColor: 'transparent',
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symbol: { fontSize: 14, fontWeight: '800', color: Colors.text },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillUp: { backgroundColor: 'rgba(46,125,50,0.10)' },
  pillDown: { backgroundColor: 'rgba(198,40,40,0.08)' },
  pillText: { fontSize: 12, fontWeight: '700', color: Colors.text },
  price: { fontSize: 22, fontWeight: '900', color: Colors.text, marginTop: 6 },
  rowBottom: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sub: { color: Colors.subtext, fontSize: 12 },
  delta: { fontSize: 14, fontWeight: '800' },
  up: { color: Colors.up ?? '#2e7d32' },
  down: { color: Colors.down ?? '#c62828' },
  error: { color: Colors.down ?? '#c62828', fontWeight: '700' },
});
