import { AnimationConfig, AnimationType, AnimationEasing, AnimationRepeat, PageTransitionType } from '../types';

export const ANIMATION_TYPES: Array<{
  id: AnimationType;
  label: string;
  category: 'slide' | 'fade' | 'zoom' | 'motion' | 'decorative';
  description: string;
  iconName: string;
}> = [
  { id: 'none', label: 'None', category: 'fade', description: 'No animation applied', iconName: 'Minus' },
  { id: 'fadeIn', label: 'Fade In', category: 'fade', description: 'Smoothly fades in from transparent', iconName: 'Eye' },
  { id: 'slideUp', label: 'Slide Up', category: 'slide', description: 'Glides upwards from below into place', iconName: 'ArrowUp' },
  { id: 'slideDown', label: 'Slide Down', category: 'slide', description: 'Glides downwards from above into place', iconName: 'ArrowDown' },
  { id: 'slideLeft', label: 'Slide Left', category: 'slide', description: 'Glides in from the right edge', iconName: 'ArrowLeft' },
  { id: 'slideRight', label: 'Slide Right', category: 'slide', description: 'Glides in from the left edge', iconName: 'ArrowRight' },
  { id: 'zoomIn', label: 'Zoom In', category: 'zoom', description: 'Scales up gracefully from smaller size', iconName: 'ZoomIn' },
  { id: 'zoomOut', label: 'Zoom Out', category: 'zoom', description: 'Scales down gracefully from larger size', iconName: 'ZoomOut' },
  { id: 'rotate', label: 'Rotate', category: 'motion', description: 'Rotates into view or spins continuously', iconName: 'RotateCw' },
  { id: 'bounce', label: 'Bounce', category: 'motion', description: 'Playful bouncy spring entrance', iconName: 'Sparkles' },
  { id: 'reveal', label: 'Reveal', category: 'motion', description: 'Curtain wipe reveal using smooth clip mask', iconName: 'Layers' },
  { id: 'flip', label: '3D Flip', category: 'motion', description: 'Rotates around the 3D axis', iconName: 'Maximize2' },
  { id: 'float', label: 'Floating Loop', category: 'decorative', description: 'Gentle continuous up & down hovering', iconName: 'Waves' },
  { id: 'pulse', label: 'Subtle Pulse', category: 'decorative', description: 'Continuous gentle heartbeat scaling', iconName: 'Heart' }
];

export const EASING_OPTIONS: Array<{ id: AnimationEasing; label: string; description: string }> = [
  { id: 'ease-out', label: 'Smooth Ease Out', description: 'Decelerates naturally towards the end' },
  { id: 'ease-in-out', label: 'Ease In-Out', description: 'Smooth start and graceful finish' },
  { id: 'spring', label: 'Natural Spring', description: 'Realistic physics-based spring feel' },
  { id: 'bounce', label: 'Elastic Bounce', description: 'Lively elastic overshoot' },
  { id: 'ease-in', label: 'Ease In', description: 'Starts slowly and accelerates' },
  { id: 'linear', label: 'Linear', description: 'Constant speed throughout' }
];

export const REPEAT_OPTIONS: Array<{ id: string; label: string; repeatValue: number | 'infinite'; repeatType?: 'loop' | 'reverse' | 'mirror' }> = [
  { id: 'none', label: 'Once (No Repeat)', repeatValue: 0 },
  { id: '2', label: '2 Times', repeatValue: 1 },
  { id: '3', label: '3 Times', repeatValue: 2 },
  { id: 'infinite', label: 'Loop Infinitely', repeatValue: 'infinite', repeatType: 'loop' },
  { id: 'reverse', label: 'Back & Forth Loop', repeatValue: 'infinite', repeatType: 'reverse' }
];

export const PAGE_TRANSITIONS: Array<{ id: PageTransitionType; label: string; description: string }> = [
  { id: 'fade', label: 'Fade Transition', description: 'Soft cross-fade between invitation pages' },
  { id: 'slide-vertical', label: 'Vertical Slide', description: 'Classic upward page slide' },
  { id: 'slide-horizontal', label: 'Horizontal Slide', description: 'Book-like side swipe transition' },
  { id: 'zoom', label: 'Zoom & Scale', description: 'Modern cinematic depth scaling' },
  { id: 'flip', label: '3D Card Flip', description: 'Luxury 3D greeting card flip' },
  { id: 'cube', label: '3D Cube Push', description: 'Architectural 3D perspective rotation' },
  { id: 'none', label: 'Instant (No Transition)', description: 'Direct instantaneous page switch' }
];

// Helper to map easing curve
export function getEasing(easing?: AnimationEasing) {
  switch (easing) {
    case 'ease-in':
      return [0.42, 0, 1.0, 1.0];
    case 'ease-out':
      return [0.22, 1, 0.36, 1];
    case 'ease-in-out':
      return [0.42, 0, 0.58, 1.0];
    case 'linear':
      return 'linear';
    case 'spring':
      return { type: 'spring', stiffness: 100, damping: 14 };
    case 'bounce':
      return { type: 'spring', stiffness: 140, damping: 10, bounce: 0.4 };
    default:
      return [0.22, 1, 0.36, 1];
  }
}

// Convert repeat value to Framer Motion parameters
export function getRepeatConfig(repeat?: AnimationRepeat) {
  if (!repeat || (repeat as any) === 'none' || repeat === 0) {
    return { repeat: 0 };
  }
  if (repeat === 'infinite' || (repeat as any) === Infinity || (repeat as any) === true) {
    return { repeat: Infinity, repeatType: 'loop' as const };
  }
  if (repeat === 'reverse') {
    return { repeat: Infinity, repeatType: 'reverse' as const };
  }
  if (repeat === '1' || (repeat as any) === 1) {
    return { repeat: 1 };
  }
  if (repeat === '2' || (repeat as any) === 2) {
    return { repeat: 2 };
  }
  if (repeat === '3' || (repeat as any) === 3) {
    return { repeat: 3 };
  }
  if (typeof repeat === 'number') {
    return { repeat };
  }
  return { repeat: 0 };
}

