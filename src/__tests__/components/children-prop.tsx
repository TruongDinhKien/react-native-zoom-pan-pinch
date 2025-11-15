import { StyleSheet, View } from 'react-native';
import {
  useControls,
  ZoomPanPinchContext,
  ZoomPanPinchView,
} from 'react-native-zoom-pan-pinch';
import { TEST_ID } from '../constants';
import { Controls } from './control';

const ControlWithContext = () => {
  const controls = useControls();

  return <Controls {...controls} />;
};

export default function RenderChild() {
  const boxTransformTestID = 'zoom-content-box';

  return (
    <ZoomPanPinchContext>
      <ControlWithContext />
      <ZoomPanPinchView
        wrapperProps={{
          testID: TEST_ID.WRAPPER,
        }}
        contentProps={{
          testID: TEST_ID.CONTENT,
        }}
      >
        <View style={styles.box} testID={boxTransformTestID}>
          <View style={styles.innerBox} />
        </View>
      </ZoomPanPinchView>
    </ZoomPanPinchContext>
  );
}

const styles = StyleSheet.create({
  box: {
    display: 'flex',
    alignItems: 'center',
    height: 400,
    width: 400,
  },
  innerBox: { height: 100, width: 100 },
});
