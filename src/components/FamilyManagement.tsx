"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Users, 
  User, 
  Calendar, 
  FileText, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  birthDate?: string;
  documentCount: number;
  expiringSoon: number;
  expired: number;
}

interface FamilyManagementProps {
  onMemberAdded?: (member: FamilyMember) => void;
}

export function FamilyManagement({ onMemberAdded }: FamilyManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    birthDate: ""
  });

  // Mock family members data
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      relation: "Spouse",
      birthDate: "1985-03-15",
      documentCount: 8,
      expiringSoon: 2,
      expired: 0
    },
    {
      id: "2", 
      name: "Emma Johnson",
      relation: "Daughter",
      birthDate: "2010-07-22",
      documentCount: 5,
      expiringSoon: 1,
      expired: 0
    }
  ]);

  const handleAddMember = async () => {
    if (!formData.name || !formData.relation) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: formData.name,
      relation: formData.relation,
      birthDate: formData.birthDate || undefined,
      documentCount: 0,
      expiringSoon: 0,
      expired: 0
    };

    setFamilyMembers(prev => [...prev, newMember]);
    onMemberAdded?.(newMember);
    
    toast.success(`${formData.name} added to family`);
    
    // Reset form
    setFormData({ name: "", relation: "", birthDate: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditMember = (memberId: string) => {
    const member = familyMembers.find(m => m.id === memberId);
    if (member) {
      setFormData({
        name: member.name,
        relation: member.relation,
        birthDate: member.birthDate || ""
      });
      setIsEditing(memberId);
    }
  };

  const handleUpdateMember = () => {
    if (!isEditing) return;

    setFamilyMembers(prev => 
      prev.map(member => 
        member.id === isEditing 
          ? { ...member, ...formData }
          : member
      )
    );

    toast.success("Family member updated");
    setIsEditing(null);
    setFormData({ name: "", relation: "", birthDate: "" });
  };

  const handleDeleteMember = (memberId: string) => {
    const member = familyMembers.find(m => m.id === memberId);
    if (member) {
      setFamilyMembers(prev => prev.filter(m => m.id !== memberId));
      toast.success(`${member.name} removed from family`);
    }
  };

  const getRelationColor = (relation: string) => {
    const colors: Record<string, string> = {
      "Spouse": "bg-pink-100 text-pink-800",
      "Son": "bg-blue-100 text-blue-800",
      "Daughter": "bg-purple-100 text-purple-800",
      "Father": "bg-green-100 text-green-800",
      "Mother": "bg-yellow-100 text-yellow-800",
      "Other": "bg-gray-100 text-gray-800"
    };
    return colors[relation] || colors.Other;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Family Members</h2>
          <p className="text-gray-600">Manage documents for your entire family</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Family Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
              <DialogDescription>
                Add a family member to track their documents and renewals.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relation">Relation *</Label>
                <Select value={formData.relation} onValueChange={(value) => setFormData(prev => ({ ...prev, relation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Son">Son</SelectItem>
                    <SelectItem value="Daughter">Daughter</SelectItem>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>
                  Add Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Family Members Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {familyMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getRelationColor(member.relation)}>
                      {member.relation}
                    </Badge>
                    {member.birthDate && (
                      <span className="text-sm text-gray-500">
                        Age {getAge(member.birthDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Document Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">{member.documentCount}</div>
                  <div className="text-xs text-gray-500">Documents</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-orange-600">{member.expiringSoon}</div>
                  <div className="text-xs text-gray-500">Expiring Soon</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-red-600">{member.expired}</div>
                  <div className="text-xs text-gray-500">Expired</div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="space-y-2">
                {member.expired > 0 && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">{member.expired} expired document(s)</span>
                  </div>
                )}
                {member.expiringSoon > 0 && member.expired === 0 && (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{member.expiringSoon} document(s) expiring soon</span>
                  </div>
                )}
                {member.expired === 0 && member.expiringSoon === 0 && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">All documents up to date</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditMember(member.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteMember(member.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {familyMembers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No family members yet</h3>
            <p className="text-gray-600 mb-4">
              Add family members to track their documents and renewals
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Family Member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditing !== null} onOpenChange={() => setIsEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Family Member</DialogTitle>
            <DialogDescription>
              Update family member information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-relation">Relation *</Label>
              <Select value={formData.relation} onValueChange={(value) => setFormData(prev => ({ ...prev, relation: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Son">Son</SelectItem>
                  <SelectItem value="Daughter">Daughter</SelectItem>
                  <SelectItem value="Father">Father</SelectItem>
                  <SelectItem value="Mother">Mother</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-birthDate">Birth Date</Label>
              <Input
                id="edit-birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsEditing(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMember}>
                Update Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


