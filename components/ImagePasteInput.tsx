'use client';

import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Upload, X, Maximize2, Clipboard } from 'lucide-react';

interface ImagePasteInputProps {
  value: string;
  onChange: (base64OrUrl: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImagePasteInput({
  value,
  onChange,
  label = 'Paste or Upload Chart Screenshot',
  placeholder = 'Click here and press Ctrl+V to paste chart screenshot from clipboard, or drag & drop image',
}: ImagePasteInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste event handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isFocused && document.activeElement !== containerRef.current) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            readAndSetImage(file);
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isFocused]);

  const readAndSetImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readAndSetImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      readAndSetImage(file);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-mono font-semibold text-slate-300 block">{label}</label>}

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 group shadow-lg">
          {/* Chart Screenshot Preview */}
          <div className="relative h-48 w-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={value} 
              alt="Chart Screenshot" 
              className="object-contain max-h-full w-full rounded-xl" 
            />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-100 font-mono text-xs hover:bg-slate-700 transition-colors"
              >
                <Maximize2 className="h-3.5 w-3.5" /> Full Size
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-900/80 text-rose-200 font-mono text-xs hover:bg-rose-800 transition-colors"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </div>
          <p className="text-[10px] font-mono text-slate-500 text-center mt-1">Chart screenshot attached</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          tabIndex={0}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 cursor-pointer transition-all ${
            isFocused
              ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
              : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/20">
              <Clipboard className="h-5 w-5" />
            </div>
            <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20">
              <Upload className="h-5 w-5" />
            </div>
          </div>

          <p className="text-xs font-mono font-semibold text-center text-slate-200">{placeholder}</p>
          <span className="text-[10px] font-mono text-slate-500 mt-1">Supports Ctrl+V Paste, Drag & Drop, or Click to Upload PNG/JPG</span>
        </div>
      )}

      {/* Full Size Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl p-4 overflow-hidden flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-mono text-xs text-slate-400 mb-3">Chart Screenshot Full Preview</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Chart Full Preview" className="object-contain max-h-[80vh] w-full rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
