import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  disabledCard: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  disabledTitle: {
    marginBottom: 8,
    color: '#F8FAFC',
  },
  disabledText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginBottom: 20,
  },
  cancelBtn: {
    width: '100%',
  },
});
