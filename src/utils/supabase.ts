import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided as environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface AnalysisHistory {
  id?: string; // UUID is typically generated by the database
  user_id: string;
  source_type: 'call' | 'sms' | 'file' | 'url';
  source_identifier: string; // e.g., phone number, file name, URL
  result: string; // The analysis result text
  confidence_score: number; // FLOAT
  created_at?: string; // TIMESTAMPTZ, typically generated by the database
}

export async function insertAnalysisHistory(data: Omit<AnalysisHistory, 'id' | 'created_at'>) {
  const { data: newRecord, error } = await supabase
    .from('analysis_history')
    .insert([data])
    .select();

  if (error) {
    console.error('Error inserting analysis history:', error);
    throw error;
  }
  return newRecord;
}

export async function uploadFileToSupabase(fileUri: string, fileName: string, userId: string) {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const fileExtension = fileName.split('.').pop();
  const path = `${userId}/${Date.now()}.${fileExtension}`; // Store files under user ID

  const { data, error } = await supabase.storage
    .from('manual-analysis') // Assuming a bucket named 'manual-analysis'
    .upload(path, blob, {
      cacheControl: '3600',
      upsert: false,
      contentType: blob.type || 'application/octet-stream', // Use blob type or default
    });

  if (error) {
    console.error('Error uploading file to Supabase Storage:', error);
    throw error;
  }
  return data;
}

export interface DetectionFeedback {
  id?: string;
  user_id: string;
  analysis_history_id: string;
  is_helpful: boolean;
  created_at?: string;
}

export async function insertDetectionFeedback(data: Omit<DetectionFeedback, 'id' | 'created_at'>) {
  const { data: newRecord, error } = await supabase
    .from('detection_feedback')
    .insert([data])
    .select();

  if (error) {
    console.error('Error inserting detection feedback:', error);
    throw error;
  }
  return newRecord;
}