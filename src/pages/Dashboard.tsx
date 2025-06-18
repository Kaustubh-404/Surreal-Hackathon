
import React, { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useStory } from '../hooks/useStory';
import { Link } from 'react-router-dom';
import { DisputeTargetTag } from '@story-protocol/core-sdk';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { 
    user, 
    ipAssets, 
    reports, 
    notifications, 
    stats, 
    setLoading, 
    setError 
  } = useAppStore();
  const { isConnected, isInitialized, isLoading, address } = useStory();

  useEffect(() => {
    if (!isConnected || !address) {
      setError('Please connect your wallet to view your dashboard.');
    } else {
      setError(null);
    }
  }, [isConnected, address, setError]);

  const handleDismissNotification = (id: string) => {
    useAppStore.getState().removeNotification(id);
    toast.success('Notification dismissed.');
  };

  if (isLoading || !isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {!isConnected ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">Please connect your wallet to access your dashboard.</p>
        </div>
      ) : (
        <>
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold">IP Assets</h2>
              <p className="text-2xl font-bold">{stats.totalIPAssets}</p>
              <Link to="/portfolio" className="text-blue-500 hover:underline">View Portfolio</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Reports Filed</h2>
              <p className="text-2xl font-bold">{stats.totalReports}</p>
              <Link to="/reports" className="text-blue-500 hover:underline">View Reports</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Total Staked</h2>
              <p className="text-2xl font-bold">{stats.totalStaked.toString()} IP</p>
              <Link to="/staking" className="text-blue-500 hover:underline">Manage Staking</Link>
            </div>
          </div>

          {/* Recent IP Assets */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent IP Assets</h2>
            {ipAssets.length === 0 ? (
              <p className="text-gray-500">No IP assets registered yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ipAssets.slice(0, 4).map((asset) => (
                  <div key={asset.id} className="border p-4 rounded-lg">
                    <h3 className="font-semibold">{asset.title}</h3>
                    <p className="text-sm text-gray-600">{asset.description}</p>
                    <p className="text-sm">Category: {asset.category}</p>
                    <Link to={`/ip/${asset.id}`} className="text-blue-500 hover:underline">View Details</Link>
                  </div>
                ))}
              </div>
            )}
            <Link to="/register-ip" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Register New IP
            </Link>
          </div>

          {/* Recent Reports */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
            {reports.length === 0 ? (
              <p className="text-gray-500">No reports filed yet.</p>
            ) : (
              <div className="space-y-4">
                {reports.slice(0, 3).map((report) => (
                  <div key={report.id} className="border p-4 rounded-lg">
                    <h3 className="font-semibold">Report #{report.id}</h3>
                    <p className="text-sm text-gray-600">Violation: {report.violationType}</p>
                    <p className="text-sm">Status: {report.status}</p>
                    <Link to={`/reports/${report.id}`} className="text-blue-500 hover:underline">View Report</Link>
                  </div>
                ))}
              </div>
            )}
            <Link to="/reports" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View All Reports
            </Link>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications.</p>
            ) : (
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex justify-between items-center border p-4 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      {notification.action && (
                        <a href={notification.action.url} className="text-blue-500 hover:underline">{notification.action.label}</a>
                      )}
                    </div>
                    <button
                      onClick={() => handleDismissNotification(notification.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
