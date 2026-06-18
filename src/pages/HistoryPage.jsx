import React, { useEffect, useState } from 'react';
import { Card, Badge, Button, Spinner } from '../components';
import { getAnalyses, deleteAnalysis } from '../api/client';
import { History, Search, Trash2, RefreshCw, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

// Custom Brand Icons since older lucide-react versions don't export them
const InstagramIcon = ({ className, size = 24 }) => (
  <svg className={className} viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ className, size = 24 }) => (
  <svg className={className} viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const FacebookIcon = ({ className, size = 24 }) => (
  <svg className={className} viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export const HistoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  
  // Filtering & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchLogs = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsFetching(true);
      }
      const data = await getAnalyses();
      // Reverse array so latest is on top
      setLogs(data.reverse());
    } catch (error) {
      console.error(error);
      toast.error('Failed to load history logs');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadLogs = async () => {
      try {
        const data = await getAnalyses();
        if (active) {
          setLogs(data.reverse());
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load history logs');
      } finally {
        if (active) {
          setIsFetching(false);
        }
      }
    };
    loadLogs();
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteAnalysis(id);
      setLogs((prev) => prev.filter((item) => item.id !== id));
      toast.success('Log entry deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete log entry');
    }
  };

  const getPlatformIcon = (plat) => {
    switch (plat) {
      case 'Instagram': return <InstagramIcon className="text-pink-500" size={16} />;
      case 'X (Twitter)': return <TwitterIcon className="text-sky-400" size={16} />;
      case 'Facebook': return <FacebookIcon className="text-blue-600" size={16} />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Genuine': return <Badge variant="success">Genuine</Badge>;
      case 'Suspicious': return <Badge variant="warning">Suspicious</Badge>;
      case 'Fake': return <Badge variant="danger">Fake / Bot</Badge>;
      default: return null;
    }
  };

  // Filter logs based on search and selected options
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'All' || log.platform === filterPlatform;
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  // Calculate statistics
  const totalScans = logs.length;
  const fakeCount = logs.filter((log) => log.status === 'Fake').length;
  const suspiciousCount = logs.filter((log) => log.status === 'Suspicious').length;
  const genuineCount = logs.filter((log) => log.status === 'Genuine').length;

  return (
    <div className="relative min-h-screen bg-transparent p-4 md:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text">
              Scan History Logs
            </h1>
            <p className="text-text-muted mt-1.5 font-medium">
              View, search, and manage your previously audited accounts.
            </p>
          </div>
          <Button variant="outline" onClick={() => fetchLogs(true)} size="sm" className="self-start">
            <RefreshCw size={14} className="mr-1.5" /> Refresh List
          </Button>
        </header>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="p-4 md:p-6">
            <h3 className="text-text-muted font-semibold text-xs md:text-sm">Total Scans</h3>
            <p className="text-2xl md:text-3xl font-black text-text mt-2">{totalScans}</p>
          </Card>
          <Card className="p-4 md:p-6">
            <h3 className="text-text-muted font-semibold text-xs md:text-sm">Genuine Found</h3>
            <p className="text-2xl md:text-3xl font-black text-emerald-500 mt-2">{genuineCount}</p>
          </Card>
          <Card className="p-4 md:p-6">
            <h3 className="text-text-muted font-semibold text-xs md:text-sm">Suspicious Found</h3>
            <p className="text-2xl md:text-3xl font-black text-amber-500 mt-2">{suspiciousCount}</p>
          </Card>
          <Card className="p-4 md:p-6">
            <h3 className="text-text-muted font-semibold text-xs md:text-sm">Fakes Identified</h3>
            <p className="text-2xl md:text-3xl font-black text-red-500 mt-2">{fakeCount}</p>
          </Card>
        </div>

        {/* Filtering & Listing Controls */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative md:col-span-6">
              <Search className="absolute left-3 top-3.5 text-text-muted pointer-events-none" size={18} />
              <input
                type="text"
                placeholder="Search username (e.g. @john_doe)..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface/30 border border-border backdrop-blur-sm rounded-xl text-text placeholder-text/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Platform Filter */}
            <div className="md:col-span-3">
              <select
                className="w-full px-4 py-2.5 bg-surface/30 border border-border backdrop-blur-sm rounded-xl text-text font-semibold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
              >
                <option value="All">All Networks</option>
                <option value="Instagram">Instagram</option>
                <option value="X (Twitter)">X (Twitter)</option>
                <option value="Facebook">Facebook</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                className="w-full px-4 py-2.5 bg-surface/30 border border-border backdrop-blur-sm rounded-xl text-text font-semibold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Ratings</option>
                <option value="Genuine">Genuine Only</option>
                <option value="Suspicious">Suspicious Only</option>
                <option value="Fake">Fake Only</option>
              </select>
            </div>

          </div>
        </Card>

        {/* History List */}
        <div>
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Spinner size="lg" />
              <p className="text-sm text-text-muted font-semibold">Retrieving history logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <Card className="flex flex-col items-center justify-center text-center py-20 space-y-4 border border-dashed border-border/60 bg-surface/5">
              <div className="p-4 bg-primary/5 rounded-full text-primary/60">
                <History size={40} />
              </div>
              <div>
                <h3 className="text-lg font-bold">No Audit Logs Found</h3>
                <p className="text-sm text-text-muted mt-1 max-w-xs font-semibold">
                  {logs.length === 0 
                    ? 'Scan social media accounts to generate logs in your database.' 
                    : 'Adjust your search parameters or select different filters.'}
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLogs.map((log) => (
                <Card 
                  key={log.id} 
                  className="flex flex-col justify-between border border-border/60 hover:border-primary/30 transition-all duration-300 relative group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getPlatformIcon(log.platform)}
                        <div>
                          <h4 className="font-extrabold text-text text-sm sm:text-base group-hover:text-primary transition-colors">
                            {log.username}
                          </h4>
                          <p className="text-[10px] text-text-muted font-bold tracking-wider uppercase">
                            {log.platform}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>

                    {/* Stats summary */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-4 border rounded-xl bg-surface/10 border-border/40 text-center">
                      <div>
                        <span className="block text-xs font-black text-text">{log.followers}</span>
                        <span className="text-[9px] font-bold text-text-muted uppercase">Followers</span>
                      </div>
                      <div>
                        <span className="block text-xs font-black text-text">{log.following}</span>
                        <span className="text-[9px] font-bold text-text-muted uppercase">Following</span>
                      </div>
                      <div>
                        <span className="block text-xs font-black text-text">{log.posts}</span>
                        <span className="text-[9px] font-bold text-text-muted uppercase">Posts</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 text-xs font-semibold text-text-muted">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1.5 text-text-muted" />
                      <span>Score: **{log.score}%**</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(log.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/5 p-1 rounded-lg"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
