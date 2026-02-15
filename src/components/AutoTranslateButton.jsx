'use client';

import { useState } from 'react';

/**
 * AutoTranslateButton Component
 * Button that translates text from Thai to English using DeepL API
 * 
 * @param {Object} props
 * @param {string} props.sourceText - Text to translate (Thai)
 * @param {function} props.onTranslated - Callback with translated text
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disable button
 */
export default function AutoTranslateButton({
    sourceText,
    onTranslated,
    className = '',
    disabled = false
}) {
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState(null);

    const handleTranslate = async () => {
        if (!sourceText || !sourceText.trim()) {
            setError('ไม่มีข้อความให้แปล');
            return;
        }

        setIsTranslating(true);
        setError(null);

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: sourceText,
                    sourceLang: 'TH',
                    targetLang: 'EN',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Translation failed');
            }

            if (onTranslated && data.translatedText) {
                onTranslated(data.translatedText);
            }
        } catch (err) {
            console.error('Translation error:', err);
            setError(err.message || 'เกิดข้อผิดพลาดในการแปล');
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="auto-translate-wrapper">
            <button
                type="button"
                onClick={handleTranslate}
                disabled={disabled || isTranslating}
                className={`auto-translate-btn ${className}`}
                title="แปลจากภาษาไทยเป็นภาษาอังกฤษอัตโนมัติ"
            >
                {isTranslating ? (
                    <>
                        <span className="translate-spinner"></span>
                        กำลังแปล...
                    </>
                ) : (
                    <>
                        🌐 แปลอัตโนมัติ
                    </>
                )}
            </button>
            {error && (
                <span className="translate-error">{error}</span>
            )}
            <style jsx>{`
        .auto-translate-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .auto-translate-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 500;
          color: #3b82f6;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .auto-translate-btn:hover:not(:disabled) {
          background: #dbeafe;
          border-color: #93c5fd;
        }
        .auto-translate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .translate-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid #3b82f6;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .translate-error {
          font-size: 11px;
          color: #ef4444;
        }
      `}</style>
        </div>
    );
}
