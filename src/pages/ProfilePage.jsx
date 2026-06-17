import React, { useState } from 'react';
import { Card, Input, Button } from '../components';
import { Camera } from 'lucide-react';

export const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-text mb-8">Profile Settings</h1>
        
        <Card>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-full bg-surface border-4 border-background shadow-lg flex items-center justify-center overflow-hidden group">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <Button variant="outline" size="sm">Change Avatar</Button>
            </div>

            {/* Form Section */}
            <div className="flex-1 w-full space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <h2 className="text-xl font-bold text-text">Personal Information</h2>
                <Button 
                  variant={isEditing ? 'outline' : 'primary'} 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" defaultValue="John" disabled={!isEditing} />
                <Input label="Last Name" defaultValue="Doe" disabled={!isEditing} />
                <Input label="Email" type="email" defaultValue="john.doe@example.com" disabled={!isEditing} className="md:col-span-2" />
                <Input label="Role" defaultValue="Administrator" disabled className="md:col-span-2 opacity-70" />
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
