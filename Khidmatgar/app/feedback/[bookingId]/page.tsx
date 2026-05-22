'use client';
import { useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

const DISPUTE_TYPES = ['No Show', 'Quality Issue', 'Overcharging', 'Incomplete Work', 'Rude Behavior'];

function FeedbackContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params?.bookingId as string || 'KHD-DEMO';
  const initialRating = parseInt(searchParams?.get('rating') || '0') || 0;

  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [disputeType, setDisputeType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resolution, setResolution] = useState('');
  const [loading, setLoading] = useState(false);

  const showDispute = rating > 0 && rating <= 2;

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    if (showDispute && disputeType) {
      const resolutions: Record<string, string> = {
        'No Show': '✅ Full refund processed. Provider received a strike. Booking cancelled.',
        'Quality Issue': '✅ 20% discount applied to your next booking. Provider flagged for review.',
        'Overcharging': '✅ Price difference will be refunded within 24hrs. Case under investigation.',
        'Incomplete Work': '✅ Provider scheduled for free return visit within 24hrs.',
        'Rude Behavior': '✅ Complaint registered. Provider suspended pending investigation.',
      };
      setResolution(resolutions[disputeType] || '✅ Dispute registered. Our team will contact you within 2 hours.');
    } else {
      setResolution('✅ Thank you! Your feedback helps improve our service.');
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/"><button className="p-2 glass rounded-xl hover:bg-white/10 transition-colors"><ArrowLeft className="w-5 h-5" /></button></Link>
        <div>
          <h1 className="text-lg font-bold text-white">Feedback & Dispute</h1>
          <p className="text-xs font-mono text-primary">{bookingId}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {/* Star Rating */}
            <div className="glass rounded-2xl border border-white/10 p-6 mb-4 text-center">
              <h3 className="font-bold text-white mb-1">Rate Your Experience</h3>
              <p className="text-white/50 text-sm mb-4">How was the service?</p>
              <div className="flex gap-3 justify-center mb-2">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
                    className="text-4xl transition-all hover:scale-125 duration-150">
                    {s <= (hoverRating || rating) ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-white/60">
                  {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good experience' : rating === 3 ? 'Average' : rating === 2 ? 'Below expectations' : 'Very poor — we\'re sorry'}
                </p>
              )}
            </div>

            {/* Category Ratings */}
            {rating > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl border border-white/10 p-5 mb-4">
                <h4 className="font-semibold text-white mb-3 text-sm">Rate individually (optional)</h4>
                {['Punctuality', 'Quality', 'Communication', 'Price Fairness'].map(cat => (
                  <div key={cat} className="flex items-center justify-between mb-3">
                    <span className="text-white/60 text-sm">{cat}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => <button key={s} className="text-sm hover:scale-110 transition-transform">☆</button>)}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Review text */}
            {rating > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
                <textarea value={review} onChange={e => setReview(e.target.value)} rows={3}
                  placeholder="Share your experience (optional)..."
                  className="w-full glass border border-white/20 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 resize-none" />
                <div className="text-xs text-white/30 text-right mt-1">{review.length}/200</div>
              </motion.div>
            )}

            {/* Dispute section */}
            <AnimatePresence>
              {showDispute && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="glass rounded-2xl border border-danger/30 p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-danger" />
                    <h4 className="font-bold text-danger">File a Dispute</h4>
                  </div>
                  <p className="text-white/50 text-sm mb-3">We noticed a low rating. Would you like to raise a formal dispute?</p>
                  <div className="space-y-2">
                    {DISPUTE_TYPES.map(type => (
                      <button key={type} onClick={() => setDisputeType(type)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                          disputeType === type ? 'bg-danger/20 border border-danger/50 text-danger' : 'glass border border-white/10 text-white/60 hover:border-white/30'
                        }`}>
                        {type}
                      </button>
                    ))}
                  </div>
                  {disputeType && (
                    <div className="mt-3 p-3 bg-black/30 rounded-xl text-xs text-white/60">
                      <strong className="text-white">Auto-resolution available:</strong> For "{disputeType}", Masla Hal Karo Agent will process this automatically.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {rating > 0 && (
              <motion.button onClick={handleSubmit} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-bold text-background flex items-center justify-center gap-2"
                style={{ background: loading ? '#333' : 'linear-gradient(135deg, #00D4FF, #7B2FFF)' }}>
                {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing...</> : 'Submit Feedback →'}
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12">
            <div className="text-6xl mb-4">{showDispute ? '⚖️' : '🎉'}</div>
            <h2 className="text-2xl font-bold text-white mb-2">{showDispute ? 'Dispute Filed!' : 'Shukria!'}</h2>
            <div className="glass rounded-2xl p-5 border border-secondary/30 text-left mb-6">
              <p className="text-secondary font-semibold mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4" />Resolution</p>
              <p className="text-white/70 text-sm">{resolution}</p>
            </div>
            {showDispute && (
              <div className="glass rounded-2xl p-4 border border-white/10 text-sm text-white/50 mb-6">
                <strong className="text-white block mb-1">Provider Impact</strong>
                Provider risk_score increased. Strike #{disputeType === 'No Show' ? '2' : '1'} recorded.
                {disputeType === 'No Show' && ' If 3 strikes: automatic blacklist.'}
              </div>
            )}
            <Link href="/"><button className="btn-primary">Back to Home</button></Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60 text-sm">Loading feedback page...</p>
        </div>
      </div>
    }>
      <FeedbackContent />
    </Suspense>
  );
}
