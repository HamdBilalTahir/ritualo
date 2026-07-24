import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { spacing, radius } from '../theme/tokens';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export type FoxMood = 'idle' | 'celebrate';

const GREETINGS = [
  "You're doing great! \u{1F31F}",
  'Ready for a ritual today?',
  'The forest is proud of you.',
  "I'm here whenever you need me!",
  'Every little ritual helps us grow \u{1F331}',
];
const CHEERS = ['Yesss! Amazing! \u{1F389}', "You're on a roll!", 'The forest thanks you!', "That's the spirit!"];

function pick(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export function FoxCompanion({ mood = 'idle', size = 120 }: { mood?: FoxMood; size?: number }) {
  const [bubble, setBubble] = useState<string | null>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bodyY = useSharedValue(0);
  const tailAngle = useSharedValue(-6);
  const eyeScaleY = useSharedValue(1);
  const armAngle = useSharedValue(18);
  const waveTrigger = useSharedValue(0);

  // idle loop: gentle bob + tail sway, forever
  useEffect(() => {
    bodyY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    tailAngle.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 1300, easing: Easing.inOut(Easing.sin) }),
        withTiming(-8, { duration: 1300, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  // occasional blink
  useEffect(() => {
    let cancelled = false;
    const loop = async () => {
      while (!cancelled) {
        const wait = 2400 + Math.random() * 2600;
        await new Promise((r) => setTimeout(r, wait));
        if (cancelled) return;
        eyeScaleY.value = withSequence(
          withTiming(0.1, { duration: 90 }),
          withTiming(1, { duration: 120 })
        );
      }
    };
    loop();
    return () => {
      cancelled = true;
    };
  }, []);

  const doWave = () => {
    armAngle.value = withSequence(
      withTiming(-70, { duration: 220 }),
      withTiming(-25, { duration: 160 }),
      withTiming(-70, { duration: 160 }),
      withTiming(-25, { duration: 160 }),
      withTiming(18, { duration: 220 })
    );
  };

  useEffect(() => {
    if (mood === 'celebrate') {
      doWave();
      bodyY.value = withRepeat(
        withSequence(
          withTiming(-16, { duration: 260, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 260, easing: Easing.in(Easing.quad) })
        ),
        3,
        false
      );
      setBubble(pick(CHEERS));
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      bubbleTimer.current = setTimeout(() => setBubble(null), 2600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  const onTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    doWave();
    setBubble(pick(GREETINGS));
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), 2600);
  };

  const bodyStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bodyY.value }] }));
  const tailProps = useAnimatedProps(() => ({ rotation: tailAngle.value, originX: 62, originY: 148 }));
  const armProps = useAnimatedProps(() => ({ rotation: armAngle.value, originX: 62, originY: 128 }));
  const eyeLProps = useAnimatedProps(() => ({ ry: 6 * eyeScaleY.value }));
  const eyeRProps = useAnimatedProps(() => ({ ry: 6 * eyeScaleY.value }));

  return (
    <View style={{ width: size, alignItems: 'center' }} pointerEvents="box-none">
      {bubble && (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{bubble}</Text>
        </View>
      )}
      <Pressable onPress={onTap} hitSlop={12}>
        <Animated.View style={bodyStyle}>
          <Svg width={size} height={size * 1.1} viewBox="0 0 200 220">
            {/* tail */}
            <AnimatedPath
              animatedProps={tailProps}
              d="M62 148 C 20 140, 8 90, 40 62 C 58 48, 78 56, 74 76 C 68 100, 84 118, 66 146 Z"
              fill="#E8834F"
            />
            <Ellipse cx="42" cy="66" rx="14" ry="11" fill="#FDF6E8" />

            {/* back arm (static) */}
            <Ellipse cx="140" cy="132" rx="12" ry="22" fill="#E8834F" />

            {/* legs */}
            <Ellipse cx="82" cy="196" rx="13" ry="10" fill="#E8834F" />
            <Ellipse cx="120" cy="196" rx="13" ry="10" fill="#E8834F" />

            {/* body */}
            <Ellipse cx="100" cy="152" rx="46" ry="40" fill="#E8834F" />
            <Ellipse cx="100" cy="164" rx="25" ry="24" fill="#FDF6E8" />

            {/* neckerchief */}
            <Path d="M76 122 L124 122 L100 142 Z" fill="#7C9470" />

            {/* front arm (waves) */}
            <AnimatedEllipse animatedProps={armProps} cx="62" cy="128" rx="12" ry="22" fill="#E8834F" />

            {/* head */}
            <Circle cx="100" cy="92" r="40" fill="#E8834F" />
            {/* ears */}
            <Path d="M64 66 L58 24 L92 56 Z" fill="#E8834F" />
            <Path d="M136 66 L142 24 L108 56 Z" fill="#E8834F" />
            <Path d="M68 58 L65 34 L86 55 Z" fill="#FDF6E8" />
            <Path d="M132 58 L135 34 L114 55 Z" fill="#FDF6E8" />

            {/* muzzle */}
            <Ellipse cx="100" cy="104" rx="21" ry="15" fill="#FDF6E8" />
            <Circle cx="100" cy="98" r="5" fill="#3A2A22" />
            <Path d="M100 102 L100 108" stroke="#3A2A22" strokeWidth="2" strokeLinecap="round" />

            {/* eyes */}
            <AnimatedEllipse animatedProps={eyeLProps} cx="84" cy="86" rx="5.5" ry="6" fill="#3A2A22" />
            <AnimatedEllipse animatedProps={eyeRProps} cx="116" cy="86" rx="5.5" ry="6" fill="#3A2A22" />
            <Circle cx="86" cy="83.5" r="1.4" fill="#FDF6E8" />
            <Circle cx="118" cy="83.5" r="1.4" fill="#FDF6E8" />
          </Svg>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
    maxWidth: 180,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  bubbleText: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 12,
    color: '#333B31',
    textAlign: 'center',
  },
});
