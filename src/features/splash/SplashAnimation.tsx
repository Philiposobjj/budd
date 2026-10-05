import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme/tokens';

const DOTS = 6;
const DURATION_MS = 2600;

// Cada ponto começa longe do centro e converge até ele.
function Dot({ index }: { index: number }) {
  const angle = (index / DOTS) * Math.PI * 2;
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withDelay(
      index * 90,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }),
    );
  }, [index, p]);

  const style = useAnimatedStyle(() => {
    const r = 150 * (1 - p.value);
    return {
      opacity: p.value,
      transform: [
        { translateX: Math.cos(angle) * r },
        { translateY: Math.sin(angle) * r },
        { scale: 1 - p.value * 0.6 },
      ],
    };
  });

  return <Animated.View style={[styles.dot, style]} />;
}

export function SplashAnimation({ onFinish }: { onFinish: () => void }) {
  const logo = useSharedValue(0);

  useEffect(() => {
    logo.value = withDelay(
      1100,
      withSequence(
        withTiming(1.12, { duration: 350, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 200 }),
      ),
    );
    const t = setTimeout(onFinish, DURATION_MS);
    return () => clearTimeout(t);
  }, [logo, onFinish]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: Math.min(logo.value, 1),
    transform: [{ scale: logo.value }],
  }));

  return (
    <View style={styles.root} accessible accessibilityLabel="Abrindo o budd">
      {Array.from({ length: DOTS }, (_, i) => (
        <Dot key={i} index={i} />
      ))}
      <Animated.View style={logoStyle}>
        <Text style={styles.logo}>budd</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brand,
  },
  logo: {
    color: colors.brand,
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -2,
  },
});