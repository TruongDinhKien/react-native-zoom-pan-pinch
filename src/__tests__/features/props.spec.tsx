import { render, screen } from '@testing-library/react-native';
import RenderChild from '../components/children-prop';
import RenderProp from '../components/render-prop';
const expectRequiredElementsToExist = () => {
  const wrapper = screen.getByTestId('wrapper');
  expect(wrapper).toBeOnTheScreen();

  const content = screen.getByTestId('content');
  expect(content).toBeOnTheScreen();
};

describe('RenderChild Component', () => {
  describe('When the component is rendered', () => {
    test('it renders the wrapper and content elements (children)', () => {
      render(<RenderChild />);
      expectRequiredElementsToExist();
    });
  });
});

describe('RenderProp Component', () => {
  describe('When the component is rendered', () => {
    test('it renders the wrapper and content elements (render prop)', () => {
      render(<RenderProp />);
      expectRequiredElementsToExist();
    });
  });
});
