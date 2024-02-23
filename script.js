// Retrieve the voting data from localStorage or initialize an empty array
let votes = JSON.parse(localStorage.getItem('votes')) || [];
const votingDuration = 600000; // 10 minutes
const startTime = Date.now();

// Check if the voting period has ended on page load
checkVotingStatus();

// Update the timer every second
setInterval(updateTimer, 1000);

// Check voting status and update UI
function checkVotingStatus() {
  const elapsedTime = Date.now() - startTime;
  if (elapsedTime >= votingDuration) {
    document.getElementById('votingForm').style.display = 'none';
    document.getElementById('votingTimer').textContent = 'Voting has ended.';
  }
}

// Update the timer display
function updateTimer() {
  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, votingDuration - elapsedTime);
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);
  document.getElementById('timer').textContent = `${minutes}m ${seconds}s`;
}

// Event listener for voting form submission
document.getElementById('votingForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const candidate = document.getElementById('candidate').value;
  const voterId = document.getElementById('voterId').value;

  if (candidate === '' || voterId === '') {
    alert('Please select a candidate and enter your voter ID.');
    return;
  }

  const hasVoted = votes.some(vote => vote.voterId === voterId);
  if (hasVoted) {
    alert('You have already voted.');
    return;
  }

  const vote = {
    candidate: candidate,
    voterId: voterId,
    timestamp: new Date().toISOString()
  };

  votes.push(vote);

  // Save the updated voting data to localStorage
  localStorage.setItem('votes', JSON.stringify(votes));

  document.getElementById('candidate').selectedIndex = 0;
  document.getElementById('voterId').value = '';

  updateVotingResults();
  updateVoterTurnout();

  const verificationCode = generateVerificationCode();
  alert(`Thank you for voting! Your vote has been recorded.\nVerification Code: ${verificationCode}`);
});

// Function to generate a verification code
function generateVerificationCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let verificationCode = '';
  for (let i = 0; i < 6; i++) {
    verificationCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return verificationCode;
}

// Function to update voting results
function updateVotingResults() {
  const resultsList = document.getElementById('resultsList');
  resultsList.innerHTML = '';

  const voteCounts = {};
  votes.forEach(vote => {
    if (voteCounts[vote.candidate]) {
      voteCounts[vote.candidate]++;
    } else {
      voteCounts[vote.candidate] = 1;
    }
  });

  for (const candidate in voteCounts) {
    const listItem = document.createElement('li');
    listItem.textContent = `${candidate}: ${voteCounts[candidate]} vote(s)`;
    resultsList.appendChild(listItem);
  }
}

// Function to update voter turnout
function updateVoterTurnout() {
  const voterTurnout = document.getElementById('voterTurnout');
  const totalVoters = votes.length;
  voterTurnout.textContent = `Total Voters: ${totalVoters}`;
}
