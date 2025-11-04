import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface TeamMemberFormProps {
  onMemberAdded: () => void;
  editingMember?: any;
  onCancelEdit?: () => void;
}

const TeamMemberForm = ({ onMemberAdded, editingMember, onCancelEdit }: TeamMemberFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    latitude: "",
    longitude: "",
    bio: "",
    profile_image_url: "",
    email: "",
    school: "",
  });

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name || "",
        role: editingMember.role || "",
        location: editingMember.location || "",
        latitude: editingMember.latitude?.toString() || "",
        longitude: editingMember.longitude?.toString() || "",
        bio: editingMember.bio || "",
        profile_image_url: editingMember.profile_image_url || "",
        email: editingMember.email || "",
        school: editingMember.school || "",
      });
    }
  }, [editingMember]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.location || !formData.latitude || !formData.longitude) {
      toast.error("Please fill in all required fields");
      return;
    }

    const memberData = {
      name: formData.name,
      role: formData.role,
      location: formData.location,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      bio: formData.bio || null,
      profile_image_url: formData.profile_image_url || null,
      email: formData.email || null,
      school: formData.school || null,
    };

    try {
      if (editingMember) {
        const { error } = await supabase
          .from("team_members")
          .update(memberData)
          .eq("id", editingMember.id);

        if (error) throw error;
        toast.success("Team member updated successfully");
      } else {
        const { error } = await supabase
          .from("team_members")
          .insert([memberData]);

        if (error) throw error;
        toast.success("Team member added successfully");
      }

      setFormData({
        name: "",
        role: "",
        location: "",
        latitude: "",
        longitude: "",
        bio: "",
        profile_image_url: "",
        email: "",
        school: "",
      });

      onMemberAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      role: "",
      location: "",
      latitude: "",
      longitude: "",
      bio: "",
      profile_image_url: "",
      email: "",
      school: "",
    });
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add team members to the world map. Use{" "}
          <a
            href="https://www.latlong.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            LatLong.net
          </a>{" "}
          to find coordinates.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Software Engineer"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="New York, USA"
                required
              />
            </div>

            <div>
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="University Name"
              />
            </div>

            <div>
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="40.7128"
                required
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="-74.0060"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="profile_image_url">Profile Image URL</Label>
              <Input
                id="profile_image_url"
                value={formData.profile_image_url}
                onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about this team member..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              {editingMember ? "Update Member" : "Add Member"}
            </Button>
            {editingMember && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeamMemberForm;
