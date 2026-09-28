"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Mic,
  Square,
  Camera,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Trash2,
  Volume2,
  Loader2,
} from "lucide-react";
import { Ticket } from "@/lib/store";

export default function CitizenReportPage() {
  // Audio Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Photo State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Geolocation State
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Form Inputs
  const [wardNumber, setWardNumber] = useState<number>(84);
  const [textDescription, setTextDescription] = useState<string>("");
  const [citizenPhone, setCitizenPhone] = useState<string>("");

  // Submission & Results State with Idempotency Protection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const submissionLockRef = useRef(false);

  // Request HTML5 Geolocation
  const requestLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation fallback:", err.message);
        // Default to Ward 84 Indiranagar coordinates for testing if permission denied
        setLatitude(12.9784);
        setLongitude(77.6408);
        setGpsAccuracy(15);
        setLocationError("GPS permission denied/timed out. Using ward default coordinates.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  // Audio Recording Handlers
  const startRecording = async () => {
    if (isSubmitting) return;
    setAudioBlob(null);
    setAudioUrl(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const fullBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(fullBlob);
        setAudioUrl(URL.createObjectURL(fullBlob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250); // collect 250ms chunks
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Microphone access denied.";
      setSubmitError(`Could not access microphone: ${msg}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const removeAudio = () => {
    if (isSubmitting) return;
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingSeconds(0);
  };

  // Image Upload Handlers with 5MB Pre-flight Check
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitting) return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError("Uploaded photograph exceeds the 5MB limit. Please choose a smaller photo.");
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setSubmitError(null);
    }
  };

  const removeImage = () => {
    if (isSubmitting) return;
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  // Submit Handler with Client-Side Idempotency Lock
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionLockRef.current || isSubmitting) {
      return;
    }

    setSubmitError(null);

    if (!audioBlob && !textDescription.trim()) {
      setSubmitError("Please record a voice grievance or provide a written description.");
      return;
    }

    submissionLockRef.current = true;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (audioBlob) {
        formData.append("audio", audioBlob, "citizen_voice_note.webm");
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      formData.append("textDescription", textDescription);
      formData.append("wardNumber", wardNumber.toString());
      formData.append("latitude", (latitude || 12.9784).toString());
      formData.append("longitude", (longitude || 77.6408).toString());
      formData.append("accuracy", (gpsAccuracy || 10).toString());
      if (citizenPhone) {
        formData.append("citizenId", citizenPhone);
      }

      const res = await fetch("/api/tickets/intake", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to submit grievance.");
      }

      setCreatedTicket(data.ticket);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
      submissionLockRef.current = false;
    }
  };

  const resetForm = () => {
    setCreatedTicket(null);
    removeAudio();
    removeImage();
    setTextDescription("");
    setSubmitError(null);
    requestLocation();
  };

  return (
    <main className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Citizen Grievance Intake
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Report a Civic Hazard
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Voice-first grievance reporting with multimodal AI triage in Hindi, Tamil, Telugu, Kannada, or English.
          </p>
        </div>

        {/* Success View */}
        {createdTicket ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Grievance Registered</h2>
                <p className="text-xs text-emerald-400 font-mono tracking-tight tabular-nums">Reference: {createdTicket.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
                <span className="text-zinc-500 block text-[11px] mb-1">Issue Category</span>
                <span className="font-semibold text-emerald-300">
                  {createdTicket.category.replace(/_/g, " ")}
                </span>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
                <span className="text-zinc-500 block text-[11px] mb-1">Severity & SLA</span>
                <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{createdTicket.severity}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider block">
                AI Extracted Summary
              </span>
              <p className="text-sm text-zinc-200">{createdTicket.summary}</p>
              {createdTicket.extractedLandmarks.length > 0 && (
                <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-zinc-400 font-medium">Anchored Landmarks:</span>
                  {createdTicket.extractedLandmarks.map((lm, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs border border-zinc-700"
                    >
                      {lm}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={resetForm}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Report Another Hazard
              </button>
              <Link
                href="/contractor"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
              >
                Track in Contractor Portal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Grievance Input Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-950/30 p-3.5 text-xs sm:text-sm text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{submitError}</span>
              </div>
            )}

            {/* 1. Voice Grievance Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <Mic className="h-4 w-4 text-emerald-400" />
                  Voice Note Grievance (Recommended)
                </label>
                {isRecording && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400 animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Recording: <span className="font-mono tracking-tight tabular-nums">{recordingSeconds}s</span>
                  </span>
                )}
              </div>

              {!audioBlob && !isRecording && (
                <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-5 sm:p-6 text-center">
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-zinc-950 hover:bg-emerald-400 transition-transform active:scale-95 min-h-[48px] w-full sm:w-auto shadow-md disabled:opacity-50"
                  >
                    <Mic className="h-5 w-5" />
                    Record Grievance
                  </button>
                  <p className="mt-2.5 text-xs text-zinc-400 max-w-sm mx-auto">
                    Speak clearly in Hindi, Tamil, Telugu, Kannada, or English describing the location and hazard.
                  </p>
                </div>
              )}

              {isRecording && (
                <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-5 sm:p-6 text-center space-y-4">
                  <div className="flex justify-center items-center gap-1.5 sm:gap-2 h-10 overflow-hidden">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                      <div
                        key={bar}
                        className="w-1.5 sm:w-2 bg-red-500 rounded-full animate-bounce"
                        style={{
                          height: `${Math.max(16, (bar * 7) % 32)}px`,
                          animationDelay: `${bar * 80}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors min-h-[48px] w-full sm:w-auto shadow-md"
                  >
                    <Square className="h-4 w-4 fill-current" />
                    Stop Recording
                  </button>
                </div>
              )}

              {audioBlob && audioUrl && (
                <div className="rounded-xl border border-zinc-700 bg-zinc-800/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Volume2 className="h-4 w-4" />
                      Voice Grievance Captured (<span className="font-mono tracking-tight tabular-nums">{recordingSeconds}s</span>)
                    </span>
                    <button
                      type="button"
                      onClick={removeAudio}
                      disabled={isSubmitting}
                      className="text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-40"
                      title="Delete recording"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <audio controls src={audioUrl} className="w-full h-9 rounded-lg" />
                </div>
              )}

              {/* Text Fallback */}
              <div>
                <label htmlFor="textDescription" className="text-xs font-medium text-zinc-400 block mb-1.5">
                  Or write detailed description:
                </label>
                <textarea
                  id="textDescription"
                  rows={2}
                  value={textDescription}
                  disabled={isSubmitting}
                  onChange={(e) => setTextDescription(e.target.value)}
                  placeholder="e.g. 2-meter wide asphalt pothole right outside Indiranagar Metro Pillar #42"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* 2. Photo Capture Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <Camera className="h-4 w-4 text-emerald-400" />
                Site Hazard Photograph
              </label>

              {!imagePreview ? (
                <label
                  className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-5 sm:p-6 text-center cursor-pointer hover:border-emerald-500/50 transition-colors min-h-[140px] ${
                    isSubmitting ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 mb-2">
                    <Camera className="h-6 w-6 text-emerald-400" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">Tap to capture or upload photo</span>
                  <span className="text-xs text-zinc-500 mt-1">Live camera preferred (&lt; 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    disabled={isSubmitting}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
                  <img
                    src={imagePreview}
                    alt="Hazard site preview"
                    className="w-full h-44 sm:h-52 object-cover"
                  />
                  {!isSubmitting && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 rounded-xl bg-zinc-900/90 p-2.5 text-zinc-300 hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shadow-md"
                      title="Remove photo"
                      aria-label="Remove photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 3. Geolocation & Ward Tagging */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  Incident Geolocation
                </label>
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={isLocating || isSubmitting}
                  className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${isLocating ? "animate-spin" : ""}`} />
                  Refresh GPS
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <span className="text-zinc-500 block text-[11px]">GPS Coordinates</span>
                  <span className="font-mono tracking-tight tabular-nums text-zinc-200">
                    {latitude && longitude
                      ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                      : "Locating..."}
                  </span>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <span className="text-zinc-500 block text-[11px]">Accuracy Radius</span>
                  <span className="font-mono tracking-tight tabular-nums text-emerald-400">
                    {gpsAccuracy ? `±${gpsAccuracy} meters` : "Pending"}
                  </span>
                </div>
              </div>

              {locationError && (
                <p className="text-[11px] text-amber-400/90">{locationError}</p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="wardSelect" className="text-xs font-medium text-zinc-400 block mb-1.5">
                    Municipal Ward:
                  </label>
                  <select
                    id="wardSelect"
                    value={wardNumber}
                    disabled={isSubmitting}
                    onChange={(e) => setWardNumber(parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-xs sm:text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                  >
                    <option value={84}>Ward 84 – Indiranagar</option>
                    <option value={112}>Ward 112 – Domlur</option>
                    <option value={150}>Ward 150 – Bellandur</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="citizenPhone" className="text-xs font-medium text-zinc-400 block mb-1.5">
                    Phone (Optional):
                  </label>
                  <input
                    id="citizenPhone"
                    type="tel"
                    value={citizenPhone}
                    disabled={isSubmitting}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="9845012345"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isRecording}
              className="w-full rounded-xl bg-emerald-500 px-6 py-4 text-sm sm:text-base font-bold text-zinc-950 hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 min-h-[52px] active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-950" />
                  <span>Processing Grievance with Gemini...</span>
                </>
              ) : (
                <>
                  <span>Submit Municipal Grievance</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
