import React from 'react';
import { Card, Badge } from '../components';
import { Activity, Users, DollarSign, ArrowUpRight } from 'lucide-react';

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text">Dashboard</h1>
          <p className="text-text/70 mt-1">Welcome back! Here's what's happening today.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text/70 font-medium">Total Revenue</h3>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <DollarSign size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-text mb-2">$45,231.89</p>
            <div className="flex items-center text-sm">
              <Badge variant="success" className="mr-2">+20.1%</Badge>
              <span className="text-text/50">from last month</span>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text/70 font-medium">Active Users</h3>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-text mb-2">+2350</p>
            <div className="flex items-center text-sm">
              <Badge variant="primary" className="mr-2">+180.1%</Badge>
              <span className="text-text/50">from last month</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text/70 font-medium">Active Subscriptions</h3>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <Activity size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-text mb-2">+12,234</p>
            <div className="flex items-center text-sm">
              <Badge variant="success" className="mr-2">+19%</Badge>
              <span className="text-text/50">from last month</span>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-xl font-bold text-text mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    U{i}
                  </div>
                  <div>
                    <p className="text-text font-medium">User {i} subscribed to Pro plan</p>
                    <p className="text-sm text-text/50">{i} hour{i > 1 ? 's' : ''} ago</p>
                  </div>
                </div>
                <ArrowUpRight className="text-text/30" size={20} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
