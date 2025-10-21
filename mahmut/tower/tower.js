 // DOM Elementleri
        const dealerScoreEl = document.getElementById('dealer-score');
        const dealerHandEl = document.getElementById('dealer-hand');
        const playerScoreEl = document.getElementById('player-score');
        const playerHandEl = document.getElementById('player-hand');
        const messageEl = document.getElementById('message');
        const playerBalanceEl = document.getElementById('player-balance');
        const betAmountDisplayEl = document.getElementById('bet-amount-display');

        const dealButton = document.getElementById('deal-button');
        const hitButton = document.getElementById('hit-button');
        const standButton = document.getElementById('stand-button');
        const betIncreaseButton = document.getElementById('bet-increase');
        const betDecreaseButton = document.getElementById('bet-decrease');
        
        // Oyun Değişkenleri
        let deck = [];
        let dealerHand = [];
        let playerHand = [];
        let playerBalance = 500;
        let currentBet = 10;
        const BET_INCREMENT = 10;
        
        // Ses Efektleri
        const cardSound = new Tone.Player("https://assets.codepen.io/210284/card-place.mp3").toDestination();
        const winSound = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.5 } }).toDestination();
        const loseSound = new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.5 } }).toDestination();
        
        const suits = ['♥', '♦', '♣', '♠'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        function createDeck() {
            deck = [];
            for (const suit of suits) {
                for (const rank of ranks) {
                    deck.push({ suit, rank, value: getCardValue(rank) });
                }
            }
        }

        function shuffleDeck() {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
        }

        function getCardValue(rank) {
            if (['J', 'Q', 'K'].includes(rank)) return 10;
            if (rank === 'A') return 11;
            return parseInt(rank);
        }

        function calculateScore(hand) {
            let score = hand.reduce((sum, card) => sum + card.value, 0);
            let aceCount = hand.filter(card => card.rank === 'A').length;
            while (score > 21 && aceCount > 0) {
                score -= 10;
                aceCount--;
            }
            return score;
        }

        function renderCard(card, isHidden = false) {
            const cardColor = (card.suit === '♥' || card.suit === '♦') ? 'card-red' : 'card-black';
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            
            if(isHidden) cardDiv.classList.add('flipped');

            cardDiv.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-back"></div>
                    <div class="card-face card-front bg-white rounded-lg shadow-md flex flex-col justify-between p-2 ${cardColor}">
                        <div class="text-left text-xl font-bold">${card.rank}${card.suit}</div>
                        <div class="text-center text-4xl">${card.suit}</div>
                        <div class="text-right text-xl font-bold self-end transform rotate-180">${card.rank}${card.suit}</div>
                    </div>
                </div>
            `;
            return cardDiv;
        }
        
        function updateUI() {
            playerScoreEl.textContent = calculateScore(playerHand);
            dealerScoreEl.textContent = calculateScore(dealerHand.filter(c => !c.hidden));
            playerBalanceEl.textContent = `$${playerBalance}`;
            betAmountDisplayEl.textContent = `$${currentBet}`;

            playerHandEl.innerHTML = '';
            playerHand.forEach(card => playerHandEl.appendChild(renderCard(card)));

            dealerHandEl.innerHTML = '';
            dealerHand.forEach(card => dealerHandEl.appendChild(renderCard(card, card.hidden)));
        }

        function displayMessage(msg, type = 'info') {
            messageEl.textContent = msg;
            messageEl.classList.remove('text-green-400', 'text-red-400', 'text-yellow-400');
            if (type === 'win') messageEl.classList.add('text-green-400');
            else if (type === 'lose') messageEl.classList.add('text-red-400');
            else if (type === 'push') messageEl.classList.add('text-yellow-400');
        }

        function dealCards() {
            if (playerBalance < currentBet) {
                displayMessage("Yetersiz Bakiye!", 'lose');
                return;
            }
            
            Tone.start();
            playerBalance -= currentBet;

            createDeck();
            shuffleDeck();
            playerHand = [deck.pop(), deck.pop()];
            dealerHand = [deck.pop(), { ...deck.pop(), hidden: true }];
            
            dealButton.disabled = true;
            hitButton.disabled = false;
            standButton.disabled = false;
            betIncreaseButton.disabled = true;
            betDecreaseButton.disabled = true;
            displayMessage('');

            updateUI();
            cardSound.start();
            
            const playerScore = calculateScore(playerHand);
            if(playerScore === 21) {
                setTimeout(stand, 500);
            }
        }

        function hit() {
            playerHand.push(deck.pop());
            updateUI();
            cardSound.start();
            
            if (calculateScore(playerHand) > 21) {
                displayMessage('Kaybettin!', 'lose');
                loseSound.triggerAttackRelease("G2", "8n");
                endGame(false);
            }
        }
        
        async function stand() {
            hitButton.disabled = true;
            standButton.disabled = true;
            
            // Kurpiyerin gizli kartını aç
            const hiddenCard = dealerHand.find(c => c.hidden);
            if(hiddenCard) {
                hiddenCard.hidden = false;
                updateUI();
                await new Promise(res => setTimeout(res, 500));
            }

            // Kurpiyer oynar
            while (calculateScore(dealerHand) < 17) {
                dealerHand.push(deck.pop());
                cardSound.start();
                updateUI();
                await new Promise(res => setTimeout(res, 800));
            }

            const playerScore = calculateScore(playerHand);
            const dealerScore = calculateScore(dealerHand);
            dealerScoreEl.textContent = dealerScore;
            
            if (dealerScore > 21 || playerScore > dealerScore) {
                displayMessage('Kazandın!', 'win');
                winSound.triggerAttackRelease("C5", "8n");
                endGame(true, playerScore === 21 && playerHand.length === 2);
            } else if (playerScore < dealerScore) {
                displayMessage('Kaybettin!', 'lose');
                loseSound.triggerAttackRelease("G2", "8n");
                endGame(false);
            } else {
                displayMessage('Berabere!', 'push');
                endGame(null); // Push
            }
        }

        function endGame(playerWins, isBlackjack = false) {
            if (playerWins) {
                playerBalance += isBlackjack ? currentBet * 2.5 : currentBet * 2;
            } else if (playerWins === null) { // Push
                playerBalance += currentBet;
            }

            if (playerBalance < BET_INCREMENT) {
                displayMessage('Oyun Bitti! Bakiye Yetersiz.', 'lose');
                dealButton.disabled = true;
            } else {
                dealButton.disabled = false;
            }
            
            hitButton.disabled = true;
            standButton.disabled = true;
            betIncreaseButton.disabled = false;
            betDecreaseButton.disabled = false;

            updateUI();
        }

        function adjustBet(amount) {
            let newBet = currentBet + amount;
            if (newBet <= playerBalance && newBet >= BET_INCREMENT) {
                currentBet = newBet;
                updateUI();
            }
        }

        dealButton.addEventListener('click', dealCards);
        hitButton.addEventListener('click', hit);
        standButton.addEventListener('click', stand);
        betIncreaseButton.addEventListener('click', () => adjustBet(BET_INCREMENT));
        betDecreaseButton.addEventListener('click', () => adjustBet(-BET_INCREMENT));

        // İlk başlangıç
        endGame(false);