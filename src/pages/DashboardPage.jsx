import React, { useEffect, useState } from 'react';
import { Card, Badge, Button, Input, Spinner } from '../components';
import { useAuth } from '../context';
import { getItems, createItem } from '../api/client';
import { Activity, Users, Package, ListPlus, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsFetching(true);
      }
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load items from server');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadItems = async () => {
      try {
        const data = await getItems();
        if (active) {
          setItems(data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load items from server');
      } finally {
        if (active) {
          setIsFetching(false);
        }
      }
    };
    loadItems();
    return () => {
      active = false;
    };
  }, []);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!itemName || !itemDesc) {
      return toast.error('Please enter name and description');
    }
    
    setIsSubmitting(true);
    try {
      const newItem = await createItem({ name: itemName, description: itemDesc });
      setItems((prev) => [newItem, ...prev]);
      setItemName('');
      setItemDesc('');
      toast.success('Item created successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent p-4 md:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text">
              Dashboard
            </h1>
            <p className="text-text-muted mt-1.5 font-medium">
              Welcome back, <span className="text-primary font-bold">{currentUser?.displayName || currentUser?.email || 'Explorer'}</span>!
            </p>
          </div>
          <Badge variant="primary" className="self-start px-3 py-1 text-xs uppercase tracking-wider font-semibold">
            API Live Sync Active
          </Badge>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-muted font-semibold text-sm">Real-time Items</h3>
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Package size={20} />
              </div>
            </div>
            <p className="text-3xl font-black text-text mb-2">{isFetching ? '...' : items.length}</p>
            <div className="flex items-center text-xs font-semibold text-text-muted">
              <span className="text-primary mr-1.5">Active</span> items linked to account
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-muted font-semibold text-sm">Server Latency</h3>
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Activity size={20} />
              </div>
            </div>
            <p className="text-3xl font-black text-text mb-2">42ms</p>
            <div className="flex items-center text-xs font-semibold text-text-muted">
              <Badge variant="success" className="mr-1.5">Optimal</Badge> Response time
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-muted font-semibold text-sm">Firebase Sync</h3>
              <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500">
                <Users size={20} />
              </div>
            </div>
            <p className="text-3xl font-black text-text mb-2">Enabled</p>
            <div className="flex items-center text-xs font-semibold text-text-muted">
              Connected as <span className="text-purple-400 font-bold ml-1">{currentUser?.email?.split('@')[0]}</span>
            </div>
          </Card>
        </div>

        {/* Double-Panel Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Item Panel (5 cols) */}
          <div className="lg:col-span-5">
            <Card className="h-full">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <ListPlus className="mr-2 text-primary" size={20} />
                Create Database Item
              </h2>
              
              <form onSubmit={handleCreateItem} className="space-y-4">
                <Input 
                  label="Item Name" 
                  placeholder="e.g. Server Edge Node"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  disabled={isSubmitting}
                />
                
                <div className="w-full">
                  <label className="block text-sm font-semibold text-text/80 mb-1.5">Description</label>
                  <textarea
                    rows="4"
                    placeholder="Provide details about this serverless edge instance..."
                    className="w-full px-4 py-2.5 bg-surface/30 border border-border backdrop-blur-sm rounded-xl text-text placeholder-text/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-none disabled:opacity-50"
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <Button type="submit" className="w-full mt-2 flex items-center justify-center" isLoading={isSubmitting} disabled={isSubmitting}>
                  Add Item <Send size={16} className="ml-1.5" />
                </Button>
              </form>
            </Card>
          </div>

          {/* Items List Panel (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Package className="mr-2 text-primary" size={20} />
                  Your Cloud Items
                </h2>
                <Button variant="outline" size="sm" onClick={() => fetchItems(true)} className="text-xs">
                  Refresh
                </Button>
              </div>

              {isFetching ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-3">
                  <Spinner size="lg" />
                  <p className="text-sm text-text-muted font-medium">Querying Render databases...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16 space-y-4 border border-dashed border-border/60 rounded-2xl bg-surface/10">
                  <div className="p-4 bg-primary/5 rounded-full text-primary/60">
                    <Package size={40} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">No Items Yet</h3>
                    <p className="text-sm text-text-muted max-w-xs mt-1 font-medium">Create your first item on the left panel to save it on the Render cloud database.</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto max-h-[420px] space-y-4 pr-1">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-5 rounded-2xl border border-border/60 bg-surface/20 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-text group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-sm text-text-muted mt-1 leading-relaxed font-medium">
                            {item.description}
                          </p>
                        </div>
                        <Badge variant="success" className="text-[10px] uppercase font-semibold">
                          Stored
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center text-[10px] text-text-muted font-semibold tracking-wider uppercase border-t border-border/30 pt-3">
                        <span className="text-primary mr-1">Owner ID:</span> {item.owner_id.substring(0, 8)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};
