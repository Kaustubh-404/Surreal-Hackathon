// src/components/Debug.tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Debug() {
  const { address, isConnected, status } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Wallet Debug Info</h3>
      <div className="space-y-1">
        <div>Status: {status}</div>
        <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
        <div>Address: {address || 'None'}</div>
        <div>Pending: {isPending ? 'Yes' : 'No'}</div>
        <div>Connectors: {connectors.length}</div>
        {connectors.map((connector, i) => (
          <div key={connector.id} className="ml-2">
            {i + 1}. {connector.name} ({connector.id})
          </div>
        ))}
        {error && <div className="text-red-400">Error: {error.message}</div>}
        
        <div className="mt-2 space-x-2">
          {!isConnected && connectors.length > 0 && (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="bg-blue-500 px-2 py-1 rounded text-xs"
            >
              Connect {connectors[0]?.name}
            </button>
          )}
          {isConnected && (
            <button
              onClick={() => disconnect()}
              className="bg-red-500 px-2 py-1 rounded text-xs"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  )
}