import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  content: {
    position: 'relative',
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 40 },
    shadowOpacity: 0.2,
    shadowRadius: 50,
    elevation: 20,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 40,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28.8,
    fontWeight: '300',
    letterSpacing: -0.576,
    color: '#000',
  },
  btnClose: {
    padding: 8,
    backgroundColor: 'transparent',
    borderRadius: 50,
  },
  iconClose: {
    width: 24,
    height: 24,
  },
  form: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    gap: 24,
  },
  formGroup: {
    gap: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#a3a3a3',
    marginLeft: 4,
  },
  input: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 16,
    fontSize: 14,
    color: '#000',
  },
  inputSmall: {
    fontSize: 11,
  },
  inputFocused: {
    backgroundColor: '#fff',
    borderColor: '#000',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formRowMobile: {
    flexDirection: 'column',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 24,
  },
  btnSubmit: {
    flex: 2,
    height: 64,
    backgroundColor: '#000',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSubmitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnSubmitDisabled: {
    opacity: 0.3,
  },
  btnCancel: {
    flex: 1,
    height: 64,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelText: {
    color: '#737373',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default styles;