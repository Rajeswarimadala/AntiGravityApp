import React, { useEffect, useState } from 'react';
import { Card, Badge, Button, Spinner, Modal } from '../components';
import { getAnalyses, deleteAnalysis, reportAnalysis } from '../api/client';
import { History, Search, Trash2, RefreshCw, Calendar, Download, ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
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
  const [selectedLog, setSelectedLog] = useState(null);
  const [isReporting, setIsReporting] = useState(false);
  
  // Filtering & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

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

  const fetchLogs = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsFetching(true);
      }
      const data = await getAnalyses();
      setLogs(data.reverse());
    } catch (error) {
      console.error(error);
      toast.error('Failed to load history logs');
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Stop card click from triggering
    try {
      await deleteAnalysis(id);
      setLogs((prev) => prev.filter((item) => item.id !== id));
      if (selectedLog?.id === id) {
        setSelectedLog(null);
      }
      toast.success('Log entry deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete log entry');
    }
  };

  const handleReportLocally = async (id, e) => {
    if (e) e.stopPropagation();
    setIsReporting(true);
    try {
      await reportAnalysis(id);
      setLogs((prev) => prev.map((item) => item.id === id ? { ...item, reported: true } : item));
      setSelectedLog((prev) => prev && prev.id === id ? { ...prev, reported: true } : prev);
      toast.success('Account reported locally in ImposterX database!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to register local report');
    } finally {
      setIsReporting(false);
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


  const getStatusBadge = (status, reported) => {
    if (reported) {
      return <Badge variant="danger">Reported</Badge>;
    }
    switch (status) {
      case 'Genuine': return <Badge variant="success">Genuine</Badge>;
      case 'Suspicious': return <Badge variant="warning">Suspicious</Badge>;
      case 'Fake': return <Badge variant="danger">Fake / Bot</Badge>;
      default: return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Genuine': return <ShieldCheck className="text-emerald-500" size={36} />;
      case 'Suspicious': return <AlertTriangle className="text-amber-500" size={36} />;
      case 'Fake': return <ShieldAlert className="text-red-500" size={36} />;
      default: return null;
    }
  };

  // Reconstruct audit reasons on the fly
  const getAuditReasons = (log) => {
    if (!log) return [];
    const reasons = [];
    const numFollowers = log.followers;
    const numFollowing = log.following;
    const numPosts = log.posts;

    if (numFollowers === 0) {
      reasons.push('Account has 0 followers.');
    } else if (numFollowing > 1000 && numFollowers < 50) {
      reasons.push('Extremely anomalous follower-to-following ratio (bot pattern).');
    } else if (numFollowing > 3000 && numFollowers < 500) {
      reasons.push('High following compared to low follower count.');
    }

    if (numPosts === 0) {
      reasons.push('Account has zero posts/tweets.');
    }

    if (log.score < 45) {
      reasons.push('High suspicious rating based on overall behavioral indicators.');
    }

    if (reasons.length === 0) {
      reasons.push('No suspicious bot patterns identified.');
    }

    return reasons;
  };

  const getReportLink = (plat) => {
    switch (plat) {
      case 'Instagram': return 'https://www.instagram.com';
      case 'X (Twitter)': return 'https://x.com';
      case 'Facebook': return 'https://www.facebook.com';
      default: return 'https://google.com';
    }
  };

  // Compile and download ASCII Audit Report
  const downloadReport = (log) => {
    const reasons = getAuditReasons(log);
    const reportContent = `==================================================
                 IMPOSTERX AUDIT REPORT           
==================================================
Generated on: ${new Date().toLocaleString()}
Audit ID:     ${log.id}
Owner ID:     ${log.owner_id}

--------------------------------------------------
ACCOUNT PROFILE DETAILS
--------------------------------------------------
Platform:     ${log.platform}
Username:     ${log.username}
Followers:    ${log.followers}
Following:    ${log.following}
Post Count:   ${log.posts}

--------------------------------------------------
VERIFICATION METRICS
--------------------------------------------------
Integrity Score:  ${log.score}%
Security Status:  ${log.status.toUpperCase()}
Reported Status:  ${log.reported ? 'REPORTED & FLAGGED IN IMPOSTERX' : 'NOT REPORTED'}

--------------------------------------------------
AUDIT FINDINGS & HEURISTICS
--------------------------------------------------
${reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}

==================================================
            SECURED BY IMPOSTERX INTELLIGENCE
==================================================
`;

    const element = document.createElement("a");
    const file = new Blob([reportContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ImposterX_Report_${log.username.replace('@', '')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Audit report downloaded successfully!');
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'All' || log.platform === filterPlatform;
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const totalScans = logs.length;
  const fakeCount = logs.filter((log) => log.status === 'Fake' || log.reported).length;
  const suspiciousCount = logs.filter((log) => log.status === 'Suspicious' && !log.reported).length;
  const genuineCount = logs.filter((log) => log.status === 'Genuine' && !log.reported).length;

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
              View, inspect, and generate reports for previously verified social profiles. Click a card to view detail report.
            </p>
          </div>
          <Button variant="outline" onClick={() => fetchLogs(true)} size="sm" className="self-start">
            <RefreshCw size={14} className="mr-1.5" /> Refresh List
          </Button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="p-4 md:p-6">
            <h3 className="text-text-muted font-semibold text-xs md:text-sm">Total Scans</h3>
            <p className="text-2xl md:text-3xl font-black text-text mt-2">{totalScans}</p>
          </Card>
          <Card className="p-4 md:p-6">
            <h3 className="text-text-muted font-semibold text-xs md:text-sm">Genuine</h3>
            <p className="text-2xl md:text-3xl font-black text-emerald-500 mt-2">{genuineCount}</p>
          </Card>
          <Card className="p-4 md:p-6">
            <h3 className="text-text-muted font-semibold text-xs md:text-sm">Suspicious</h3>
            <p className="text-2xl md:text-3xl font-black text-amber-500 mt-2">{suspiciousCount}</p>
          </Card>
          <Card className="p-4 md:p-6">
            <h3 className="text-text-muted font-semibold text-xs md:text-sm">Reported & Fakes</h3>
            <p className="text-2xl md:text-3xl font-black text-red-500 mt-2">{fakeCount}</p>
          </Card>
        </div>

        {/* Filter controls */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="relative md:col-span-6">
              <Search className="absolute left-3 top-3.5 text-text-muted pointer-events-none" size={18} />
              <input
                type="text"
                placeholder="Search username..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface/30 border border-border backdrop-blur-sm rounded-xl text-text placeholder-text/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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

            <div className="md:col-span-3">
              <select
                className="w-full px-4 py-2.5 bg-surface/30 border border-border backdrop-blur-sm rounded-xl text-text font-semibold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Ratings</option>
                <option value="Genuine">Genuine</option>
                <option value="Suspicious">Suspicious</option>
                <option value="Fake">Fake</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Logs Listing */}
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
                    ? 'Scan accounts on the scanner to see entries here.' 
                    : 'Adjust filters or search keywords.'}
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className="glass-panel cursor-pointer rounded-2xl shadow-xl p-5 flex flex-col justify-between border border-border/60 hover:-translate-y-1.5 hover:border-primary/40 transition-all duration-300 relative group"
                >
                  <div className="space-y-4">
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
                      {getStatusBadge(log.status, log.reported)}
                    </div>

                    <div className="grid grid-cols-3 gap-1 py-2 px-3 border rounded-xl bg-surface/10 border-border/40 text-center">
                      <div>
                        <span className="block text-xs font-black text-text">{log.followers}</span>
                        <span className="text-[8px] font-bold text-text-muted uppercase">Followers</span>
                      </div>
                      <div>
                        <span className="block text-xs font-black text-text">{log.following}</span>
                        <span className="text-[8px] font-bold text-text-muted uppercase">Following</span>
                      </div>
                      <div>
                        <span className="block text-xs font-black text-text">{log.posts}</span>
                        <span className="text-[8px] font-bold text-text-muted uppercase">Posts</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 text-xs font-semibold text-text-muted">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1.5 text-text-muted" />
                      <span>Score: **{log.score}%**</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => handleDelete(log.id, e)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/5 p-1 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Details View Modal */}
      {selectedLog && (
        <Modal 
          isOpen={!!selectedLog} 
          onClose={() => setSelectedLog(null)}
          title={`ImposterX Verification details`}
        >
          <div className="space-y-6 py-2">
            
            {/* Header Platform */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center space-x-2.5">
                {getPlatformIcon(selectedLog.platform)}
                <div>
                  <h3 className="font-extrabold text-lg text-text">{selectedLog.username}</h3>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider">{selectedLog.platform} audit</p>
                </div>
              </div>
              {getStatusBadge(selectedLog.status, selectedLog.reported)}
            </div>

            {/* Score Ring Section */}
            <div className="flex flex-col sm:flex-row gap-5 items-center p-5 border rounded-2xl bg-surface/10 border-border/60">
              {getStatusIcon(selectedLog.status)}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h4 className="text-lg font-bold">Verification Rating: {selectedLog.status}</h4>
                <p className="text-xs text-text-muted font-semibold leading-relaxed">
                  ImposterX scanned this page and established an authenticity probability score of {selectedLog.score}%.
                </p>
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex flex-col items-center justify-center bg-background/50">
                <span className="text-xl font-black">{selectedLog.score}%</span>
                <span className="text-[8px] uppercase tracking-wider font-bold text-text-muted">Score</span>
              </div>
            </div>

            {/* Profile Statistics */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Account metrics:</h4>
              <div className="grid grid-cols-3 gap-4 border border-border/60 p-4 rounded-xl text-center bg-surface/10">
                <div>
                  <span className="block text-lg font-extrabold">{selectedLog.followers}</span>
                  <span className="text-[10px] text-text-muted font-bold uppercase">Followers</span>
                </div>
                <div>
                  <span className="block text-lg font-extrabold">{selectedLog.following}</span>
                  <span className="text-[10px] text-text-muted font-bold uppercase">Following</span>
                </div>
                <div>
                  <span className="block text-lg font-extrabold">{selectedLog.posts}</span>
                  <span className="text-[10px] text-text-muted font-bold uppercase">Posts</span>
                </div>
              </div>
            </div>

            {/* Audit Findings */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Audit Findings:</h4>
              <ul className="space-y-2">
                {getAuditReasons(selectedLog).map((reason, i) => (
                  <li key={i} className="flex items-start text-xs sm:text-sm font-semibold text-text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => downloadReport(selectedLog)} 
                className="flex-1 flex items-center justify-center bg-primary hover:bg-primary-hover"
              >
                Download PDF Report <Download size={14} className="ml-1.5" />
              </Button>
              
              {!selectedLog.reported && selectedLog.status !== 'Genuine' && (
                <Button 
                  onClick={(e) => handleReportLocally(selectedLog.id, e)} 
                  isLoading={isReporting}
                  disabled={isReporting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-red-500/10"
                >
                  Report Account Locally
                </Button>
              )}

              {selectedLog.reported && (
                <div className="flex-1 py-2.5 border border-red-500/20 bg-red-500/5 rounded-xl text-center text-xs font-bold text-red-500 flex items-center justify-center">
                  Flagged & Reported in ImposterX
                </div>
              )}
            </div>

            {/* Direct Reporting Links Section */}
            {selectedLog.status !== 'Genuine' && (
              <div className="border-t border-border/20 pt-4 text-center">
                <a 
                  href={getReportLink(selectedLog.platform)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-primary hover:underline hover:text-primary-hover transition-all"
                >
                  Go to {selectedLog.platform} Platform Helpdesk <ExternalLink size={12} className="ml-1" />
                </a>
              </div>
            )}

          </div>
        </Modal>
      )}

    </div>
  );
};
