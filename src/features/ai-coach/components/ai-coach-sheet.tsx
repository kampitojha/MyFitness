import { useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Send, Sparkles } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { IconButton } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { useProfile } from '@/hooks/use-profile';
import { useTodayMacros } from '@/hooks/use-meals';

export interface AICoachSheetProps {
  visible: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

const QUICK_PROMPTS = [
  'How do I hit my protein goal today?',
  'Suggest a 500 kcal dinner idea',
  'What should I eat post-workout?',
  'Analyze my daily nutrition balance',
];

export function AICoachSheet({ visible, onClose }: AICoachSheetProps) {
  const { data: profile } = useProfile();
  const { macros } = useTodayMacros();

  const goals = profile?.dailyGoals ?? { calories: 2000, protein: 125, carbs: 225, fat: 67 };
  const remCalories = Math.max(0, goals.calories - macros.calories);
  const remProtein = Math.max(0, goals.protein - macros.protein);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${profile?.name || 'there'}! I am your AI Nutrition Coach. You have ${remCalories} kcal and ${remProtein}g protein remaining today. How can I assist you with your fitness goals?`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [thinking, setThinking] = useState(false);
  const msgCounter = useRef(0);
  const nextMsgId = () => {
    msgCounter.current += 1;
    return `msg-${msgCounter.current}`;
  };

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: nextMsgId(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setThinking(true);

    setTimeout(() => {
      let replyText = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('protein')) {
        replyText = `To hit your remaining ${remProtein}g protein, consider 150g grilled chicken breast (45g P), 2 scoops whey protein (48g P), 200g paneer (36g P), or 4 boiled egg whites (15g P).`;
      } else if (lower.includes('dinner') || lower.includes('500 kcal')) {
        replyText = `Here is a balanced ~500 kcal dinner: 150g Paneer / Chicken Breast + 2 Whole Wheat Rotis + 1 bowl Dal + Cucumber Salad. (P: 38g, C: 48g, F: 14g).`;
      } else if (lower.includes('post-workout') || lower.includes('workout')) {
        replyText = `Post-workout optimal recovery meal: 1 scoop Whey Protein in water + 1 medium banana (28g P, 30g fast-acting carbs for glycogen replenishment).`;
      } else if (lower.includes('analyze') || lower.includes('balance')) {
        replyText = `Daily Analysis: You have logged ${macros.calories} / ${goals.calories} kcal (${Math.round((macros.calories / goals.calories) * 100)}%). Protein progress is at ${macros.protein}g / ${goals.protein}g.`;
      } else {
        replyText = `Based on your remaining ${remCalories} kcal and ${remProtein}g protein target, focus on lean protein sources and complex carbs with fiber. Let me know if you want a specific recipe!`;
      }

      setMessages((prev) => [...prev, { id: nextMsgId(), sender: 'ai', text: replyText }]);
      setThinking(false);
    }, 800);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="AI Nutritionist Coach" snapTo={0.85}>
      <View className="mb-3 flex-row items-center gap-2 rounded-2xl bg-primary-soft p-3 dark:bg-emerald-950">
        <Sparkles size={20} color="#0E7A4A" />
        <Text variant="caption" weight="medium" className="flex-1 text-primary-softText dark:text-emerald-300">
          Personalized advice based on your remaining {remCalories} kcal & {remProtein}g protein.
        </Text>
      </View>

      {/* Quick Prompts */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3 flex-row gap-2">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <Chip key={idx} label={prompt} onPress={() => handleSend(prompt)} className="mr-2" />
        ))}
      </ScrollView>

      {/* Chat Conversation */}
      <ScrollView className="max-h-[300px] mb-3 gap-2" showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`p-3.5 rounded-2xl mb-2 max-w-[85%] ${
              msg.sender === 'user'
                ? 'self-end bg-primary-600 dark:bg-emerald-500'
                : 'self-start bg-surface-alt dark:bg-neutral-800'
            }`}
          >
            <Text
              variant="bodySmall"
              className={msg.sender === 'user' ? 'text-white font-medium' : 'text-ink dark:text-neutral-100'}
            >
              {msg.text}
            </Text>
          </View>
        ))}
        {thinking ? (
          <View className="self-start bg-surface-alt p-3 rounded-2xl dark:bg-neutral-800 flex-row items-center gap-2">
            <Sparkles size={16} color="#0E7A4A" className="animate-spin" />
            <Text variant="caption" color="muted">AI is thinking…</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Input */}
      <View className="flex-row items-center gap-2 pb-4 pt-1">
        <View className="flex-1">
          <Input
            placeholder="Ask AI anything about your diet..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
          />
        </View>
        <IconButton
          variant="surface"
          label="Send message"
          onPress={() => handleSend()}
          icon={<Send size={18} color="#0E7A4A" />}
        />
      </View>
    </BottomSheet>
  );
}
