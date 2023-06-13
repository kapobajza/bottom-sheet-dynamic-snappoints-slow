import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetModalProvider,
  BottomSheetView as RNBottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { ParamListBase } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';

import type {
  BottomSheetDescriptorMap,
  BottomSheetNavigationConfig,
  BottomSheetNavigationHelpers,
  BottomSheetNavigationProp,
  BottomSheetNavigationState,
} from './types';

type BottomSheetModalScreenProps = BottomSheetModalProps & {
  navigation: BottomSheetNavigationProp<ParamListBase>;
};

function BottomSheetModalScreen({
  contentHeight,
  handleHeight,
  index,
  navigation,
  snapPoints,
  ...props
}: BottomSheetModalScreenProps) {
  const ref = useRef<BottomSheetModal>(null);
  const lastIndexRef = useRef(index);

  // Present on mount.
  useEffect(() => {
    ref.current?.present();
  }, []);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (index != null && lastIndexRef.current !== index) {
      ref.current?.snapToIndex(index);
    }
  }, [index]);

  const onChange = useCallback(
    (newIndex: number) => {
      lastIndexRef.current = newIndex;

      if (newIndex >= 0) {
        navigation.snapTo(newIndex);
      }
    },
    [navigation],
  );

  const onDismiss = useCallback(() => {
    // BottomSheetModal will call onDismiss on unmount, be we do not want that since
    // we already popped the screen.
    if (isMounted.current) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <BottomSheetModal
      ref={ref}
      contentHeight={contentHeight}
      handleHeight={handleHeight}
      index={index}
      snapPoints={snapPoints}
      onChange={onChange}
      onDismiss={onDismiss}
      {...props}
    />
  );
}

type Props = BottomSheetNavigationConfig & {
  state: BottomSheetNavigationState<ParamListBase>;
  navigation: BottomSheetNavigationHelpers;
  descriptors: BottomSheetDescriptorMap;
};

export default function BottomSheetView({ state, descriptors }: Props) {
  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(['CONTENT_HEIGHT']);

  const renderBackdropComponent = useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />;
  }, []);


  return (
    <BottomSheetModalProvider>
      {state.routes.map(({ snapToIndex, key }) => {
        const { options, navigation, render } = descriptors[key];
        const { snapPoints = animatedSnapPoints.value, index, ...sheetProps } = options;

        return (
          <BottomSheetModalScreen
            key={key}
            // Make sure index is in range, it could be out if snapToIndex is persisted
            // and snapPoints is changed.
            index={Math.min(snapToIndex || index || 0, snapPoints.length - 1)}
            contentHeight={animatedContentHeight}
            handleHeight={animatedHandleHeight}
            snapPoints={snapPoints}
            navigation={navigation}
            backdropComponent={renderBackdropComponent}
            {...sheetProps}
          >
            <RNBottomSheetView onLayout={handleContentLayout}>
              {render()}
            </RNBottomSheetView>
          </BottomSheetModalScreen>
        );
      })}
    </BottomSheetModalProvider>
  );
}