// Generate Motion Animation Props for Element
export function getElementMotionProps(
  anim?: AnimationConfig,
  options?: {
    isEditor?: boolean;
    previewTrigger?: number; // timestamp to force animation replay
    forceAnimate?: boolean;
  }
) {
  if (!anim || anim.type === 'none') {
    return {};
  }

  const duration = Math.max(0.1, anim.duration || 0.8);
  const delay = Math.max(0, anim.delay || 0);
  const ease = getEasing(anim.speed);
  const repeatConfig = getRepeatConfig(anim.repeat);

  // Transition base
  const transition: Record<string, any> = {
    duration,
    delay: options?.forceAnimate ? 0 : delay, // instant delay when testing in inspector
    ease: ease,
    ...repeatConfig
  };

  // Define Initial and Animate states based on AnimationType
  let initial: any = {};
  let animate: any = {};

  switch (anim.type) {
    case 'fadeIn':
      initial = { opacity: 0 };
      animate = { opacity: 1 };
      break;

    case 'slideUp':
      initial = { opacity: 0, y: 48 };
      animate = { opacity: 1, y: 0 };
      break;

    case 'slideDown':
      initial = { opacity: 0, y: -48 };
      animate = { opacity: 1, y: 0 };
      break;

    case 'slideLeft':
      initial = { opacity: 0, x: 48 };
      animate = { opacity: 1, x: 0 };
      break;

    case 'slideRight':
      initial = { opacity: 0, x: -48 };
      animate = { opacity: 1, x: 0 };
      break;

    case 'zoomIn':
      initial = { opacity: 0, scale: 0.75 };
      animate = { opacity: 1, scale: 1 };
      break;

    case 'zoomOut':
      initial = { opacity: 0, scale: 1.25 };
      animate = { opacity: 1, scale: 1 };
      break;

    case 'rotate':
      if (anim.repeat === 'infinite' || anim.repeat === 'reverse') {
        initial = { rotate: 0 };
        animate = { rotate: 360 };
        transition.ease = 'linear';
      } else {
        initial = { opacity: 0, rotate: -180, scale: 0.8 };
        animate = { opacity: 1, rotate: 0, scale: 1 };
      }
      break;

    case 'bounce':
      if (anim.repeat === 'infinite' || anim.repeat === 'reverse') {
        initial = { y: 0 };
        animate = { y: [-12, 0, -12] };
        transition.repeat = Infinity;
        transition.repeatType = 'reverse';
      } else {
        initial = { opacity: 0, y: -50, scale: 0.85 };
        animate = { opacity: 1, y: 0, scale: 1 };
        transition.ease = [0.175, 0.885, 0.32, 1.275];
      }
      break;

    case 'reveal':
      initial = { clipPath: 'inset(0 100% 0 0)', opacity: 0 };
      animate = { clipPath: 'inset(0 0% 0 0)', opacity: 1 };
      break;

    case 'flip':
      initial = { opacity: 0, rotateX: 80, perspective: 1000 };
      animate = { opacity: 1, rotateX: 0, perspective: 1000 };
      break;

    case 'float':
      initial = { y: 0 };
      animate = { y: [-6, 6, -6] };
      transition.duration = duration * 2 || 3;
      transition.repeat = Infinity;
      transition.repeatType = 'reverse';
      break;

    case 'pulse':
      initial = { scale: 1 };
      animate = { scale: [1, 1.05, 1] };
      transition.duration = duration * 1.5 || 2;
      transition.repeat = Infinity;
      transition.repeatType = 'reverse';
      break;

    default:
      return {};
  }

  // Scroll vs Load Trigger Handling
  if (anim.trigger === 'scroll' && !options?.forceAnimate && !options?.isEditor) {
    return {
      initial,
      whileInView: animate,
      viewport: { once: anim.repeat !== 'infinite' && anim.repeat !== 'reverse', margin: '-40px' },
      transition
    };
  }

  return {
    initial,
    animate,
    transition
  };
}

// Generate Page Transition Props
export function getPageTransitionVariants(type: PageTransitionType = 'fade', duration: number = 0.5) {
  switch (type) {
    case 'slide-vertical':
      return {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0, transition: { duration, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, y: -40, transition: { duration: duration * 0.75 } }
      };

    case 'slide-horizontal':
      return {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0, transition: { duration, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, x: -60, transition: { duration: duration * 0.75 } }
      };

    case 'zoom':
      return {
        initial: { opacity: 0, scale: 0.92 },
        animate: { opacity: 1, scale: 1, transition: { duration, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, scale: 1.05, transition: { duration: duration * 0.75 } }
      };

    case 'flip':
      return {
        initial: { opacity: 0, rotateY: 60, perspective: 1200 },
        animate: { opacity: 1, rotateY: 0, perspective: 1200, transition: { duration, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, rotateY: -60, perspective: 1200, transition: { duration: duration * 0.75 } }
      };

    case 'cube':
      return {
        initial: { opacity: 0, rotateX: 30, scale: 0.96 },
        animate: { opacity: 1, rotateX: 0, scale: 1, transition: { duration, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, rotateX: -30, scale: 0.96, transition: { duration: duration * 0.75 } }
      };

    case 'none':
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 }
      };

    case 'fade':
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration, ease: 'easeInOut' } },
        exit: { opacity: 0, transition: { duration: duration * 0.75 } }
      };
  }
}
