
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const progress = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(500),

      Animated.timing(progress, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),

      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),

        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [progress, logoOpacity, logoScale]);

  const positions = [-32, -16, 0, 16, 32];

  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {positions.map((position, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                transform: [
                  {
                    translateX: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [position, 0],
                    }),
                  },
                  {
                    scale: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.2],
                    }),
                  },
                ],
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              },
            ]}
          />
        ))}
      </View>

      <Animated.Text
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        budd
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dots: {
    width: 80,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },

  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7CFF00',
  },

  logo: {
    color: '#7CFF00',
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -2,
  },
});

