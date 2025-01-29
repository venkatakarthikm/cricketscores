import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Calendar, MapPin, Clock, X, Ticket as Cricket, ArrowRight, Sun, Moon } from 'lucide-react';
import './cricket.css';

const CricketApp = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const fetchMatches = async () => {
      const options = {
        method: 'GET',
        url: 'https://cricket-live-line1.p.rapidapi.com/home',
        headers: {
          'x-rapidapi-key': '86c15bbc87msh2428de2b60ecbc1p1f4531jsn548df7bf80c7',
          'x-rapidapi-host': 'cricket-live-line1.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setMatches(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch match data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchMatches();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getScoreSummary = (match) => {
    let summary = [];
    if (match.team_a_scores) {
      summary.push(`${match.team_a_short}: ${match.team_a_scores}`);
    }
    if (match.team_b_scores) {
      summary.push(`${match.team_b_short}: ${match.team_b_scores}`);
    }
    return summary.join(' | ');
  };

  const handleCardClick = (match) => {
    setSelectedMatch(match);
    document.body.style.overflow = 'hidden';
  };

  const closeDetails = () => {
    setSelectedMatch(null);
    document.body.style.overflow = 'auto';
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) return (
    <div className="loading-container">
      <Cricket className="animate-spin text-primary" size={48} />
      <p>Loading matches...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="cricket-app">
      <div className="app-header">
        <div className="header-content">
          <Trophy className="text-yellow-400 w-8 h-8" />
          <h1 className="title">Live Cricket Scores</h1>
        </div>
        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>
      
      <div className="match-grid">
        {matches.map((match) => (
          <div 
            key={match.match_id} 
            className={`match-card ${match.match_status.toLowerCase()}`} 
            onClick={() => handleCardClick(match)}
          >
            <div className="card-header">
              <span className="series-name">{match.series}</span>
              <span className={`status-badge ${match.match_status.toLowerCase()}`}>
                {match.match_status}
              </span>
            </div>
            
            <div className="teams-container">
              <div className="team">
                <img src={match.team_a_img} alt={match.team_a_short} className="team-logo"/>
                <span>{match.team_a_short}</span>
                {match.team_a_scores && (
                  <span className="team-score">{match.team_a_scores}({match.team_a_over})</span>
                )}
              </div>
              <span className="vs">VS</span>
              <div className="team">
                <img src={match.team_b_img} alt={match.team_b_short} className="team-logo"/>
                <span>{match.team_b_short}</span>
                {match.team_b_scores && (
                  <span className="team-score">{match.team_b_scores}({match.team_b_over})</span>
                )}
              </div>
            </div>

            <div className="match-info">
              <div className="info-row">
                <Calendar className="icon" />
                <span>{formatDate(match.date_time)}</span>
              </div>
              <div className="info-row">
                <MapPin className="icon" />
                <span>{match.venue}</span>
              </div>
            </div>

            {match.match_status === 'Live' && (
              <div className="live-scores">
                <div className="score-line">{match.need_run_ball || getScoreSummary(match)}</div>
              </div>
            )}

            {match.match_status === 'Finished' && match.result && (
              <div className="result-banner">
                <Trophy className="icon text-yellow-400" />
                <span>{match.result}</span>
              </div>
            )}

            <div className="card-footer">
              <span className="view-details">
                View Details <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedMatch && (
        <div className="match-details-overlay" onClick={closeDetails}>
          <div className="match-details-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeDetails}>
              <X className="w-6 h-6" />
            </button>
            
            <div className="details-scroll">
              <div className="details-header">
                <span className="series-title">{selectedMatch.series}</span>
                <h2>{selectedMatch.matchs}</h2>
                <span className={`status-badge ${selectedMatch.match_status.toLowerCase()}`}>
                  {selectedMatch.match_status}
                </span>
              </div>

              <div className="details-teams">
                <div className="team">
                  <img src={selectedMatch.team_a_img} alt={selectedMatch.team_a} className="team-logo-large"/>
                  <h3>{selectedMatch.team_a}</h3>
                  {selectedMatch.team_a_scores && (
                    <p className="score">{selectedMatch.team_a_scores}</p>
                  )}
                </div>
                <div className="vs-large">VS</div>
                <div className="team">
                  <img src={selectedMatch.team_b_img} alt={selectedMatch.team_b} className="team-logo-large"/>
                  <h3>{selectedMatch.team_b}</h3>
                  {selectedMatch.team_b_scores && (
                    <p className="score">{selectedMatch.team_b_scores}</p>
                  )}
                </div>
              </div>

              {selectedMatch.toss && (
                <div className="toss-info">
                  <Cricket className="icon" />
                  <span>{selectedMatch.toss}</span>
                </div>
              )}

              <div className="details-info">
                <div className="info-item">
                  <Calendar className="icon" />
                  <span>{formatDate(selectedMatch.date_time)}</span>
                </div>
                <div className="info-item">
                  <MapPin className="icon" />
                  <span>{selectedMatch.venue}</span>
                </div>
                <div className="info-item">
                  <Trophy className="icon" />
                  <span>{selectedMatch.match_type}</span>
                </div>
              </div>

              {selectedMatch.match_status === 'Live' && (
                <div className="live-details">
                  <h4>Live Details</h4>
                  {selectedMatch.need_run_ball && (
                    <p className="target">{selectedMatch.need_run_ball}</p>
                  )}
                  {selectedMatch.current_run_rate && (
                    <div className="run-rates">
                      <p>CRR: {selectedMatch.current_run_rate}</p>
                      {selectedMatch.required_run_rate && (
                        <p>RRR: {selectedMatch.required_run_rate}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {selectedMatch.match_status === 'Finished' && selectedMatch.result && (
                <div className="result-details">
                  <Trophy className="icon text-yellow-400" />
                  <h4>{selectedMatch.result}</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CricketApp;