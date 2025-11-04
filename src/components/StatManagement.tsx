import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Edit, Eye, EyeOff } from "lucide-react";
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

interface StatManagementProps {
  onStatDeleted?: () => void;
  onEditStat?: (stat: any) => void;
}

const StatManagement = ({ onStatDeleted, onEditStat }: StatManagementProps) => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('site_stats')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStats(stats.filter(stat => stat.id !== id));
      toast.success("Statistic deleted successfully");
      onStatDeleted?.();
    } catch (error: any) {
      console.error('Error deleting statistic:', error);
      toast.error("Failed to delete statistic");
    }
  };

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('site_stats')
        .update({ is_visible: !currentVisibility })
        .eq('id', id);

      if (error) throw error;

      setStats(stats.map(stat => 
        stat.id === id ? { ...stat, is_visible: !currentVisibility } : stat
      ));

      toast.success(`Statistic ${!currentVisibility ? 'shown' : 'hidden'}`);
    } catch (error: any) {
      console.error('Error updating visibility:', error);
      toast.error("Failed to update visibility");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading statistics...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {stats.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No statistics yet. Add your first statistic above.
          </p>
        ) : (
          <div className="space-y-4">
            {stats.map((stat) => (
              <Card key={stat.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{stat.stat_label}</h3>
                      <Badge variant={stat.is_visible ? "default" : "secondary"}>
                        {stat.is_visible ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Value: </span>
                        <span className="font-medium">{stat.stat_value}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Icon: </span>
                        <span className="font-medium">{stat.icon_name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Key: </span>
                        <span className="font-mono text-xs">{stat.stat_key}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Order: </span>
                        <span className="font-medium">{stat.display_order}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleVisibility(stat.id, stat.is_visible)}
                    >
                      {stat.is_visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditStat?.(stat)}
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
                          <AlertDialogTitle>Delete Statistic</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{stat.stat_label}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(stat.id)}>
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

export default StatManagement;
