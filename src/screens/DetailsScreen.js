import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { fetchMetalDetails } from '../api/mockApi';
import { formatCurrency, formatDate, formatTime } from '../utils/format';

export default function DetailsScreen({ route, navigation }) {
  const { metal } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetchMetalDetails(metal);
      setData(res);
    } catch (e) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [metal]);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{metal.toUpperCase()} • {data?.symbol || ''}</Text>
          {loading ? <ActivityIndicator/> : null}
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={load} style={styles.retryBtn}><Text style={styles.retryTxt}>Retry</Text></Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.mainPrice}>{loading ? '—' : formatCurrency(data?.karat24Price)}</Text>
            {!loading && (
              <Text style={styles.sub}>
                24K • Updated {formatDate(data?.lastUpdated)} at {formatTime(data?.lastUpdated)}
              </Text>
            )}

            <View style={styles.grid}>
              <Info label="Open" value={loading ? '—' : formatCurrency(data?.open)} />
              <Info label="Close" value={loading ? '—' : formatCurrency(data?.close)} />
              <Info label="Previous Close" value={loading ? '—' : formatCurrency(data?.previousClose)} />
              <Info label="Day High" value={loading ? '—' : formatCurrency(data?.dayHigh)} />
              <Info label="Day Low" value={loading ? '—' : formatCurrency(data?.dayLow)} />
              <Info label="Change" value={loading ? '—' : `${(data?.change ?? 0) >= 0 ? '▲' : '▼'} ${formatCurrency(Math.abs(data?.change ?? 0))} (${(data?.changePercent ?? 0).toFixed(2)}%)`} />
              <Info label="Exchange" value={loading ? '—' : data?.exchange} />
              <Info label="Date" value={loading ? '—' : `${formatDate(data?.date)}`} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  mainPrice: { fontSize: 36, fontWeight: '900', marginTop: 8 },
  sub: { color: '#666', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 },
  infoItem: { width: '50%', paddingVertical: 10, paddingRight: 12 },
  infoLabel: { color: '#666', fontSize: 12 },
  infoValue: { fontSize: 16, fontWeight: '700' },
  errorBox: { backgroundColor: '#FDECEA', borderRadius: 12, padding: 12, marginTop: 16 },
  errorText: { color: '#B00020', marginBottom: 8 },
  retryBtn: { alignSelf: 'flex-start', backgroundColor: '#B00020', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  retryTxt: { color: '#fff', fontWeight: '700' }
});
