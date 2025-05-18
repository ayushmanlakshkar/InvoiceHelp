// SpeechToTextService.ts
// Service for using AssemblyAI Speech-to-Text API in React Native
// Usage: import and call transcribeAudio with your audio file and API key
import axios from 'axios';

const ASSEMBLYAI_API_URL = 'https://api.assemblyai.com/v2';
const ASSEMBLYAI_API_KEY = '035d892c540046179cb435e0501fb5be';

export async function uploadAudio(fileUri: string): Promise<string> {
  console.log('Uploading audio file:', fileUri);
  const response = await fetch(fileUri);
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  try {
    const uploadResponse = await axios.post(
      `${ASSEMBLYAI_API_URL}/upload`,
      uint8Array,
      {
        headers: {
          'authorization': `${ASSEMBLYAI_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
      }
    );
    console.log('Upload response:', uploadResponse.data);
    return uploadResponse.data.upload_url;
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw new Error('Failed to upload audio');
  }
}

export async function requestTranscription(audioUrl: string): Promise<string> {
  const body = {
    audio_url: audioUrl,
  };
  const response = await axios.post(
    `${ASSEMBLYAI_API_URL}/transcript`,
    body,
    {
      headers: {
        'authorization': ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.id;
}

export async function pollTranscription(transcriptId: string): Promise<string> {
  while (true) {
    const response = await axios.get(
      `${ASSEMBLYAI_API_URL}/transcript/${transcriptId}`,
      {
        headers: { 'authorization': `Bearer ${ASSEMBLYAI_API_KEY}` },
      }
    );
    const data = response.data;
    if (data.status === 'completed') {
      return data.text;
    } else if (data.status === 'failed') {
      throw new Error('Transcription failed');
    }
    await new Promise(res => setTimeout(res, 3000));
  }
}

export async function transcribeAudio(fileUri: string): Promise<string> {
  const audioUrl = await uploadAudio(fileUri);
  console.log('Audio URL:', audioUrl);
  const transcriptId = await requestTranscription(audioUrl);
    console.log('Transcript ID:', transcriptId);
  const text = await pollTranscription(transcriptId);
    console.log('Transcription text:', text);
  return text;
}
