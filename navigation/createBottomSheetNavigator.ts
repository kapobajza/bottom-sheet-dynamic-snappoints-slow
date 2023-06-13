import { createNavigatorFactory, ParamListBase, StackNavigationState } from '@react-navigation/native';

import BottomSheetNavigator from './BottomSheetNavigator';
import type { BottomSheetNavigationEventMap, BottomSheetNavigationOptions } from './types';

const createBottomSheetNavigator = createNavigatorFactory<
  StackNavigationState<ParamListBase>,
  BottomSheetNavigationOptions,
  BottomSheetNavigationEventMap,
  typeof BottomSheetNavigator
>(BottomSheetNavigator);

export default createBottomSheetNavigator;
