import { ParamListBase, useNavigationBuilder } from '@react-navigation/native';

import BottomSheetView from './BottomSheetView';
import { BottomSheetRouter } from './router';
import type {
  BottomSheetActionHelpers,
  BottomSheetNavigationEventMap,
  BottomSheetNavigationOptions,
  BottomSheetNavigationState,
  BottomSheetNavigatorProps,
  BottomSheetRouterOptions,
} from './types';

function BottomSheetNavigator({ id, children, screenListeners, screenOptions, ...rest }: BottomSheetNavigatorProps) {
  const { state, descriptors, navigation, NavigationContent } = useNavigationBuilder<
    BottomSheetNavigationState<ParamListBase>,
    BottomSheetRouterOptions,
    BottomSheetActionHelpers<ParamListBase>,
    BottomSheetNavigationOptions,
    BottomSheetNavigationEventMap
  >(BottomSheetRouter, {
    id,
    children,
    screenListeners,
    screenOptions,
  });

  return (
    <NavigationContent>
      <BottomSheetView {...rest} state={state} navigation={navigation} descriptors={descriptors} />
    </NavigationContent>
  );
}

export default BottomSheetNavigator;
