import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
    maxHeight: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
  },
});
