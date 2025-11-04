import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QuoteFormProps {
  onQuoteAdded?: () => void;
  editingQuote?: any;
  onCancelEdit?: () => void;
}

const QuoteForm = ({ onQuoteAdded, editingQuote, onCancelEdit }: QuoteFormProps) => {
  const [quoteText, setQuoteText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [authorOrganization, setAuthorOrganization] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingQuote) {
      setQuoteText(editingQuote.quote_text || "");
      setAuthorName(editingQuote.author_name || "");
      setAuthorRole(editingQuote.author_role || "");
      setAuthorOrganization(editingQuote.author_organization || "");
      setDisplayOrder(editingQuote.display_order?.toString() || "0");
      setIsFeatured(editingQuote.is_featured ?? false);
      setIsVisible(editingQuote.is_visible ?? true);

      // Focus the textarea when entering edit mode
      setTimeout(() => {
        const el = textareaRef.current;
        if (el) {
          el.focus();
          const len = (editingQuote.quote_text || "").length;
          try { el.setSelectionRange(len, len); } catch {}
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 0);
    }
  }, [editingQuote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const quoteData = {
        quote_text: quoteText,
        author_name: authorName,
        author_role: authorRole,
        author_organization: authorOrganization || null,
        display_order: parseInt(displayOrder),
        is_featured: isFeatured,
        is_visible: isVisible,
      };

      if (editingQuote) {
        const { error } = await supabase
          .from('featured_quotes')
          .update(quoteData)
          .eq('id', editingQuote.id);

        if (error) throw error;
        toast.success("Quote updated successfully!");
        onCancelEdit?.();
      } else {
        const { error } = await supabase
          .from('featured_quotes')
          .insert([quoteData]);

        if (error) throw error;
        toast.success("Quote added successfully!");
      }

      // Reset form
      setQuoteText("");
      setAuthorName("");
      setAuthorRole("");
      setAuthorOrganization("");
      setDisplayOrder("0");
      setIsFeatured(false);
      setIsVisible(true);

      onQuoteAdded?.();
    } catch (error: any) {
      console.error('Error saving quote:', error);
      toast.error(error.message || "Failed to save quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingQuote ? "Edit Quote" : "Add New Quote"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quote-text">Quote Text</Label>
            <Textarea
              id="quote-text"
              ref={textareaRef}
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              placeholder="Enter the quote..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author-name">Author Name</Label>
              <Input
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g., John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author-role">Author Role</Label>
              <Input
                id="author-role"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g., Student"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author-org">Organization (Optional)</Label>
              <Input
                id="author-org"
                value={authorOrganization}
                onChange={(e) => setAuthorOrganization(e.target.value)}
                placeholder="e.g., XYZ High School"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-order">Display Order</Label>
              <Input
                id="display-order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="space-y-2">
              <Label htmlFor="is-featured">Featured</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="is-featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
                <span className="text-sm text-muted-foreground">
                  {isFeatured ? "Featured" : "Not Featured"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="is-visible">Visible</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="is-visible"
                  checked={isVisible}
                  onCheckedChange={setIsVisible}
                />
                <span className="text-sm text-muted-foreground">
                  {isVisible ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (editingQuote ? "Update Quote" : "Add Quote")}
            </Button>
            {editingQuote && onCancelEdit && (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuoteForm;
