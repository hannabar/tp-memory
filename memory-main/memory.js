(function () {
    /* ========= CONFIG ========= */
    const emojis = [
      "🍰", "🍩", '🍪', '🧁', '🍫', '🍦', '🍮', '🍬',
    ]; // 8 paires = 16 cartes pour un plateau 4×4

    /* ========= VARIABLES D'ÉTAT ========= */
    let deck = []; //tableau qui va contenir toutes les cartes du memory
    let firstCard = null;  // variable qui va mémoriser quelle 1e carte le joueur retourne 
    let secondCard = null; // variable qui va mémoriser quelle 2e carte le joueur retourne 
    let lockBoard = false; // verrou  qui empêche le joueur de cliquer sur d’autres cartes pendant qu’une comparaison est en cours.
    let moves = 0; //C’est le compteur de coups.
    let matchedPairs = 0; ///nombre de paires trouvées.
    let timerInterval = null; //stocke l’intervalle du chronomètre
    let secondsElapsed = 0; //compteur de secondes écoulées depuis le début de la partie.

    /* ========= DOM ========= */
    const board = document.getElementById("game-board");
    const movesSpan = document.getElementById("moves");
    const timerSpan = document.getElementById("timer");
    const restartBtn = document.getElementById("restart");

    /* ========= UTILS ========= */
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}:${s.toString().padStart(2, "0")}`;
    }

    /* ========= JEU ========= */
    function initGame() {
      // Réinitialise l'état
      deck = shuffle([...emojis, ...emojis]);
      firstCard = secondCard = null;
      lockBoard = false;
      moves = 0;
      matchedPairs = 0;
      secondsElapsed = 0;
      clearInterval(timerInterval);
      timerSpan.textContent = "0:00";
      movesSpan.textContent = "0";

      // Construit le board
      board.innerHTML = "";
      deck.forEach((emoji) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.emoji = emoji;

        card.innerHTML = `
          <div class="card-inner">
            <div class="face front">?</div>
            <div class="face back">${emoji}</div>
          </div>
        `;

        card.addEventListener("click", onCardClick);
        board.appendChild(card);
      });
    }

    function startTimer() {
      timerInterval = setInterval(() => {
        secondsElapsed++;
        timerSpan.textContent = formatTime(secondsElapsed);
      }, 1000);
    }

    function onCardClick(e) {
      const card = e.currentTarget;
      if (lockBoard || card.classList.contains("flipped")) return;

      card.classList.add("flipped");

      if (!firstCard) {
        firstCard = card;
        if (moves === 0 && secondsElapsed === 0) startTimer();
        return;
      }

      secondCard = card;
      moves++;
      movesSpan.textContent = moves;
      checkMatch();
    }

    function checkMatch() {
      const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
      if (isMatch) {
        disableMatched();
      } else {
        unflipCards();
      }
    }

    function disableMatched() {
      firstCard.removeEventListener("click", onCardClick);
      secondCard.removeEventListener("click", onCardClick);
      matchedPairs++;
      resetBoard();
      if (matchedPairs === emojis.length) endGame();
    }

    function unflipCards() {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
      }, 900);
    }

    function resetBoard() {
      [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function endGame() {
      clearInterval(timerInterval);
      setTimeout(() => {
        alert(`Bravo ! Vous avez terminé en ${moves} mouvements et ${formatTime(secondsElapsed)}.`);
      }, 300);
    }

    /* ========= ÉVÉNEMENTS ========= */
    restartBtn.addEventListener("click", initGame);

    // Lancement initial
    initGame();
  })();