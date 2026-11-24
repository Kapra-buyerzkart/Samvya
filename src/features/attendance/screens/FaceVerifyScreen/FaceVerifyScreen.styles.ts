import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  disabledContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  disabledCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0F172A',
    alignItems: 'center',
  },
  disabledTitle: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#F8FAFC',
  },
  disabledText: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    color: '#94A3B8',
  },
  actionBtn: {
    width: '100%',
    marginBottom: 10,
  },
});
