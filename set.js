/*
 * This is the JS to implement the UI for my web page.
 * User can play card games through clicking card after they start.
 * The game will end once the user runs out of the time or clicks
 * the back to main button. Once the time is out, user cannot do
 * anything but back to main and restart the game.
 */
"use strict";
(function() {
  let timerId;
  let remainingSeconds;

  window.addEventListener('load', init);

  /**
   * sets up necessary functionality when page loads
   */
  function init() {
    id('start-btn').addEventListener('click', () => {
      toggleViews();
      startTimer();
      generateBoard();
    });
    id('back-btn').addEventListener('click', () => {
      clearInterval(timerId);
      toggleViews();
      id('set-count').textContent = "0";
      id('refresh-btn').disabled = false;
    });
    id('refresh-btn').addEventListener('click', refreshCards);
  }

  /**
   * Generate different board with different cards based on
   * user's choice on difficulty
   */
  function generateBoard() {
    let isEasy = easyOrStandard();
    if (qs('#board').hasChildNodes()) {
      let allCards = qs('#board').querySelectorAll('div');
      for (let i = 0; i < allCards.length; i++) {
        qs('#board').removeChild(allCards[i]);
      }
    }
    let radios = document.getElementsByName('diff');
    if (radios[0].checked) {
      for (let i = 0; i < 9; i++) {
        id('board').appendChild(generateUniqueCard(isEasy));
      }
    } else if (radios[1].checked) {
      for (let i = 0; i < 12; i++) {
        id('board').appendChild(generateUniqueCard(isEasy));
      }
    }
  }

  /**
   * Check user's choices of difficulty
   * @returns {*} isEasy - a boolean variable indicating easy or standard
   */
  function easyOrStandard() {
    let isEasy;
    let radios = document.getElementsByName('diff');
    if (radios[0].checked) {
      for (let i = 0; i < 9; i++) {
        isEasy = true;
      }
    } else if (radios[1].checked) {
      for (let i = 0; i < 12; i++) {
        isEasy = false;
      }
    }
    return isEasy;
  }

  /**
   * Hide or show chosen information
   */
  function toggleViews() {
    id('game-view').classList.toggle('hidden');
    id('menu-view').classList.toggle('hidden');
  }

  /**
   * Refrsh all cards on the board
   */
  function refreshCards() {
    let isEasy = easyOrStandard();
    let cards;
    if (isEasy) {
      cards = 9;
    } else {
      cards = 12;
    }
    let allCards = id('board').querySelectorAll('div');
    for (let i = 0; i < cards; i++) {
      id('board').removeChild(allCards[i]);
      id('board').appendChild(generateUniqueCard(isEasy));
    }
  }

  /**
   * Generate randomly selected four attributes
   * @param {*} isEasy - a boolean variable indicate easy or standard
   * @returns {Array} generatedAttribute - an array contain attributes
   */
  function generateRandomAttributes(isEasy) {
    let generatedAttribute = ['STYLE', 'SHAPE', 'COLOR', 'COUNT'];
    let style = ['solid', 'striped', 'outline'];
    let shape = ['diamond', 'oval', 'squiggle'];
    let color = ['green', 'purple', 'red'];
    let count = ['1', '2', '3'];
    if (isEasy) {
      generatedAttribute[0] = 'solid';
    } else {
      generatedAttribute[0] = style[Math.floor(Math.random() * 3)];
    }
    generatedAttribute[1] = shape[Math.floor(Math.random() * shape.length)];
    generatedAttribute[2] = color[Math.floor(Math.random() * shape.length)];
    generatedAttribute[3] = count[Math.floor(Math.random() * shape.length)];
    return generatedAttribute;
  }

  /**
   * Generate unique card
   * @param {*} isEasy - a boolean variable indicating easy or standard
   * @returns {DOMElement} div - a div element with COUNT number
   */
  function generateUniqueCard(isEasy) {
    let cardAttributes = generateRandomAttributes(isEasy);
    let cardID = cardAttributes.join('-');
    if (id(cardID)) {
      return generateUniqueCard(isEasy);
    }
    let div = document.createElement('div');
    div.classList.add('card');
    for (let i = 0; i < cardAttributes[3]; i++) {
      let img = document.createElement('img');
      img.src = 'img/' + cardAttributes[0] + '-' + cardAttributes[1] +
                '-' + cardAttributes[2] + '.png';
      img.alt = cardAttributes[0] + '-' + cardAttributes[1] +
                '-' + cardAttributes[2];
      div.id = cardAttributes[0] + '-' + cardAttributes[1] +
                '-' + cardAttributes[2] + '-' + cardAttributes[3];
      div.appendChild(img);
      div.addEventListener('click', cardSelected);
    }
    return div;
  }

  /**
   * Start a timer for the chosen time option
   */
  function startTimer() {
    let options = qs('select');
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        remainingSeconds = options[i].value;
        let minutes = secondsMinutes()[0];
        let seconds = secondsMinutes()[1];
        if (seconds < 10) {
          id('time').textContent = "0" + minutes + ":0" + seconds;
        } else {
          id('time').textContent = "0" + minutes + ":" + seconds;
        }
      }
    }
    if (timerId !== null) {
      timerId = setInterval(() => {
        advanceTimer();
      }, 1000);
    }
  }

  /**
   * Update a timer by decreasing a second a time
   */
  function advanceTimer() {
    let minutes;
    let seconds;
    if (remainingSeconds > 0) {
      remainingSeconds--;
      if (remainingSeconds === 0) {
        timeOut();
        clearInterval(timerId);
      }
      minutes = secondsMinutes()[0];
      seconds = secondsMinutes()[1];
      if (seconds < 10) {
        id('time').textContent = "0" + minutes + ":0" + seconds;
      } else {
        id('time').textContent = "0" + minutes + ":" + seconds;
      }
    }
  }

  /**
   * Action after time is over
   * User cannot do anything besides click the back button
   */
  function timeOut() {
    let selected = qsa('.selected');
    for (let i = 0; i < selected.length; i++) {
      selected[i].classList.remove('selected');
    }
    let cards = qsa('.card');
    for (let i = 0; i < cards.length; i++) {
      cards[i].removeEventListener('click', cardSelected);
      cards[i].classList.remove('slected');
    }
    id('refresh-btn').disabled = true;
  }

  /**
   * Converting seconds to minutes
   * @return {Array} minutes, seconds - minutes and seconds converted
   */
  function secondsMinutes() {
    let minutes = Math.floor(remainingSeconds / 60);
    let seconds = remainingSeconds - 60 * minutes;
    return [minutes, seconds];
  }

  /**
   * Click to select the card
   * If cards form a set or not a set, take different action
   * @param {*} event - an event
   */
  function cardSelected() {
    let isEasy = easyOrStandard();
    this.classList.toggle('selected');
    let selected = qsa('.selected');
    if (selected.length === 3) {
      if (!isASet(selected)) {
        afterNotSet(selected);
      } else {
        for (let i = 0; i < 3; i++) {
          let para = document.createElement('p');
          para.textContent = "SET!";
          let newCard = generateUniqueCard(isEasy);
          id('board').replaceChild(newCard, selected[i]);
          newCard.classList.add('hide-imgs');
          newCard.appendChild(para);
        }
        afterSet(selected);
      }
    }
  }

  /**
   * Behaviors after selecting set cards
   * @param {object[]} selected array of DOM objects matching the query
   */
  function afterSet(selected) {
    let countSet = parseInt(id('set-count').textContent);
    id('set-count').textContent = countSet + 1;
    let newSelected = qsa('.hide-imgs');
    setTimeout(function() {
      for (let i = 0; i < selected.length; i++) {
        newSelected[i].classList.remove('selected');
        newSelected[i].classList.remove('hide-imgs');
        newSelected[i].removeChild(newSelected[i].querySelector('p'));
      }
    }, 1000);
  }

  /**
   * Behaviors after selecting not-a-set cards
   * @param {object[]} selected array of DOM objects matching the query
   */
  function afterNotSet(selected) {
    for (let i = 0; i < 3; i++) {
      let para = document.createElement('p');
      para.textContent = "Not a Set";
      selected[i].classList.add('hide-imgs');
      selected[i].appendChild(para);
    }
    setTimeout(function() {
      for (let i = 0; i < selected.length; i++) {
        selected[i].classList.remove('hide-imgs');
        selected[i].classList.remove('selected');
        selected[i].removeChild(selected[i].querySelector('p'));
      }
    }, 1000);
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {DOMList} selected - list of all selected cards to check if a set.
   * @return {boolean} true if valid set false otherwise.
   */
  function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let diff = attributes[0][i] !== attributes[1][i] &&
                attributes[1][i] !== attributes[2][i] &&
                attributes[0][i] !== attributes[2][i];
      let same = attributes[0][i] === attributes[1][i] &&
                    attributes[1][i] === attributes[2][i];
      if (!(same || diff)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();
