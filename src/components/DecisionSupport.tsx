import { useState } from 'react';

// Define types for our component
interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

interface SupplierScore {
  supplierId: number;
  supplierName: string;
  scores: Record<string, number>; // criterionId -> score (0-10)
}

interface TeamMemberVote {
  userId: string;
  userName: string;
  preferredSupplierId: number;
  comment?: string;
}

interface DecisionSupportProps {
  criteria: Criterion[];
  supplierScores: SupplierScore[];
  teamVotes: TeamMemberVote[];
  onUpdateCriterionWeight: (criterionId: string, weight: number) => void;
  onUpdateSupplierScore: (supplierId: number, criterionId: string, score: number) => void;
  onAddVote: (preferredSupplierId: number, comment?: string) => void;
}

export default function DecisionSupport({ 
  criteria, 
  supplierScores, 
  teamVotes,
  onUpdateCriterionWeight,
  onUpdateSupplierScore,
  onAddVote
}: DecisionSupportProps) {
  const [activeTab, setActiveTab] = useState<'scoring' | 'comparison' | 'voting'>('scoring');
  const [editingWeights, setEditingWeights] = useState(false);
  const [newVoteComment, setNewVoteComment] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  
  // Calculate total scores for each supplier
  const calculateTotalScore = (supplierId: number) => {
    const supplier = supplierScores.find(s => s.supplierId === supplierId);
    if (!supplier) return 0;
    
    let totalScore = 0;
    let totalWeight = 0;
    
    criteria.forEach(criterion => {
      const score = supplier.scores[criterion.id] || 0;
      totalScore += score * criterion.weight;
      totalWeight += criterion.weight;
    });
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  };
  
  // Sort suppliers by total score
  const sortedSuppliers = [...supplierScores].sort((a, b) => {
    const scoreA = calculateTotalScore(a.supplierId);
    const scoreB = calculateTotalScore(b.supplierId);
    return scoreB - scoreA;
  });
  
  const handleWeightChange = (criterionId: string, weight: number) => {
    onUpdateCriterionWeight(criterionId, Math.max(0, Math.min(10, weight)));
  };
  
  const handleScoreChange = (supplierId: number, criterionId: string, score: number) => {
    onUpdateSupplierScore(supplierId, criterionId, Math.max(0, Math.min(10, score)));
  };
  
  const handleSubmitVote = () => {
    if (selectedSupplierId) {
      onAddVote(selectedSupplierId, newVoteComment);
      setNewVoteComment('');
      setSelectedSupplierId(null);
    }
  };
  
  // Count votes for each supplier
  const voteCount = teamVotes.reduce((acc, vote) => {
    acc[vote.preferredSupplierId] = (acc[vote.preferredSupplierId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  // Get the supplier with the most votes
  const topVotedSupplierId = Object.entries(voteCount).reduce(
    (top, [supplierId, count]) => 
      count > (top.count || 0) ? { id: parseInt(supplierId), count } : top,
    { id: 0, count: 0 }
  ).id;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <h3 className="text-lg font-medium">Decision Support Tools</h3>
        <div className="text-sm text-gray-500">
          {sortedSuppliers.length} suppliers being evaluated
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'scoring' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('scoring')}
          >
            Weighted Scoring
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'comparison' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('comparison')}
          >
            Comparison Matrix
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'voting' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('voting')}
          >
            Team Voting
          </button>
        </div>
      </div>
      
      {activeTab === 'scoring' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium">Weighted Criteria Scoring</h4>
            <button
              onClick={() => setEditingWeights(!editingWeights)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {editingWeights ? 'Done Editing Weights' : 'Edit Weights'}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criteria
                  </th>
                  {editingWeights && (
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight (0-10)
                    </th>
                  )}
                  {!editingWeights && supplierScores.map(supplier => (
                    <th key={supplier.supplierId} className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {supplier.supplierName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {criteria.map(criterion => (
                  <tr key={criterion.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{criterion.name}</div>
                          <div className="text-sm text-gray-500">{criterion.description}</div>
                        </div>
                        {!editingWeights && (
                          <div className="ml-2 text-xs text-gray-500">
                            (Weight: {criterion.weight})
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {editingWeights ? (
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={criterion.weight}
                          onChange={(e) => handleWeightChange(criterion.id, parseInt(e.target.value) || 0)}
                          className="w-20 border rounded-md p-1 text-sm"
                        />
                      </td>
                    ) : (
                      supplierScores.map(supplier => (
                        <td key={supplier.supplierId} className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={supplier.scores[criterion.id] || 0}
                            onChange={(e) => handleScoreChange(supplier.supplierId, criterion.id, parseInt(e.target.value) || 0)}
                            className="w-20 border rounded-md p-1 text-sm"
                          />
                        </td>
                      ))
                    )}
                  </tr>
                ))}
                
                {!editingWeights && (
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      Weighted Total Score
                    </td>
                    {supplierScores.map(supplier => (
                      <td key={supplier.supplierId} className="px-4 py-3 whitespace-nowrap font-medium">
                        {calculateTotalScore(supplier.supplierId).toFixed(2)} / 10
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {!editingWeights && (
            <div className="mt-6">
              <h4 className="text-md font-medium mb-3">Score Summary</h4>
              <div className="space-y-3">
                {sortedSuppliers.map(supplier => {
                  const score = calculateTotalScore(supplier.supplierId);
                  return (
                    <div key={supplier.supplierId} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{supplier.supplierName}</span>
                        <span className="font-medium">{score.toFixed(2)} / 10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'comparison' && (
        <div>
          <h4 className="text-md font-medium mb-4">Supplier Comparison Matrix</h4>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  {criteria.map(criterion => (
                    <th key={criterion.id} className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {criterion.name}
                    </th>
                  ))}
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedSuppliers.map(supplier => (
                  <tr key={supplier.supplierId}>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {supplier.supplierName}
                    </td>
                    {criteria.map(criterion => {
                      const score = supplier.scores[criterion.id] || 0;
                      // Find the highest score for this criterion
                      const highestScore = Math.max(
                        ...supplierScores.map(s => s.scores[criterion.id] || 0)
                      );
                      
                      return (
                        <td 
                          key={criterion.id} 
                          className={`px-4 py-3 whitespace-nowrap ${score === highestScore && score > 0 ? 'bg-green-50' : ''}`}
                        >
                          <div className="flex items-center">
                            <div className="w-8 text-center">{score}</div>
                            <div className="ml-2 w-24 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${score === highestScore && score > 0 ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${(score / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {calculateTotalScore(supplier.supplierId).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium mb-2">Strengths & Weaknesses</h5>
              {sortedSuppliers.slice(0, 2).map(supplier => {
                // Find top 2 and bottom 2 criteria for this supplier
                const scoredCriteria = criteria.map(criterion => ({
                  criterion,
                  score: supplier.scores[criterion.id] || 0
                })).sort((a, b) => b.score - a.score);
                
                const strengths = scoredCriteria.slice(0, 2);
                const weaknesses = scoredCriteria.slice(-2).reverse();
                
                return (
                  <div key={supplier.supplierId} className="mb-4 p-3 border rounded-md">
                    <h6 className="font-medium mb-2">{supplier.supplierName}</h6>
                    
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-500 block mb-1">Top Strengths:</span>
                      <ul className="text-sm list-disc list-inside">
                        {strengths.map(({ criterion, score }) => (
                          <li key={criterion.id}>
                            {criterion.name}: <span className="font-medium">{score}/10</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <span className="text-xs font-medium text-gray-500 block mb-1">Areas for Improvement:</span>
                      <ul className="text-sm list-disc list-inside">
                        {weaknesses.map(({ criterion, score }) => (
                          <li key={criterion.id}>
                            {criterion.name}: <span className="font-medium">{score}/10</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-2">Head-to-Head Comparison</h5>
              {sortedSuppliers.length >= 2 && (
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between mb-3">
                    <span className="font-medium">{sortedSuppliers[0].supplierName}</span>
                    <span className="font-medium">{sortedSuppliers[1].supplierName}</span>
                  </div>
                  
                  {criteria.map(criterion => {
                    const score1 = sortedSuppliers[0].scores[criterion.id] || 0;
                    const score2 = sortedSuppliers[1].scores[criterion.id] || 0;
                    const diff = score1 - score2;
                    
                    return (
                      <div key={criterion.id} className="mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{criterion.name}</span>
                          <span>{Math.abs(diff).toFixed(1)} point {diff > 0 ? 'advantage' : 'disadvantage'}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-8 text-right text-sm">{score1}</div>
                          <div className="flex-grow mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${diff > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ 
                                width: `${Math.abs(diff) * 10}%`, 
                                marginLeft: diff > 0 ? '50%' : `${50 - Math.abs(diff) * 10}%`
                              }}
                            ></div>
                          </div>
                          <div className="w-8 text-left text-sm">{score2}</div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total Score</span>
                      <span>
                        {calculateTotalScore(sortedSuppliers[0].supplierId).toFixed(2)} vs {calculateTotalScore(sortedSuppliers[1].supplierId).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'voting' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium mb-4">Team Voting</h4>
              
              <div className="mb-4 p-4 border rounded-md">
                <h5 className="text-sm font-medium mb-3">Cast Your Vote</h5>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Preferred Supplier
                  </label>
                  <select
                    value={selectedSupplierId || ''}
                    onChange={(e) => setSelectedSupplierId(parseInt(e.target.value) || null)}
                    className="w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select a supplier --</option>
                    {sortedSuppliers.map(supplier => (
                      <option key={supplier.supplierId} value={supplier.supplierId}>
                        {supplier.supplierName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={newVoteComment}
                    onChange={(e) => setNewVoteComment(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Explain your preference..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitVote}
                    disabled={!selectedSupplierId}
                    className={`px-4 py-2 rounded-md text-sm ${
                      selectedSupplierId
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Vote
                  </button>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-3">Team Comments</h5>
                
                {teamVotes.filter(vote => vote.comment).length === 0 ? (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {teamVotes.filter(vote => vote.comment).map((vote, index) => {
                      const supplier = supplierScores.find(s => s.supplierId === vote.preferredSupplierId);
                      
                      return (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{vote.userName}</span>
                            <span className="text-xs text-blue-600">
                              Voted for: {supplier ? supplier.supplierName : 'Unknown'}
                            </span>
                          </div>
                          <p className="text-sm">{vote.comment}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-4">Voting Results</h4>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Total Votes: {teamVotes.length}</span>
                  {topVotedSupplierId > 0 && (
                    <span className="text-sm text-blue-600">
                      Leading: {supplierScores.find(s => s.supplierId === topVotedSupplierId)?.supplierName}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  {sortedSuppliers.map(supplier => {
                    const votes = voteCount[supplier.supplierId] || 0;
                    const percentage = teamVotes.length > 0 ? (votes / teamVotes.length) * 100 : 0;
                    
                    return (
                      <div key={supplier.supplierId} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{supplier.supplierName}</span>
                          <span>
                            {votes} vote{votes !== 1 ? 's' : ''} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              supplier.supplierId === topVotedSupplierId ? 'bg-blue-600' : 'bg-gray-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-3">Decision Summary</h5>
                
                <div className="p-4 border rounded-md">
                  <div className="mb-4">
                    <span className="block text-sm font-medium mb-1">Quantitative Analysis</span>
                    <p className="text-sm">
                      Based on weighted scoring, <strong>{sortedSuppliers[0]?.supplierName}</strong> has the highest score of <strong>{calculateTotalScore(sortedSuppliers[0]?.supplierId).toFixed(2)}/10</strong>.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <span className="block text-sm font-medium mb-1">Team Preference</span>
                    {topVotedSupplierId > 0 ? (
                      <p className="text-sm">
                        <strong>{supplierScores.find(s => s.supplierId === topVotedSupplierId)?.supplierName}</strong> is preferred by the team with <strong>{voteCount[topVotedSupplierId]}</strong> out of <strong>{teamVotes.length}</strong> votes.
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">No votes have been cast yet.</p>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium mb-1">Recommendation</span>
                    {sortedSuppliers.length > 0 && (
                      <p className="text-sm">
                        Based on both quantitative analysis and team input, <strong>{
                          topVotedSupplierId > 0 && sortedSuppliers[0]?.supplierId === topVotedSupplierId
                            ? sortedSuppliers[0]?.supplierName
                            : 'further discussion may be needed as quantitative scores and team preferences differ'
                        }</strong>.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 