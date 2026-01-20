import { useState } from 'react';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface RatingComponentProps {
  consultationId: string;
  sessionToken: string;
}

const RATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rate-consultation`;

const RatingComponent = ({ consultationId, sessionToken }: RatingComponentProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Selecione uma nota de 1 a 5 estrelas');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(RATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          consultation_id: consultationId,
          rating,
          comment: comment.trim() || null,
          sessionToken,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao enviar avaliação');
      }

      setSubmitted(true);
      toast.success('Obrigado pelo feedback!');
    } catch (e) {
      console.error('Rating error:', e);
      toast.error(e instanceof Error ? e.message : 'Erro ao enviar avaliação');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-2xl text-accent animate-fade-in">
        <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />
        <span className="text-sm font-medium">Obrigado pelo feedback!</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-2xl animate-fade-in">
      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">
          Como foi a qualidade desta sugestão?
        </span>
        
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
              disabled={loading}
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground/40'
                }`}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comentário opcional..."
        className="w-full bg-background/50 border-0 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 h-20 resize-none transition-all text-foreground placeholder:text-muted-foreground"
        disabled={loading}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || rating === 0}
        className="w-full bg-accent/10 text-accent py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-40 font-medium text-sm"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
        ) : (
          'Enviar Avaliação'
        )}
      </button>
    </div>
  );
};

export default RatingComponent;
