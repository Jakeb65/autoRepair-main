declare module '*.png' {
  const content: number;
  export default content;
}

declare module '*.jpg' {
  const content: number;
  export default content;
}

declare module '*.jpeg' {
  const content: number;
  export default content;
}
declare module '*.webp' {
  const content: number;
  export default content;
}

// Shims for React Native / Expo / Navigation packages used in the repo
declare module 'react-native'
declare module '@expo/vector-icons' {
  // Provide named exports for common icon sets used in the repo
  export const Ionicons: any
  const whatever: any
  export default whatever
}

declare module '@react-navigation/bottom-tabs' {
  // Minimal shim so createBottomTabNavigator<T>() accepts a generic in TS
  export function createBottomTabNavigator<T = any>(): any
}

declare module '@react-navigation/native' {
  // NavigationProp supports a generic param in many usages in the repo
  export type NavigationProp<T = any> = any
  export function useNavigation<T = any>(): any
}

declare module '@react-navigation/native-stack' {
  export function createNativeStackNavigator<T = any>(): any
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: any
  export default AsyncStorage
}

declare module '@react-native-picker/picker' {
  export const Picker: any
  export default Picker
}

// Generic shim for any other untyped package imports used as a quick workaround
declare module '*-untyped'
