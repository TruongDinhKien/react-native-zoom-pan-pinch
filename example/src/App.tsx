import { Text, View, StyleSheet } from 'react-native';
import {
  RNTransformComponent,
  RNZoomPanPinchContext,
} from 'react-native-zoom-pan-pinch';

export default function App() {
  return (
    <View style={styles.container}>
      <RNZoomPanPinchContext>
        <RNTransformComponent>
          <Text>Result:</Text>
        </RNTransformComponent>
      </RNZoomPanPinchContext>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
