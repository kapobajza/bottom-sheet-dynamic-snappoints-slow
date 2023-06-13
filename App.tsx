import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  BottomSheetScreenProps,
  createBottomSheetNavigator,
} from '@th3rdwave/react-navigation-bottom-sheet';
import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

type BottomSheetParams = {
  Home: undefined;
  Sheet: { id: number };
  BigSheet: { id: number };
};

const BottomSheet = createBottomSheetNavigator<BottomSheetParams>();

function HomeScreen({
  navigation,
}: BottomSheetScreenProps<BottomSheetParams, 'Home'>) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <View style={styles.spacer} />
      <Button
        title="Open sheet"
        onPress={() => {
          navigation.dispatch(CommonActions.navigate({
            name: 'BottomSheet',
            params: {
              screen: 'Sheet',
              params: { id: 1 },
            }
          }))
        }}
      />
      <View style={styles.spacer} />
      <Button
        title="Open a big sheet"
        onPress={() => {
          navigation.dispatch(CommonActions.navigate({
            name: 'BottomSheet',
            params: {
              screen: 'BigSheet',
              params: { id: 1 },
            }
          }))
        }}
      />
    </View>
  );
}

function SheetScreen({
  route,
  navigation,
}: BottomSheetScreenProps<BottomSheetParams, 'Sheet'>) {
  return (
    <View style={[styles.container, styles.content]}>
      <Text>Sheet Screen {route.params.id}</Text>
      <View style={styles.spacer} />
      <Button
        title="Open new sheet"
        onPress={() => {
          navigation.navigate('Sheet', { id: route.params.id + 1 });
        }}
      />
      <View style={styles.spacer} />
      <Button
        title="Open new big sheet"
        onPress={() => {
          navigation.navigate('BigSheet', { id: route.params.id + 1 });
        }}
      />
      <View style={styles.spacer} />
      <Button
        title="Close this sheet"
        onPress={() => {
          navigation.goBack();
        }}
      />
      {route.name === ('BigSheet' as unknown) && (
        <>
          <View style={styles.spacer} />
          <Button
            title="Snap to top"
            onPress={() => {
              navigation.snapTo(1);
            }}
          />
        </>
      )}
    </View>
  );
}

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
);

const Stack = createStackNavigator();

function BottomSheetNav() {
  return (
    <BottomSheet.Navigator
      screenOptions={{
        backdropComponent: renderBackdrop,
      }}
    >
      <BottomSheet.Screen
        name="Sheet"
        component={SheetScreen}
        getId={({ params }) => `sheet-${params.id}`}
      />
      <BottomSheet.Screen
        name="BigSheet"
        component={SheetScreen}
        getId={({ params }) => `sheet-${params.id}`}
      />
    </BottomSheet.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeStack" component={HomeScreen} />
        <Stack.Screen
          name="BottomSheet"
          component={BottomSheetNav}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginVertical: 20,
  },
  spacer: {
    margin: 5,
  },
});
