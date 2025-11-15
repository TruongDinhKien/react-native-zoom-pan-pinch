import { Button, StyleSheet, View } from 'react-native';
import {
  ZoomPanPinchView,
  ZoomPanPinchContext,
  useControls,
} from 'react-native-zoom-pan-pinch';

export const Controls = () => {
  const { zoomIn, zoomOut, reset } = useControls();

  return (
    <View style={styles.buttonGroup}>
      <Button title="Zoom In" onPress={() => zoomIn()} />
      <Button title="Zoom Out" onPress={() => zoomOut()} />
      <Button title="Zoom Reset" onPress={() => reset()} />
    </View>
  );
};

export default function Test() {
  return (
    <View style={styles.container}>
      <ZoomPanPinchContext>
        <Controls />
        <ZoomPanPinchView>
          <View style={styles.box}>
            <View style={styles.innerBox} />
          </View>
        </ZoomPanPinchView>
      </ZoomPanPinchContext>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
    height: 400,
    width: 400,
  },
  innerBox: { backgroundColor: 'blue', height: 100, width: 100 },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
