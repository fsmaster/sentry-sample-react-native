import React, { useEffect, useState } from 'react';
import { Button, Linking, StyleSheet, Text, View } from 'react-native';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://4df96bf8702522905150fe18c8d2ca0f@o4512264579579904.ingest.us.sentry.io/4512284738846720',
  environment: 'playground',
  tracesSampleRate: 1.0,
});

function formatPrice(cents: number, currency: string) {
  // Intl throws RangeError for a currency code it does not know
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

function sendError(run: string, fresh: boolean) {
  return Sentry.withScope(scope => {
    scope.setTag('run_id', run);
    if (fresh) {
      scope.setFingerprint(['{{ default }}', run]);
    }
    try {
      formatPrice(4999, 'EURO-' + run);
    } catch (e) {
      return Sentry.captureException(e);
    }
  });
}

function App() {
  const [status, setStatus] = useState('ready');

  useEffect(() => {
    // CI opens the app with sentrysample://run?id=<run>&fresh=true
    Linking.getInitialURL().then(async url => {
      const m = url && url.match(/id=([^&]+)(?:&fresh=(\w+))?/);
      if (!m) {
        return;
      }
      const id = sendError(m[1], m[2] !== 'false');
      await Sentry.flush();
      console.log('SentrySample event id: ' + id + ' run: ' + m[1]);
      setStatus('sent ' + id);
    });
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Sentry React Native sample</Text>
      <Button title="Send error" onPress={() => setStatus('sent ' + sendError('manual', true))} />
      <Text>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});

export default Sentry.wrap(App);
