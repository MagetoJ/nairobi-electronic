import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ThumbsUp, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  userName: string;
  userInitials: string;
}

interface ReviewsSectionProps {
  productId: string;
}

function StarRating({ rating, onRatingChange, readonly = false }: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 cursor-pointer transition-colors ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => !readonly && onRatingChange?.(star)}
          data-testid={`star-${star}`}
        />
      ))}
    </div>
  );
}

function ReviewForm({ productId, onReviewAdded }: {
  productId: string;
  onReviewAdded: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; title: string; comment: string }) => {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to create review");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your feedback.",
      });
      setRating(0);
      setTitle("");
      setComment("");
      onReviewAdded();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating.",
        variant: "destructive",
      });
      return;
    }
    createReviewMutation.mutate({ rating, title, comment });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rating *</Label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>
          
          <div>
            <Label htmlFor="review-title">Title (optional)</Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
              data-testid="input-review-title"
            />
          </div>
          
          <div>
            <Label htmlFor="review-comment">Comment (optional)</Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about your experience with this product"
              rows={4}
              maxLength={1000}
              data-testid="textarea-review-comment"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={createReviewMutation.isPending}
            data-testid="button-submit-review"
          >
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const helpfulMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/reviews/${review.id}/helpful`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to mark review as helpful");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${review.productId}/reviews`] });
      toast({
        title: "Thank you!",
        description: "Your feedback has been recorded.",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold" data-testid="text-user-initials">
                {review.userInitials}
              </span>
            </div>
            <div>
              <p className="font-medium" data-testid="text-user-name">{review.userName}</p>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} readonly />
                {review.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified Purchase
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500" data-testid="text-review-date">
            {formatDate(review.createdAt)}
          </p>
        </div>

        {review.title && (
          <h4 className="font-semibold mb-2" data-testid="text-review-title">
            {review.title}
          </h4>
        )}

        {review.comment && (
          <p className="text-gray-700 mb-3 leading-relaxed" data-testid="text-review-comment">
            {review.comment}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => helpfulMutation.mutate()}
            disabled={helpfulMutation.isPending}
            className="text-gray-500 hover:text-gray-700"
            data-testid="button-review-helpful"
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            Helpful ({review.helpful})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: [`/api/products/${productId}/reviews`],
  });

  const handleReviewAdded = () => {
    queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold" data-testid="text-reviews-title">
            Customer Reviews
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={Math.round(averageRating)} readonly />
              <span className="text-sm text-gray-500" data-testid="text-review-summary">
                {averageRating.toFixed(1)} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} />
      )}

      {!isAuthenticated && (
        <Card className="mb-6">
          <CardContent className="pt-6 text-center">
            <User className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-4">Sign in to write a review</p>
            <Button variant="outline" onClick={() => window.location.href = '/login'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Star className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}