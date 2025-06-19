
import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { useStory } from '../hooks/useStory';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { parseEther } from 'viem';

const Portfolio: React.FC = () => {
  const { ipAssets, user, setError, setLoading } = useAppStore();
  const { isConnected, isInitialized, isLoading, address, mintLicense, payRoyalty } = useStory();
  const [userIPAssets, setUserIPAssets] = useState(ipAssets.filter((asset) => asset.owner === address));
  const [licenseTermsId, setLicenseTermsId] = useState('');
  const [royaltyAmount, setRoyaltyAmount] = useState('');

  useEffect(() => {
    if (!isConnected || !address) {
      setError('Please connect your wallet to view your portfolio.');
    } else {
      setError(null);
      setUserIPAssets(ipAssets.filter((asset) => asset.owner === address));
    }
  }, [isConnected, address, ipAssets, setError]);

  const handleMintLicense = async (ipId: string, termsId: string) => {
    if (!isConnected || !isInitialized || !address) {
      setError('Wallet not connected or Story client not initialized.');
      return;
    }

    try {
      setLoading(true);
      await mintLicense({
        licenseTermsId: termsId,
        licensorIpId: ipId,
        amount: 1,
      });
      toast.success('License minted successfully!');
    } catch (error) {
      console.error('Error minting license:', error);
      setError('Failed to mint license.');
      toast.error('Failed to mint license.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayRoyalty = async (ipId: string, amount: string) => {
    if (!isConnected || !isInitialized) {
      setError('Wallet not connected or Story client not initialized.');
      return;
    }

    try {
      setLoading(true);
      await payRoyalty({
        receiverIpId: ipId,
        amount: parseEther(amount),
      });
      toast.success('Royalty paid successfully!');
      setRoyaltyAmount('');
    } catch (error) {
      console.error('Error paying royalty:', error);
      setError('Failed to pay royalty.');
      toast.error('Failed to pay royalty.');
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
      <h1 className="text-3xl font-bold mb-6">My Portfolio</h1>

      {!isConnected ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">Please connect your wallet to view your portfolio.</p>
        </div>
      ) : (
        <>
          {userIPAssets.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">No IP assets registered yet.</p>
              <Link to="/register-ip" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Register New IP
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userIPAssets.map((asset) => (
                <div key={asset.id} className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-2">{asset.title}</h2>
                  <p className="text-gray-600 mb-2">{asset.description}</p>
                  <p className="text-sm">Category: {asset.category}</p>
                  <p className="text-sm">Status: {asset.status}</p>
                  <p className="text-sm">Earnings: {asset.earnings.toString()} IP</p>
                  <div className="mt-4 space-y-2">
                    <Link to={`/ip/${asset.id}`} className="text-blue-500 hover:underline">View Details</Link>
                    <div>
                      <input
                        type="text"
                        placeholder="License Terms ID"
                        value={licenseTermsId}
                        onChange={(e) => setLicenseTermsId(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 mb-2"
                      />
                      <button
                        onClick={() => handleMintLicense(asset.id, licenseTermsId)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        disabled={!licenseTermsId}
                      >
                        Mint License
                      </button>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Royalty Amount (IP)"
                        value={royaltyAmount}
                        onChange={(e) => setRoyaltyAmount(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 mb-2"
                      />
                      <button
                        onClick={() => handlePayRoyalty(asset.id, royaltyAmount)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={!royaltyAmount}
                      >
                        Pay Royalty
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Portfolio;




