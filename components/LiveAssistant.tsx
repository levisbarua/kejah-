import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Loader2, Volume2, MicOff, AlertCircle } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Audio Configuration Constants
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

export const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [volume, setVolume] = useState(0); // For visualizer
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio Context & Processing Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Playback Queue Refs
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Session Ref
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopSession();
    };
  }, []);

  const stopSession = async () => {
    // 1. Close Audio Contexts
    if (audioContextRef.current) {
      try { await audioContextRef.current.close(); } catch(e) {}
      audioContextRef.current = null;
    }
    if (inputContextRef.current) {
      try { await inputContextRef.current.close(); } catch(e) {}
      inputContextRef.current = null;
    }

    // 2. Stop Media Stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // 3. Disconnect Processor/Source
    if (processorRef.current) {
      try { processorRef.current.disconnect(); } catch(e) {}
      processorRef.current = null;
    }
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch(e) {}
      sourceRef.current = null;
    }

    // 4. Stop all currently playing audio
    audioSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    audioSourcesRef.current.clear();

    setIsActive(false);
    setIsConnecting(false);
    setVolume(0);
    setAiSpeaking(false);
    setErrorMessage(null);
    nextStartTimeRef.current = 0;
    sessionPromiseRef.current = null;
  };

  const startSession = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setErrorMessage("API Key is missing. Live features require an API KEY.");
      setIsActive(true);
      return;
    }

    try {
      setIsConnecting(true);
      setIsActive(true);
      setErrorMessage(null);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const outputContext = new AudioContextClass({ sampleRate: OUTPUT_SAMPLE_RATE });
      const inputContext = new AudioContextClass({ sampleRate: INPUT_SAMPLE_RATE });

      await outputContext.resume();
      await inputContext.resume();

      audioContextRef.current = outputContext;
      inputContextRef.current = inputContext;

      const ai = new GoogleGenAI({ apiKey });
      
      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: `You are a helpful, warm, and professional real estate agent assistant for 'Kejah'. 
          Keep responses concise and conversational, like a phone call. 
          You can help users find homes, understand mortgages, or learn about neighborhoods.`,
        },
      };

      const callbacks = {
        onopen: async () => {
          setIsConnecting(false);
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            const source = inputContext.createMediaStreamSource(stream);
            sourceRef.current = source;
            
            const processor = inputContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) {
                sum += inputData[i] * inputData[i];
              }
              const rms = Math.sqrt(sum / inputData.length);
              setVolume(Math.min(rms * 10, 1)); 

              const pcmData = floatTo16BitPCM(inputData);
              const base64Data = arrayBufferToBase64(pcmData);
              
              if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then(session => {
                  session.sendRealtimeInput({
                    media: {
                      mimeType: "audio/pcm;rate=16000",
                      data: base64Data
                    }
                  });
                });
              }
            };

            source.connect(processor);
            processor.connect(inputContext.destination);
          } catch (err: any) {
            setErrorMessage("Microphone access denied. Please check permissions.");
            stopSession();
          }
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          
          if (base64Audio) {
             setAiSpeaking(true);
             try {
               const audioData = base64ToArrayBuffer(base64Audio);
               const audioBuffer = await decodeAudioData(audioData, outputContext);
               
               const source = outputContext.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(outputContext.destination);
               
               const currentTime = outputContext.currentTime;
               if (nextStartTimeRef.current < currentTime) {
                 nextStartTimeRef.current = currentTime;
               }
               
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += audioBuffer.duration;
               
               audioSourcesRef.current.add(source);
               
               source.onended = () => {
                 audioSourcesRef.current.delete(source);
                 if (audioSourcesRef.current.size === 0) {
                   setAiSpeaking(false);
                 }
               };
             } catch (decodeErr) {
               console.error("Audio Decode Error:", decodeErr);
             }
          }

          if (message.serverContent?.interrupted) {
            audioSourcesRef.current.forEach(src => src.stop());
            audioSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
            setAiSpeaking(false);
          }
        },
        onclose: () => {
          stopSession();
        },
        onerror: (err: any) => {
          setErrorMessage("Connection error. Please try again.");
          setIsConnecting(false);
        }
      };

      sessionPromiseRef.current = ai.live.connect({ ...config, callbacks });

    } catch (error: any) {
      setErrorMessage(error.message || "Failed to start session.");
      stopSession();
    }
  };

  const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const decodeAudioData = (arrayBuffer: ArrayBuffer, audioContext: AudioContext): AudioBuffer => {
    const dataView = new DataView(arrayBuffer);
    const numSamples = arrayBuffer.byteLength / 2;
    const audioBuffer = audioContext.createBuffer(1, numSamples, OUTPUT_SAMPLE_RATE);
    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
       const sample = dataView.getInt16(i * 2, true);
       channelData[i] = sample < 0 ? sample / 0x8000 : sample / 0x7FFF;
    }
    return audioBuffer;
  };

  return (
    <>
      {!isActive && (
        <button
          onClick={startSession}
          className="fixed bottom-24 right-6 p-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all z-40 flex items-center gap-2 group animate-in zoom-in"
          aria-label="Start Voice Chat"
        >
          <Mic className="h-6 w-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-medium whitespace-nowrap">
            Live Agent
          </span>
        </button>
      )}

      {isActive && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <button 
            onClick={stopSession}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex flex-col items-center gap-8 p-4">
             {errorMessage ? (
               <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500 rounded-full text-red-100 font-medium text-sm">
                 <AlertCircle className="h-4 w-4" /> {errorMessage}
               </div>
             ) : (
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 font-medium text-sm">
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Connecting to Gemini...
                    </>
                  ) : (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      Live Connection
                    </>
                  )}
               </div>
             )}

             <div className="relative h-64 w-64 flex items-center justify-center">
                {aiSpeaking && (
                   <div className="absolute inset-0 border-4 border-brand-500/50 rounded-full animate-pulse"></div>
                )}
                
                {!aiSpeaking && !isConnecting && !errorMessage && (
                  <>
                    <div 
                      className="absolute inset-0 bg-red-500/20 rounded-full transition-all duration-75"
                      style={{ transform: `scale(${1 + volume})` }}
                    />
                    <div 
                      className="absolute inset-0 bg-red-500/40 rounded-full transition-all duration-75"
                      style={{ transform: `scale(${1 + (volume * 0.5)})` }}
                    />
                  </>
                )}

                <div className="z-10 bg-white rounded-full p-8 shadow-2xl">
                   {aiSpeaking ? (
                      <Volume2 className="h-16 w-16 text-brand-600 animate-pulse" />
                   ) : (
                      <Mic className={`h-16 w-16 ${errorMessage ? 'text-gray-300' : volume > 0.1 ? 'text-red-500' : 'text-gray-400'} transition-colors`} />
                   )}
                </div>
             </div>

             <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  {errorMessage 
                    ? "Connection Failed" 
                    : isConnecting 
                      ? "Establishing Connection..." 
                      : aiSpeaking 
                        ? "Kejah Agent is speaking..." 
                        : "Listening..."}
                </h2>
                <p className="text-white/50 max-w-sm">
                  {errorMessage || (isConnecting 
                    ? "Please allow microphone access if prompted." 
                    : "Ask about property prices, neighborhoods, or specific listings.")}
                </p>
             </div>
             
             <div className="mt-8 flex gap-4">
                <button
                   onClick={stopSession}
                   className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                   <MicOff className="h-5 w-5" /> End Call
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};