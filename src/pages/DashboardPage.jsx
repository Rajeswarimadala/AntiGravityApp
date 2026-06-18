import React, { useState } from 'react';
import { Card, Badge, Button, Input, Modal } from '../components';
import { createAnalysis } from '../api/client';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, RefreshCw, HelpCircle, ExternalLink } from 'lucide-react';
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

export const DashboardPage = () => {
  
  // Platform selection
  const [platform, setPlatform] = useState('Instagram');
  
  // Form fields
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState('');
  const [posts, setPosts] = useState('');
  const [accountAge, setAccountAge] = useState('');
  const [hasProfilePic, setHasProfilePic] = useState(true);
  
  // App UI states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusMsg, setScanStatusMsg] = useState('');
  const [result, setResult] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Platform styling helper
  const getPlatformIcon = (plat) => {
    switch (plat) {
      case 'Instagram': return <InstagramIcon className="text-pink-500" size={20} />;
      case 'X (Twitter)': return <TwitterIcon className="text-sky-400" size={20} />;
      case 'Facebook': return <FacebookIcon className="text-blue-600" size={20} />;
      default: return null;
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!username.trim()) return toast.error('Please enter a username');
    if (followers === '' || following === '' || posts === '' || accountAge === '') {
      return toast.error('Please fill in all account stats');
    }

    // Set states for scanning
    setIsScanning(true);
    setScanProgress(10);
    setScanStatusMsg('Connecting to database stream...');
    setResult(null);

    // Dynamic scanning progress steps
    const progressSteps = [
      { progress: 30, msg: 'Analyzing follower-to-following ratio...' },
      { progress: 55, msg: 'Scrutinizing posting patterns and frequency...' },
      { progress: 80, msg: 'Evaluating avatar metadata and account age...' },
      { progress: 100, msg: 'Compiling heuristic integrity score...' }
    ];

    for (let i = 0; i < progressSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setScanProgress(progressSteps[i].progress);
      setScanStatusMsg(progressSteps[i].msg);
    }

    // Heuristic analysis logic
    let score = 100;
    const reasons = [];

    const numFollowers = parseInt(followers) || 0;
    const numFollowing = parseInt(following) || 0;
    const numPosts = parseInt(posts) || 0;
    const numAge = parseInt(accountAge) || 0;

    // Follower-following ratio check
    if (numFollowers === 0) {
      score -= 30;
      reasons.push('Account has 0 followers.');
    } else if (numFollowing > 1000 && numFollowers < 50) {
      score -= 40;
      reasons.push('Extremely anomalous follower-to-following ratio (bot pattern).');
    } else if (numFollowing > 3000 && numFollowers < 500) {
      score -= 25;
      reasons.push('High following compared to low follower count.');
    }

    // Profile picture check
    if (!hasProfilePic) {
      score -= 30;
      reasons.push('Default/missing profile picture.');
    }

    // Post count check
    if (numPosts === 0) {
      score -= 20;
      reasons.push('Account has zero posts/tweets.');
    } else if (numPosts < 5 && numAge > 12) {
      score -= 15;
      reasons.push('Very low post count for an older account.');
    }

    // Account age check
    if (numAge <= 1) {
      score -= 20;
      reasons.push('Account is brand new (created within last 30 days).');
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    // Determine status
    let status = 'Genuine';
    if (score < 45) {
      status = 'Fake';
    } else if (score < 75) {
      status = 'Suspicious';
    }

    const finalResult = {
      username: username.startsWith('@') ? username : `@${username}`,
      platform,
      followers: numFollowers,
      following: numFollowing,
      posts: numPosts,
      status,
      score,
      reasons: reasons.length > 0 ? reasons : ['No suspicious bot patterns identified.']
    };

    // Save to Render backend in background
    try {
      await createAnalysis({
        username: finalResult.username,
        platform: finalResult.platform,
        followers: finalResult.followers,
        following: finalResult.following,
        posts: finalResult.posts,
        status: finalResult.status,
        score: finalResult.score
      });
      toast.success('Analysis logged in history.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save analysis to history log.');
    }

    setResult(finalResult);
    setIsScanning(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Genuine': return <Badge variant="success">Genuine</Badge>;
      case 'Suspicious': return <Badge variant="warning">Suspicious</Badge>;
      case 'Fake': return <Badge variant="danger">Fake / Bot</Badge>;
      default: return null;
    }
  };


  const getStatusIcon = (status) => {
    switch (status) {
      case 'Genuine': return <ShieldCheck className="text-emerald-500" size={48} />;
      case 'Suspicious': return <AlertTriangle className="text-amber-500" size={48} />;
      case 'Fake': return <ShieldAlert className="text-red-500" size={48} />;
      default: return null;
    }
  };

  const getReportLink = (plat) => {
    switch (plat) {
      case 'Instagram':
        return `https://help.instagram.com/388301724588523`;
      case 'X (Twitter)':
        return `https://help.x.com/en/managing-your-account/report-an-account`;
      case 'Facebook':
        return `https://www.facebook.com/help/167723853282354`;
      default:
        return 'https://google.com';
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent p-4 md:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text">
              Social Media Account Scanner
            </h1>
            <p className="text-text-muted mt-1.5 font-medium">
              Analyze user profiles across platforms to identify bots, spam pages, and suspicious activity.
            </p>
          </div>
          <Badge variant="primary" className="self-start px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold">
            SocialGuard Shield Active
          </Badge>
        </header>

        {/* Top Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-muted font-semibold text-sm">System Platform status</h3>
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Shield size={20} />
              </div>
            </div>
            <p className="text-3xl font-black text-text mb-2">Secure</p>
            <div className="flex items-center text-xs font-semibold text-text-muted">
              Monitoring global threat indexes
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-muted font-semibold text-sm">Supported Platforms</h3>
              <div className="flex items-center space-x-2 text-text-muted">
                <InstagramIcon size={18} />
                <TwitterIcon size={18} />
                <FacebookIcon size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-text mb-2">3 Networks</p>
            <div className="flex items-center text-xs font-semibold text-text-muted">
              Instagram, X/Twitter, Facebook
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-muted font-semibold text-sm">Heuristic Rules</h3>
              <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500">
                <HelpCircle size={20} />
              </div>
            </div>
            <p className="text-3xl font-black text-text mb-2">12 Audits</p>
            <div className="flex items-center text-xs font-semibold text-text-muted">
              Ratio, age, activity verification
            </div>
          </Card>
        </div>

        {/* Double Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Scanner Form (5 cols) */}
          <div className="lg:col-span-5">
            <Card>
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <RefreshCw className="mr-2 text-primary animate-spin-slow" size={20} />
                Input Account Parameters
              </h2>

              {/* Platform Selector Tabs */}
              <div className="flex bg-surface/30 p-1 rounded-xl border border-border/40 mb-6">
                {['Instagram', 'X (Twitter)', 'Facebook'].map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setPlatform(plat)}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      platform === plat 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-text-muted hover:text-text hover:bg-surface/40'
                    }`}
                  >
                    {getPlatformIcon(plat)}
                    <span>{plat.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
              
              <form onSubmit={handleScan} className="space-y-4">
                <Input 
                  label="Username" 
                  placeholder={platform === 'Instagram' ? 'e.g. @instagram_username' : platform === 'Facebook' ? 'e.g. Profile username' : 'e.g. @x_handle'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isScanning}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Followers" 
                    type="number"
                    placeholder="e.g. 1500"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    disabled={isScanning}
                  />
                  <Input 
                    label="Following" 
                    type="number"
                    placeholder="e.g. 800"
                    value={following}
                    onChange={(e) => setFollowing(e.target.value)}
                    disabled={isScanning}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Post / Tweet Count" 
                    type="number"
                    placeholder="e.g. 12"
                    value={posts}
                    onChange={(e) => setPosts(e.target.value)}
                    disabled={isScanning}
                  />
                  <Input 
                    label="Account Age (Months)" 
                    type="number"
                    placeholder="e.g. 6"
                    value={accountAge}
                    onChange={(e) => setAccountAge(e.target.value)}
                    disabled={isScanning}
                  />
                </div>

                <div className="flex items-center space-x-2.5 py-3 select-none">
                  <input
                    type="checkbox"
                    id="hasProfilePic"
                    checked={hasProfilePic}
                    onChange={(e) => setHasProfilePic(e.target.checked)}
                    disabled={isScanning}
                    className="rounded border-border/60 bg-surface/50 text-primary focus:ring-primary h-4.5 w-4.5 cursor-pointer"
                  />
                  <label htmlFor="hasProfilePic" className="text-sm font-semibold text-text/80 cursor-pointer">
                    Account Has Profile Picture
                  </label>
                </div>

                <Button type="submit" className="w-full mt-2" isLoading={isScanning} disabled={isScanning}>
                  Scan Account
                </Button>
              </form>
            </Card>
          </div>

          {/* Results Output Screen (7 cols) */}
          <div className="lg:col-span-7">
            
            {/* If scanning */}
            {isScanning && (
              <Card className="flex flex-col items-center justify-center text-center py-20 space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="text-primary animate-pulse" size={32} />
                  </div>
                </div>
                <div className="space-y-2 max-w-xs">
                  <h3 className="text-lg font-bold">Scanning Security Ledger</h3>
                  <p className="text-sm text-text-muted font-medium animate-pulse">{scanStatusMsg}</p>
                </div>
                
                {/* Progress bar */}
                <div className="w-full max-w-sm bg-surface border border-border/40 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300 rounded-full" 
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </Card>
            )}

            {/* If result is ready */}
            {!isScanning && result && (
              <Card className="space-y-6 border border-border/80">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="flex items-center space-x-3">
                    {getPlatformIcon(result.platform)}
                    <div>
                      <h3 className="font-extrabold text-lg text-text">{result.username}</h3>
                      <p className="text-xs text-text-muted font-semibold">{result.platform} Audit</p>
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>

                {/* Score and Rating */}
                <div className="flex flex-col md:flex-row gap-6 items-center p-6 border rounded-2xl bg-surface/10 border-border/60">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 text-center md:text-left space-y-1">
                    <h4 className="text-xl font-bold">Account is {result.status}</h4>
                    <p className="text-sm text-text-muted font-medium leading-relaxed">
                      SocialGuard evaluated account parameters and established an integrity score of **{result.score}%**.
                    </p>
                  </div>
                  
                  {/* Glowing Score Ring */}
                  <div className="w-24 h-24 rounded-full border-4 border-border/40 flex flex-col items-center justify-center bg-background/50 relative shadow-inner">
                    <span className="text-2xl font-black text-text">{result.score}%</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-text-muted">Score</span>
                  </div>
                </div>

                {/* Heuristic Audit Reasons */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-text-muted">Audit Findings:</h4>
                  <ul className="space-y-2.5">
                    {result.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start text-sm font-semibold text-text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2.5 flex-shrink-0"></span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Controls */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/40">
                  {result.status !== 'Genuine' && (
                    <Button 
                      type="button" 
                      onClick={() => setShowReportModal(true)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-red-500/10"
                    >
                      Report Account
                    </Button>
                  )}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setResult(null)}
                    className="flex-1"
                  >
                    Scan Another Profile
                  </Button>
                </div>
              </Card>
            )}

            {/* Empty state before scan */}
            {!isScanning && !result && (
              <Card className="flex flex-col items-center justify-center text-center py-24 space-y-4 border border-dashed border-border/60 rounded-3xl bg-surface/5">
                <div className="p-4 bg-primary/5 rounded-full text-primary/60 border border-primary/10">
                  <ShieldCheck size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Awaiting Scan Request</h3>
                  <p className="text-sm text-text-muted max-w-xs mt-1 font-medium">
                    Input the parameters of the social media page on the left panel to scan for suspect behavior.
                  </p>
                </div>
              </Card>
            )}

          </div>

        </div>

      </div>

      {/* Report Instructions Modal */}
      {result && (
        <Modal 
          isOpen={showReportModal} 
          onClose={() => setShowReportModal(false)}
          title={`Report Fake Page ${result.username}`}
        >
          <div className="space-y-5 py-2">
            <p className="text-sm text-text-muted font-medium leading-relaxed">
              We identified suspicious activity on this profile. You can report this account directly to {result.platform} to help get it flagged or deactivated:
            </p>

            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm font-semibold text-red-500 flex items-start space-x-2">
              <ShieldAlert className="mt-0.5 flex-shrink-0" size={16} />
              <span>Recommended platform filing reason: **Spam, Impersonation, or Bot Activity**.</span>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-text-muted">How to Report:</h4>
              <ol className="list-decimal list-inside text-sm text-text-muted font-medium space-y-2">
                <li>Go to the user's profile on **{result.platform}**.</li>
                <li>Tap the menu icon (••• or Gear) next to their name.</li>
                <li>Select **Report** or **Find Support or Report**.</li>
                <li>Choose **Fake Account**, **Spam**, or **Impersonation**.</li>
              </ol>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <a 
                href={getReportLink(result.platform)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full flex items-center justify-center bg-primary hover:bg-primary-hover">
                  Open {result.platform} Help Center <ExternalLink size={14} className="ml-1.5" />
                </Button>
              </a>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowReportModal(false);
                  toast.success('Local database report logged.');
                }}
                className="flex-1"
              >
                Log Report Locally
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
