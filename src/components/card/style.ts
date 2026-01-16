import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    maxWidth: 400,
    marginBottom: 40,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 4 / 5,
    overflow: 'hidden',
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionsOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
    gap: 8,
  },
  btnEdit: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  btnDelete: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBtn: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  iconBtnWhite: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  contentContainer: {
    gap: 8,
  },
  date: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#a3a3a3',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    color: '#000',
    letterSpacing: -0.3,
  },
  location: {
    fontSize: 13,
    color: '#737373',
    fontWeight: '400',
  },
});

export default styles;