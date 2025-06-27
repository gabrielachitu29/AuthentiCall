import React, { useState } from 'react';

import { YStack, Text, Button, Input, Spinner } from 'tamagui'; // Added Input, Spinner
import { Stack, useRouter } from 'expo-router'; // Import useRouter
import DocumentPicker, { types } from 'react-native-document-picker';
import { uploadFileToSupabase, insertAnalysisHistory, supabase } from '../src/utils/supabase'; // Import the new function, insertAnalysisHistory, and supabase
import { useAuthStore } from '../src/store/authStore'; // Import auth store

export default function ManualAnalysisScreen() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false); // New state for upload status
  const { session } = useAuthStore(); // Get session from auth store
  const userId = session?.user?.id; // Extract user ID

  if (!userId) {
    // Handle case where user is not logged in, e.g., redirect to login
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text>Please log in to use this feature.</Text>
      </YStack>
    );
  }

  const pickDocument = async () => {
    if (!userId) {
      console.error('User not logged in. Cannot upload file.');
      return;
    }

    try {
      const pickerResult = await DocumentPicker.pickSingle({
        type: [types.allFiles], // Allow all file types
      });

      setSelectedFile(pickerResult.uri);
      console.log('Selected file:', pickerResult.uri);

      setIsUploading(true); // Start uploading
      const fileName = pickerResult.name || pickerResult.uri.split('/').pop() || 'unknown_file';
      const uploadResult = await uploadFileToSupabase(pickerResult.uri, fileName, userId);
      console.log('File uploaded successfully:', uploadResult);

      // Get public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('manual-analysis')
        .getPublicUrl(uploadResult.path);

      const filePublicUrl = publicUrlData?.publicUrl;

      if (!filePublicUrl) {
        throw new Error('Failed to get public URL for the uploaded file.');
      }

      console.log('Analyzing file via URL:', filePublicUrl);
      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/analyze-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ url: filePublicUrl }), // Send the public URL to the Edge Function
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to analyze file: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      console.log('File analysis result:', result);

      const { aiAnalysis, confidenceScore } = result;

      // Insert analysis history
      await insertAnalysisHistory({
        user_id: userId,
        source_type: 'file',
        source_identifier: fileName, // Use file name as identifier
        result: aiAnalysis,
        confidence_score: confidenceScore || 0,
      });

      // Navigate to Analysis Report screen
      const historyResult = await insertAnalysisHistory({
        user_id: userId,
        source_type: 'file',
        source_identifier: fileName,
        result: aiAnalysis,
        confidence_score: confidenceScore || 0,
      });

      router.push({
        pathname: '/analysis-report' as any,
        params: {
          analysisResult: aiAnalysis,
          sourceIdentifier: fileName,
          sourceType: 'file',
          filePath: pickerResult.uri,
          analysisHistoryId: historyResult[0].id,
        },
      });
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker.');
      } else {
        console.error('Document picker error or upload failed:', err);
        alert('File upload failed. Please try again.'); // User feedback
      }
    } finally {
      setIsUploading(false); // End uploading
    }
  };

  const router = useRouter(); // Initialize router

  const analyzeLink = async () => {
    if (!urlInput || !userId) {
      alert('Please enter a URL and ensure you are logged in to analyze.');
      return;
    }

    setIsUploading(true); // Use isUploading for link analysis as well for consistency
    try {
      console.log('Analyzing link:', urlInput);
      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/analyze-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`, // Use anon key for Edge Function call
        },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to analyze link: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      console.log('Link analysis result:', result);

      const { aiAnalysis, confidenceScore } = result;

      // Insert analysis history
      await insertAnalysisHistory({
        user_id: userId,
        source_type: 'url',
        source_identifier: urlInput,
        result: aiAnalysis,
        confidence_score: confidenceScore || 0, // Default to 0 if not provided
      });

      // Navigate to Analysis Report screen
      const historyResultUrl = await insertAnalysisHistory({
        user_id: userId,
        source_type: 'url',
        source_identifier: urlInput,
        result: aiAnalysis,
        confidence_score: confidenceScore || 0,
      });

      router.push({
        pathname: '/analysis-report' as any,
        params: {
          analysisResult: aiAnalysis,
          sourceIdentifier: urlInput,
          sourceType: 'url',
          analysisHistoryId: historyResultUrl[0].id,
        },
      });
    } catch (error: any) {
      console.error('Error analyzing link:', error);
      alert(`Link analysis failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      <Stack.Screen options={{ title: 'Manual Analysis' }} />
      <Text fontSize="$6" fontWeight="bold" marginBottom="$4">
        Analyze Files or Links
      </Text>
      <Button onPress={pickDocument} disabled={isUploading}>
        {isUploading ? (
          <>
            <Spinner size="small" color="$color.white" />
            <Text marginLeft="$2">Uploading...</Text>
          </>
        ) : (
          'Select File for Analysis'
        )}
      </Button>
      {selectedFile && (
        <Text marginTop="$2" fontSize="$3">
          Selected: {selectedFile.split('/').pop()}
        </Text>
      )}
      <Text marginTop="$4">
        Or paste a link below:
      </Text>
      <Input
        width="100%"
        size="$4"
        placeholder="Enter URL here..."
        value={urlInput}
        onChangeText={setUrlInput}
        marginTop="$2"
        disabled={isUploading}
      />
      <Button onPress={analyzeLink} theme="blue" marginTop="$2" disabled={!urlInput || isUploading}>
        Analyze Link
      </Button>
    </YStack>
  );
}