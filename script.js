let votes = JSON.parse(localStorage.getItem('votes')) || [];

document.addEventListener('DOMContentLoaded', function() {
  updateVotingResults();
  updateVoterTurnout();
});

document.querySelectorAll('.votingForm').forEach(form => {
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const candidate = form.querySelector('select').value;
    const voterId = form.querySelector('input[type="text"]').value;

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

    localStorage.setItem('votes', JSON.stringify(votes));

    form.querySelector('select').selectedIndex = 0;
    form.querySelector('input[type="text"]').value = '';

    updateVotingResults();
    updateVoterTurnout();

    const verificationCode = generateVerificationCode();
    alert(`Thank you for voting! Your vote has been recorded.\nVerification Code: ${verificationCode}`);
  });
});

function generateVerificationCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let verificationCode = '';
  for (let i = 0; i < 6; i++) {
   
