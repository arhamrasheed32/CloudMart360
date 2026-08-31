import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Wand2,
  Check,
  RefreshCw,
  Copy,
  Layers,
  Zap
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { playSuccessChime } from '../../utils/audioFeedback.js';

export function AiProductAssistant({
  onApplyCopy,
  currentCategory = 'Electronics'
}) {
  const { showSuccess } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!keywords.trim()) return;

    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 700)); // Simulated Bedrock Inference

    const words = keywords.toLowerCase().split(/[\s,]+/);

    const titlePrefix = currentCategory === 'Electronics' ? 'Aura' : currentCategory === 'Apparel & Fashion' ? 'Solstice' : 'Komorebi';
    const generatedTitle = `${titlePrefix} Pro ${keywords.split(',')[0].trim().replace(/\b\w/g, (l) => l.toUpperCase())}`;

    const generatedDesc = `Engineered with precision craftsmanship and designed for modern lifestyle performance. Incorporates ${keywords} with seamless Amazon DynamoDB cloud telemetry, sustainable packaging, and official 2-year warranty support.`;

    const generatedTags = Array.from(
      new Set([
        ...words.filter((w) => w.length > 3),
        'premium',
        currentCategory.toLowerCase().split(' ')[0],
        '2026-release'
      ])
    ).slice(0, 5);

    setGeneratedResult({
      title: generatedTitle,
      description: generatedDesc,
      tags: generatedTags,
      suggestedPrice: currentCategory === 'Electronics' ? 199.99 : 49.99,
      suggestedCost: currentCategory === 'Electronics' ? 85.00 : 18.00
    });

    setIsGenerating(false);
    playSuccessChime();
  };

  const handleApply = () => {
    if (!generatedResult) return;
    onApplyCopy(generatedResult);
    showSuccess('AI generated copy and metadata applied to product!', 'AI Copy Applied');
    setIsOpen(false);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '14px 16px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(255, 87, 34, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--brand-primary)" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
            Amazon Bedrock AI Product Assistant
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          icon={Wand2}
          style={{ height: '28px', fontSize: '0.6875rem' }}
        >
          {isOpen ? 'Close AI' : 'Open AI Generator'}
        </Button>
      </div>

      {isOpen && (
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Input
            label="Enter Product Keywords / Key Features"
            placeholder="e.g. titanium alloy, 40hr battery, active noise cancelling, memory foam..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
            helperText="AI will synthesize title, marketing narrative, tags, and suggested margins"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isGenerating}
              icon={Sparkles}
              style={{ height: '32px' }}
            >
              Generate Copy & Metadata
            </Button>
          </div>

          {generatedResult && (
            <div
              className="glass-panel"
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 87, 34, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                animation: 'fadeIn 180ms ease'
              }}
            >
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Generated Title:</span>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                  {generatedResult.title}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Generated Description:</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '2px 0 0 0' }}>
                  {generatedResult.description}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {generatedResult.tags.map((t) => (
                  <span key={t} className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', fontSize: '0.6875rem' }}>
                    #{t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <Button
                  variant="primary"
                  size="sm"
                  type="button"
                  onClick={handleApply}
                  icon={Check}
                  style={{ height: '30px', fontSize: '0.75rem' }}
                >
                  Apply AI Result to Form
                </Button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
