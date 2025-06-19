
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useStory } from '../hooks/useStory';
import { Link } from 'react-router-dom';
import { DisputeTargetTag } from '@story-protocol/core-sdk';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const { reports, user, setError, setLoading } = useAppStore();
  const { isConnected, isInitialized, isLoading, address, raiseDispute } = useStory();
  const [userReports, setUserReports] = useState(reports.filter((report) => report.reporterAddress === address));
  const [disputeForm, setDisputeForm] = useState({
    targetIpId: '',
    evidence: '',
    targetTag: DisputeTargetTag.IMPROPER_REGISTRATION,
    bond: '0.1',
  });

  useEffect(() => {
    if (!isConnected || !address) {
      setError('Please connect your wallet to view your reports.');
    } else {
      setError(null);
      setUserReports(reports.filter((report) => report.reporterAddress === address));
    }
  }, [isConnected, address, reports, setError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDisputeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !isInitialized || !address) {
      setError('Wallet not connected or Story client not initialized.');
      return;
    }

    try {
      setLoading(true);
      await raiseDispute({
        targetIpId: disputeForm.targetIpId,
        evidence: disputeForm.evidence,
        targetTag: disputeForm.targetTag as DisputeTargetTag,
        bond: disputeForm.bond,
      });
      setDisputeForm({
        targetIpId: '',
        evidence: '',
        targetTag: DisputeTargetTag.IMPROPER_REGISTRATION,
        bond: '0.1',
      });
      toast.success('Dispute raised successfully!');
    } catch (error) {
      console.error('Error raising dispute:', error);
      setError('Failed to raise dispute.');
      toast.error('Failed to raise dispute.');
    } finally {
      setLoading(false);
    }
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
      <h1 className="text-3xl font-bold mb-6">My Reports</h1>

      {!isConnected ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">Please connect your wallet to view your reports.</p>
        </div>
      ) : (
        <>
          {/* Raise Dispute Form */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Raise New Dispute</h2>
            <form onSubmit={handleSubmitDispute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Target IP ID</label>
                <input
                  type="text"
                  name="targetIpId"
                  value={disputeForm.targetIpId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Evidence</label>
                <textarea
                  name="evidence"
                  value={disputeForm.evidence}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dispute Type</label>
                <select
                  name="targetTag"
                  value={disputeForm.targetTag}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value={DisputeTargetTag.IMPROPER_REGISTRATION}>Improper Registration</option>
                  {/* TODO: Add additional DisputeTargetTag values if supported by @story-protocol/core-sdk */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bond Amount (IP)</label>
                <input
                  type="number"
                  name="bond"
                  value={disputeForm.bond}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  min="0.1"
                  step="0.01"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                disabled={!isConnected || !isInitialized}
              >
                Raise Dispute
              </button>
            </form>
          </div>

          {/* Reports List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Reports</h2>
            {userReports.length === 0 ? (
              <p className="text-gray-500">No reports filed yet.</p>
            ) : (
              <div className="space-y-4">
                {userReports.map((report) => (
                  <div key={report.id} className="border p-4 rounded-lg">
                    <h3 className="font-semibold">Report #{report.id}</h3>
                    <p className="text-sm text-gray-600">Violation: {report.violationType}</p>
                    <p className="text-sm">Status: {report.status}</p>
                    <p className="text-sm">Target IP: {report.targetIPAsset.slice(0, 6)}...{report.targetIPAsset.slice(-4)}</p>
                    <Link to={`/reports/${report.id}`} className="text-blue-500 hover:underline">View Details</Link>
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

export default Reports;


