import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Edit, Eye, EyeOff, Star } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QuoteManagementProps {
  onQuoteDeleted?: () => void;
  onEditQuote?: (quote: any) => void;
  refreshTrigger?: number;
}

const QuoteManagement = ({ onQuoteDeleted, onEditQuote, refreshTrigger }: QuoteManagementProps) => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, [refreshTrigger]);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_quotes')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('featured_quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuotes(quotes.filter(quote => quote.id !== id));
      toast.success("Quote deleted successfully");
      onQuoteDeleted?.();
    } catch (error: any) {
      console.error('Error deleting quote:', error);
      toast.error("Failed to delete quote");
    }
  };

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('featured_quotes')
        .update({ is_visible: !currentVisibility })
        .eq('id', id);

      if (error) throw error;

      setQuotes(quotes.map(quote => 
        quote.id === id ? { ...quote, is_visible: !currentVisibility } : quote
      ));

      toast.success(`Quote ${!currentVisibility ? 'shown' : 'hidden'}`);
    } catch (error: any) {
      console.error('Error updating visibility:', error);
      toast.error("Failed to update visibility");
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('featured_quotes')
        .update({ is_featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;

      setQuotes(quotes.map(quote => 
        quote.id === id ? { ...quote, is_featured: !currentFeatured } : quote
      ));

      toast.success(`Quote ${!currentFeatured ? 'featured' : 'unfeatured'}`);
    } catch (error: any) {
      console.error('Error updating featured status:', error);
      toast.error("Failed to update featured status");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading quotes...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Quotes</CardTitle>
      </CardHeader>
      <CardContent>
        {quotes.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No quotes yet. Add your first quote above.
          </p>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <Card key={quote.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={quote.is_visible ? "default" : "secondary"}>
                        {quote.is_visible ? "Visible" : "Hidden"}
                      </Badge>
                      {quote.is_featured && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <blockquote className="text-sm italic mb-3 border-l-2 pl-4">
                      "{quote.quote_text}"
                    </blockquote>
                    <div className="text-sm">
                      <span className="font-medium">{quote.author_name}</span>
                      <span className="text-muted-foreground"> • {quote.author_role}</span>
                      {quote.author_organization && (
                        <span className="text-muted-foreground"> • {quote.author_organization}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleFeatured(quote.id, quote.is_featured)}
                      title={quote.is_featured ? "Unfeature" : "Feature"}
                    >
                      <Star className={`h-4 w-4 ${quote.is_featured ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleVisibility(quote.id, quote.is_visible)}
                    >
                      {quote.is_visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditQuote?.(quote)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Quote</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this quote? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(quote.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuoteManagement;
