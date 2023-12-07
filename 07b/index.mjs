import assert from "assert";
import { readFileSync } from "fs";

const lines = readFileSync("input1.txt", "utf-8").split("\n");

const result = lines
  .map(parseHand)
  .toSorted(comparator)
  .toReversed()
  .map((hand, handIndex) => ({
    ...hand,
    rank: handIndex + 1,
  }))
  .map((hand) => hand.bid * hand.rank)
  .reduce((prev, cur) => prev + cur, 0);
console.log(result);

/**
 * @param {string} line
 */
function parseHand(line) {
  const reLine = /(.+) (\d+)/g;
  const result = reLine.exec(line);
  const hand = {
    cards: result[1].split(""),
    bid: +result[2],
  };

  assert(hand.cards.length === 5);

  return hand;
}

function comparator(hand1, hand2) {
  const result = getHandType(hand1.cards) - getHandType(hand2.cards);
  if (result !== 0) {
    return result;
  }

  for (let i = 0; i < 5; i++) {
    const card1 = hand1.cards[i];
    const card2 = hand2.cards[i];
    const result = getCardValue(card2) - getCardValue(card1);
    if (result !== 0) {
      return result;
    }
  }
  return 0;
}

function getCardValue(card) {
  switch (card) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "T":
      return 10;
    default:
      return +card;
    case "J":
      return 1;
  }
}

function getHandType(cards) {
  const cardCounts = groupBy(cards);
  const jokers = cardCounts["J"] ?? 0;
  const cardCountValues = Object.values({
    ...cardCounts,
    J: 0,
  });

  // five of a kind
  if (
    cardCountValues.includes(5) ||
    (cardCountValues.includes(4) && jokers >= 1) ||
    (cardCountValues.includes(3) && jokers >= 2) ||
    (cardCountValues.includes(2) && jokers >= 3) ||
    (cardCountValues.includes(1) && jokers >= 4) ||
    jokers >= 5
  ) {
    return 1;
  }

  // four of a kind
  if (
    cardCountValues.includes(4) ||
    (cardCountValues.includes(3) && jokers >= 1) ||
    (cardCountValues.includes(2) && jokers >= 2) ||
    (cardCountValues.includes(1) && jokers >= 3) ||
    jokers >= 4
  ) {
    return 2;
  }

  // full house
  if (
    (cardCountValues.includes(3) && cardCountValues.includes(2)) ||
    (cardCountValues.includes(2) &&
      cardCountValues.includes(2) &&
      hasPair(cardCountValues, 2) &&
      jokers >= 1) ||
    (cardCountValues.includes(2) &&
      cardCountValues.includes(1) &&
      jokers >= 2) ||
    (cardCountValues.includes(2) && jokers >= 3) ||
    (cardCountValues.includes(1) &&
      cardCountValues.includes(1) &&
      hasPair(cardCountValues, 1) &&
      jokers >= 3) ||
    (cardCountValues.includes(1) && jokers >= 4)
  ) {
    return 3;
  }

  // three of a kind
  if (
    cardCountValues.includes(3) ||
    (cardCountValues.includes(2) && jokers >= 1) ||
    (cardCountValues.includes(1) && jokers >= 2) ||
    jokers >= 3
  ) {
    return 4;
  }

  // two pair
  if (
    (cardCountValues.includes(2) && hasPair(cardCountValues, 2)) ||
    (cardCountValues.includes(2) &&
      cardCountValues.includes(1) &&
      jokers >= 1) ||
    (cardCountValues.includes(2) && jokers >= 2) ||
    (cardCountValues.includes(1) &&
      hasPair(cardCountValues, 1) &&
      jokers >= 2) ||
    (cardCountValues.includes(1) && jokers >= 3)
  ) {
    return 5;
  }

  // one pair
  if (
    cardCountValues.includes(2) ||
    (cardCountValues.includes(1) && jokers >= 1)
  ) {
    return 6;
  }

  // highest card
  return 7;
}

function groupBy(arr) {
  const result = {};
  for (const item of arr) {
    if (result[item] === undefined) {
      result[item] = 0;
    }
    result[item]++;
  }
  return result;
}

function hasPair(arr, item) {
  return arr.filter((v) => v === item).length === 2;
}
