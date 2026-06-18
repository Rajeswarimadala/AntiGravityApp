import React, { useState } from 'react';
import { Card, Badge, Button } from '../components';
import { Bell, Info, ShieldAlert, AlertTriangle, ShieldCheck, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const NotificationsPage = () => {
  // Mock alerts logs
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'danger',
      title: 'Instagram Bot Farm Flagged',
      description: 'System identified a coordinated bot spam campaign originating from eastern servers. Over 14,000 newly created accounts have been blacklisted.',
      time: '2 hours ago',
      read: false,
      category: 'Security Alert'
    },
    {
      id: 2,
      type: 'warning',
      title: 'X.com Heuristics Update',
      description: 'X.com updated its layout. Our heuristic scanner rules have been updated to adapt to the new public user metadata formatting.',
      time: '1 day ago',
      read: false,
      category: 'System Update'
    },
    {
      id: 3,
      type: 'info',
      title: 'Email Security Verification active',
      description: 'Firebase Authentication settings have been upgraded. Double-factor authorization checks are now supported for all new accounts.',
      time: '3 days ago',
      read: true,
      category: 'Privacy Security'
    },
    {
      id: 4,
      type: 'success',
      title: 'Scan Accuracy Rated 99.4%',
      description: 'Third-party compliance audit rated SocialGuard detection heuristic accuracy at a record high of 99.4% against complex botnets.',
      time: '1 week ago',
      read: true,
      category: 'System Audit'
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    toast.success('All notifications marked as read');
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger': return <ShieldAlert className="text-red-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'success': return <ShieldCheck className="text-emerald-500" size={20} />;
      default: return <Info className="text-primary" size={20} />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'danger': return 'danger';
      case 'warning': return 'warning';
      case 'success': return 'success';
      default: return 'primary';
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent p-4 md:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text flex items-center">
              <Bell className="mr-2 text-primary" size={28} />
              Security Alerts & Updates
            </h1>
            <p className="text-text-muted mt-1.5 font-medium">
              Important alerts and updates compiled by the SocialGuard intelligence stream.
            </p>
          </div>
          {notifications.some(n => !n.read) && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="self-start flex items-center">
              <CheckCheck size={14} className="mr-1.5" /> Mark all read
            </Button>
          )}
        </header>

        {/* Notifications list */}
        <div className="space-y-4">
          {notifications.map((notif) => (
            <Card 
              key={notif.id}
              className={`border transition-all duration-300 relative overflow-hidden ${
                notif.read 
                  ? 'border-border/40 bg-surface/10 opacity-80' 
                  : 'border-primary/20 bg-surface/30 shadow-primary/5 hover:border-primary/40'
              }`}
            >
              {/* Left glow line for unread */}
              {!notif.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
              )}

              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl bg-surface/50 border border-border/40 flex-shrink-0`}>
                  {getAlertIcon(notif.type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-bold text-text ${!notif.read ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 animate-ping"></span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-text-muted font-bold uppercase tracking-wider">
                      <Badge variant={getBadgeVariant(notif.type)}>
                        {notif.category}
                      </Badge>
                      <span>•</span>
                      <span>{notif.time}</span>
                    </div>
                  </div>

                  <p className="text-sm text-text-muted font-medium leading-relaxed">
                    {notif.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};
