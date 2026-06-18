import React, { useState } from 'react';
import { Card, Input, Button } from '../components';
import { useAuth } from '../context';
import { Camera, User, Mail, ShieldAlert, BadgeCheck, Save } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      return toast.error('Display name cannot be empty');
    }
    
    setIsSaving(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        // Trigger a force reload of user profile state or just alert
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Force refresh the page or wait for onAuthStateChanged to sync
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent p-4 md:p-8 flex justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      <div className="w-full max-w-3xl space-y-6 relative z-10">
        <h1 className="text-3xl font-extrabold text-text mb-8">Profile Settings</h1>
        
        <Card className="backdrop-blur-xl bg-surface/40">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-3xl bg-surface border-4 border-background shadow-lg flex items-center justify-center overflow-hidden group">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.displayName || currentUser?.email || 'Felix'}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <BadgeCheck className="text-primary" size={24} />
            </div>

            {/* Form Section */}
            <form onSubmit={handleSaveChanges} className="flex-1 w-full space-y-6">
              <div className="flex justify-between items-center border-b border-border/40 pb-4">
                <h2 className="text-xl font-bold text-text flex items-center">
                  <User className="mr-2 text-primary" size={20} />
                  Personal Information
                </h2>
                <Button 
                  type="button"
                  variant={isEditing ? 'outline' : 'primary'} 
                  size="sm"
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setDisplayName(currentUser?.displayName || '');
                  }}
                  disabled={isSaving}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <Input 
                  label="Display Name" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!isEditing || isSaving} 
                  placeholder="Your Full Name"
                />
                
                <div className="w-full">
                  <label className="block text-sm font-semibold text-text/80 mb-1.5 flex items-center">
                    <Mail size={14} className="mr-1.5 text-text-muted" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 bg-surface/20 border border-border/60 backdrop-blur-sm rounded-xl text-text-muted cursor-not-allowed opacity-75 font-medium"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold text-text/80 mb-1.5 flex items-center">
                    <ShieldAlert size={14} className="mr-1.5 text-text-muted" /> Security Status
                  </label>
                  <div className="px-4 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-500 flex items-center">
                    Firebase Authentication Shield Active
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <Button type="submit" isLoading={isSaving} disabled={isSaving} className="flex items-center">
                    Save Changes <Save size={16} className="ml-1.5" />
                  </Button>
                </div>
              )}
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};
