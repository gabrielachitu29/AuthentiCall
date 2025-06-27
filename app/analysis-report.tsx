import React, { useEffect, useState, useRef } from 'react';
import { YStack, Text, Button } from 'tamagui';
import { useToastController } from '@tamagui/toast';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { insertDetectionFeedback, supabase } from '../src/utils/supabase';
const AudioWaveform = require('@simform_solutions/react-native-audio-waveform');
import { ScrollView, TouchableOpacity } from 'react-native';

export default function AnalysisReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const toast = useToastController();
  const { analysisResult, sourceIdentifier, sourceType, analysisHistoryId, filePath } = params;

  const [userId, setUserId] = useState<string | null>(null);
  const [isEvidenceVisible, setIsEvidenceVisible] = useState(false);
  const waveformRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      }
    };
    fetchUser();
  }, []);

  const handleFeedback = async (isHelpful: boolean) => {
    if (!userId || !analysisHistoryId) {
      toast.show('Error', {
        message: 'User not logged in or analysis ID missing.',
        native: true,
      });
      return;
    }

    try {
      await insertDetectionFeedback({
        user_id: userId,
        analysis_history_id: analysisHistoryId as string,
        is_helpful: isHelpful,
      });
      toast.show('Feedback Submitted', {
        message: 'Thank you for your feedback!',
        native: true,
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast.show('Error', {
        message: 'Failed to submit feedback. Please try again.',
        native: true,
      });
    }
  };

  const isAudioFile = () => {
    return typeof sourceIdentifier === 'string' && (sourceIdentifier.endsWith('.wav') || sourceIdentifier.endsWith('.mp3') || sourceIdentifier.endsWith('.m4a'));
  }

  return (
    <ScrollView>
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Stack.Screen options={{ title: 'Analysis Report' }} />
        <Text fontSize="$6" fontWeight="bold" marginBottom="$4">
          Analysis Report
        </Text>
        <Text fontSize="$4" textAlign="center" marginBottom="$2">
          Source Type: {sourceType}
        </Text>
        <Text fontSize="$4" textAlign="center" marginBottom="$4">
          Source: {sourceIdentifier}
        </Text>
        <Text fontSize="$4" textAlign="center" marginBottom="$4">
          AI Analysis:
        </Text>
        <Text fontSize="$3" textAlign="center" marginBottom="$6">
          {analysisResult}
        </Text>

        {sourceType === 'file' && isAudioFile() && (
          <YStack width="100%" marginBottom="$4">
            <TouchableOpacity onPress={() => setIsEvidenceVisible(!isEvidenceVisible)}>
              <Text fontSize="$4" fontWeight="bold" color="$blue10" marginBottom="$2">
                {isEvidenceVisible ? 'Hide' : 'Show'} Evidence
              </Text>
            </TouchableOpacity>
            {isEvidenceVisible && (
              <AudioWaveform
                ref={waveformRef}
                path={filePath as string}
                height={60}
                width={300}
                scrubColor="blue"
                waveColor="gray"
                mode="static"
              />
            )}
          </YStack>
        )}

        <Text fontSize="$4" fontWeight="bold" marginBottom="$3">
          Was this analysis helpful?
        </Text>
        <YStack flexDirection="row" gap="$3" marginBottom="$6">
          <Button theme="green" onPress={() => handleFeedback(true)}>
            Yes
          </Button>
          <Button theme="red" onPress={() => handleFeedback(false)}>
            No
          </Button>
        </YStack>

        <Button onPress={() => router.back()} theme="blue">
          Go Back
        </Button>
      </YStack>
    </ScrollView>
  );
}