'use client'
import { useState, useEffect } from 'react'

interface Report {
  id: number;
  uuid: string;
  email: string;
  title: string;
  content: string;
  created_at: string;
}

interface PlayerData {
  id: number;
  coordinator_email: string;
  players_email: {
    [email: string]: "No reports submitted" | Report[];
  };
}

const UserUpdates = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCoordinator, setSelectedCoordinator] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [playerData, setPlayerData] = useState<PlayerData[]>([])

  useEffect(() => {
    setLoading(true)
    setError('')
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coordinators/players-details/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setPlayerData(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const coordinators = playerData.map(data => data.coordinator_email)
  
  const players = selectedCoordinator 
    ? Object.keys(playerData.find(data => data.coordinator_email === selectedCoordinator)?.players_email || {})
    : playerData.flatMap(data => Object.keys(data.players_email))

  const getFilteredUpdates = () => {
    const filteredData = playerData.filter(data => {
      const matchesCoordinator = !selectedCoordinator || data.coordinator_email === selectedCoordinator
      const matchesPlayer = !selectedPlayer || Object.keys(data.players_email).includes(selectedPlayer)
      return matchesCoordinator && matchesPlayer
    })

    const updates: (Report & { coordinatorEmail: string })[] = []
    
    filteredData.forEach(data => {
      Object.entries(data.players_email).forEach(([email, reports]) => {
        if (selectedPlayer && email !== selectedPlayer) return
        
        if (Array.isArray(reports)) {
          reports.forEach(report => {
            updates.push({
              ...report,
              coordinatorEmail: data.coordinator_email
            })
          })
        }
      })
    })

    return updates.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  const getPlayerStats = () => {
    const filteredData = playerData.filter(data => {
      return !selectedCoordinator || data.coordinator_email === selectedCoordinator
    })

    let totalPlayers = 0
    let playersWithReports = 0
    let playersWithoutReports = 0

    filteredData.forEach(data => {
      Object.entries(data.players_email).forEach(([email, reports]) => {
        if (selectedPlayer && email !== selectedPlayer) return
        
        totalPlayers++
        if (Array.isArray(reports) && reports.length > 0) {
          playersWithReports++
        } else {
          playersWithoutReports++
        }
      })
    })

    return { totalPlayers, playersWithReports, playersWithoutReports }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    setSelectedPlayer('')
  }, [selectedCoordinator])

  const stats = getPlayerStats()

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">User Updates - Coordinator View</h1>
      </div>
      
      <p className="text-gray-600 mb-6">
        Monitor daily and weekly updates from users in your coordination.
      </p>

      {!loading && (
        <div className="flex flex-col">
          <div className="flex gap-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Select Coordinator</label>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCoordinator}
                  onChange={(e) => setSelectedCoordinator(e.target.value)}
                >
                  <option value="">All Coordinators</option>
              {coordinators.map((coordinator, index) => (
                <option key={index} value={coordinator}>
                  {coordinator}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Select Participant</label>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
            >
              <option value="">All Participants</option>
              {players.map((player, index) => (
                <option key={index} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Total Participants</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalPlayers}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">With Updates</h3>
            <p className="text-2xl font-bold text-green-600">{stats.playersWithReports}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800">No Updates</h3>
            <p className="text-2xl font-bold text-red-600">{stats.playersWithoutReports}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Updates</h2>
          {getFilteredUpdates().length > 0 ? (
            <div className="space-y-4">
              {getFilteredUpdates().map((update, index) => (
                <div key={`${update.email}-${update.id}-${index}`} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{update.title}</p>
                      <p className="text-sm text-gray-600">From: {update.email}</p>
                      <p className="text-sm text-gray-500">Coordinator: {update.coordinatorEmail}</p>
                      <p className="text-xs text-gray-400">{formatDate(update.created_at)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{update.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No updates found for the selected filters.
            </p>
          )}
        </div>
      </div>
      )}

      {/* Loading and Error States */}

      {loading && (
        <p className="text-gray-500 m-4">Loading coordinator data...</p>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
    </>
  )
}

export default UserUpdates