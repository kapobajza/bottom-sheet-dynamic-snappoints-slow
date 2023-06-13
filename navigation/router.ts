import { nanoid } from 'nanoid/non-secure';
import { ParamListBase, Router, StackRouter, StackActions, StackRouterOptions } from '@react-navigation/native';

import type { BottomSheetActionType, BottomSheetNavigationState } from './types';

export const BottomSheetActions = {
  ...StackActions,
  snapTo(index: number): BottomSheetActionType {
    return { type: 'SNAP_TO', index };
  },
};

export function BottomSheetRouter(
  routerOptions: StackRouterOptions,
): Router<BottomSheetNavigationState<ParamListBase>, BottomSheetActionType> {
  const baseRouter = StackRouter(routerOptions) as unknown as Router<
    BottomSheetNavigationState<ParamListBase>,
    BottomSheetActionType
  >;

  return {
    ...baseRouter,
    type: 'bottom-sheet',
    getInitialState(options) {
      const state = baseRouter.getInitialState(options);

      return {
        ...state,
        stale: false,
        type: 'bottom-sheet',
        key: `bottom-sheet-${nanoid()}`,
      };
    },
    getStateForAction(state, action, options) {
      switch (action.type) {
        case 'SNAP_TO': {
          const index =
            action.target === state.key && action.source
              ? state.routes.findIndex((r) => r.key === action.source)
              : state.index;

          return {
            ...state,
            routes: state.routes.map((route, i) =>
              i === index
                ? {
                    ...route,
                    snapToIndex: action.index,
                  }
                : route,
            ),
          };
        }
        default:
          return baseRouter.getStateForAction(state, action, options);
      }
    },
    getRehydratedState(partialState, { routeNames, routeParamList, routeGetIdList }) {
      if (partialState.stale === false) {
        return partialState;
      }

      const state = baseRouter.getRehydratedState(partialState, {
        routeNames,
        routeParamList,
        routeGetIdList,
      });

      return {
        ...state,
        type: 'bottom-sheet',
        key: `bottom-sheet-${nanoid()}`,
      };
    },
    actionCreators: BottomSheetActions,
  };
}
