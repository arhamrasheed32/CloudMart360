import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Send
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { playSuccessChime } from '../../utils/audioFeedback.js';

export function StoreReviewsSection({ product }) {
  const { showSuccess } = useToast();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');

  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      author: 'Marcus L.',
      rating: 5,
      date: '2 days ago',
      verified: true,
      comment: 'Exceptional build quality and precision craftsmanship. The product arrived in flawless condition with premium retail packaging.'
    },
    {
      id: 'rev-2',
      author: 'Elena R.',
      rating: 5,
      date: '1 week ago',
      verified: true,
      comment: 'Exceeded my expectations. Performance is instantaneous and battery life surpasses the advertised rating. Highly recommended!'
    },
    {
      id: 'rev-3',
      author: 'David K.',
      rating: 4,
      date: '2 weeks ago',
      verified: true,
      comment: 'Very reliable everyday hardware. High-end aesthetic that fits seamlessly into modern minimalist setups.'
    }
  ]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      rating: userRating,
      date: 'Just now',
      verified: true,
      comment: comment.trim()
    };

    setReviews([newRev, ...reviews]);
    playSuccessChime();
    showSuccess('Your review has been verified and published!', 'Review Posted');
    setAuthor('');
    setComment('');
    setShowReviewForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} color="var(--brand-primary)" />
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Customer Feedback ({reviews.length} Verified Reviews)
          </h4>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowReviewForm(!showReviewForm)}
          style={{ height: '30px', fontSize: '0.75rem' }}
        >
          {showReviewForm ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>

      {/* Review Submission Form */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Your Rating:</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setUserRating(star)}
                  style={{ color: star <= userRating ? '#F59E0B' : 'var(--text-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Star size={16} fill={star <= userRating ? '#F59E0B' : 'transparent'} />
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Your Name / Handle"
            placeholder="e.g. Alex M."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          <Textarea
            label="Your Experience & Review"
            placeholder="Share details about performance, build quality, and usability..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="sm" type="submit" icon={Send} style={{ height: '32px' }}>
              Publish Review
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="glass-panel"
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.015)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {rev.author}
                </span>
                {rev.verified && (
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', fontSize: '0.625rem', padding: '1px 5px', gap: '3px' }}>
                    <CheckCircle2 size={10} /> Verified Buyer
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={11} fill="#F59E0B" />
                  ))}
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-faint)' }}>{rev.date}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {rev.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
