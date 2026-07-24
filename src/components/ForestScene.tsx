import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Completion, Habit } from '../data/types';
import { images } from '../theme/tokens';
import { FOREST_WORLD, layoutForest, ForestItem } from '../data/forestLayout';

const MIN_SCALE = 0.4;
const MAX_SCALE = 2.2;

function Sprite({ item, index, celebrate }: { item: ForestItem; index: number; celebrate: boolean }) {
  const entrance = useSharedValue(celebrate ? 0 : 1);
  const twinkle = useSharedValue(1);

  useEffect(() => {
    if (celebrate) {
      entrance.value = withDelay(150, withSpring(1, { damping: 6, stiffness: 140 }));
    }
  }, [celebrate]);

  useEffect(() => {
    if (item.growthType === 'firefly') {
      twinkle.value = withRepeat(
        withSequence(
          withTiming(0.35, { duration: 900 + (index % 5) * 120, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 900 + (index % 5) * 120, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: (item.growthType === 'firefly' ? twinkle.value : 1) * entrance.value,
    transform: [
      { scale: item.scale * (0.4 + 0.6 * entrance.value) },
      { rotate: `${item.rotation}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.sprite, { left: item.x, top: item.y }, style]}>
      <Text style={styles.spriteText}>{item.sprite}</Text>
      {celebrate && <View style={styles.glow} pointerEvents="none" />}
    </Animated.View>
  );
}

export function ForestScene({
  completions,
  habits,
  highlightId,
  interactive = true,
}: {
  completions: Completion[];
  habits: Habit[];
  highlightId?: string | null;
  interactive?: boolean;
}) {
  const { width: viewportW, height: viewportH } = useWindowDimensions();
  const items = React.useMemo(() => layoutForest(completions, habits), [completions, habits]);

  const fitScale = Math.max(viewportW / FOREST_WORLD.width, viewportH / FOREST_WORLD.height, MIN_SCALE);

  // transform scales around the element's own center, not (0,0), so centering
  // a world point at the viewport center needs to compensate for that pivot:
  // screenX(p) = translateX + centerX*(1-s) + p*s  =>  solve translateX for screenX(focus) == viewportCenter.
  const worldCenterX = FOREST_WORLD.width / 2;
  const worldCenterY = FOREST_WORLD.height / 2;
  // Centering the world's own center at the viewport's center is scale-independent.
  const initialX = viewportW / 2 - worldCenterX;
  const initialY = viewportH / 2 - worldCenterY;

  const scale = useSharedValue(fitScale);
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const savedScale = useSharedValue(fitScale);
  const savedX = useSharedValue(initialX);
  const savedY = useSharedValue(initialY);

  // Keep the pan/zoom from wandering past the edge of the finite world canvas
  // (otherwise you can pan/zoom into empty space with nothing rendered there).
  const clampX = (tx: number, s: number) => {
    'worklet';
    const max = -worldCenterX * (1 - s);
    const min = viewportW - worldCenterX * (1 - s) - FOREST_WORLD.width * s;
    return Math.min(max, Math.max(min, tx));
  };
  const clampY = (ty: number, s: number) => {
    'worklet';
    const max = -worldCenterY * (1 - s);
    const min = viewportH - worldCenterY * (1 - s) - FOREST_WORLD.height * s;
    return Math.min(max, Math.max(min, ty));
  };

  useEffect(() => {
    const target = items.find((i) => i.id === highlightId);
    const focusX = target ? target.x : worldCenterX;
    const focusY = target ? target.y : worldCenterY;
    const s = target ? Math.min(1.1, MAX_SCALE) : fitScale;
    // The bottom ~55% of the screen is covered by the opaque detail sheet, so
    // a celebrated item should land in the visible "peek" band above it, not
    // dead-center of the full (mostly hidden) viewport.
    const screenTargetY = target ? viewportH * 0.32 : viewportH / 2;
    scale.value = withTiming(s, { duration: 700 });
    translateX.value = withTiming(clampX(viewportW / 2 - focusX * s - worldCenterX * (1 - s), s), { duration: 700 });
    translateY.value = withTiming(clampY(screenTargetY - focusY * s - worldCenterY * (1 - s), s), { duration: 700 });
    savedScale.value = s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightId]);

  const pan = Gesture.Pan()
    .enabled(interactive)
    .onStart(() => {
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = clampX(savedX.value + e.translationX, scale.value);
      translateY.value = clampY(savedY.value + e.translationY, scale.value);
    });

  const pinch = Gesture.Pinch()
    .enabled(interactive)
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, savedScale.value * e.scale));
      scale.value = s;
      translateX.value = clampX(translateX.value, s);
      translateY.value = clampY(translateY.value, s);
    });

  const gesture = Gesture.Simultaneous(pan, pinch);

  const worldStyle = useAnimatedStyle(() => ({
    width: FOREST_WORLD.width,
    height: FOREST_WORLD.height,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  const content = (
    <Animated.View style={worldStyle}>
      <ImageBackground source={{ uri: images.magicalForestHero }} style={StyleSheet.absoluteFill} contentFit="cover">
        <LinearGradient
          colors={['rgba(20,26,20,0.55)', 'rgba(20,26,20,0.15)', 'rgba(10,30,35,0.6)']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>
      {items.map((item, i) => (
        <Sprite key={item.id} item={item} index={i} celebrate={item.id === highlightId} />
      ))}
    </Animated.View>
  );

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0E1712' }]}>
      {interactive ? <GestureDetector gesture={gesture}>{content}</GestureDetector> : content}
    </View>
  );
}

const styles = StyleSheet.create({
  sprite: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  spriteText: { fontSize: 40 },
  glow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFE9A8',
    opacity: 0.25,
  },
});
