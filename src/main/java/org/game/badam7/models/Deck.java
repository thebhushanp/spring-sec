package org.game.badam7.models;

import java.util.ArrayList;
import java.util.List;

import org.game.badam7.exceptions.DeckEmpty;
import org.game.badam7.models.Card.SUIT;

/**
 * This is not Entity class, not meant to be persist.
 *
 * @author bhushan
 */
public class Deck {

	private List<Card> cards;

	public Deck() {
		cards = new ArrayList<>();
		for (int i = 1; i <= 13; i++) {
			cards.add(new Card(i, SUIT.HEARTS));
		}
		for (int i = 1; i <= 13; i++) {
			cards.add(new Card(i, SUIT.DIAMONDS));
		}
		for (int i = 1; i <= 13; i++) {
			cards.add(new Card(i, SUIT.CLUBS));
		}
		for (int i = 1; i <= 13; i++) {
			cards.add(new Card(i, SUIT.SPADES));
		}
	}

	public void suffle() {
		//FIXME temp arrangement
		//Collections.shuffle(cards, new Random(3));
	}

	public Card getTopCard() throws DeckEmpty {
		if (cards.isEmpty()) {
			throw new DeckEmpty();
		}
		Card topCard = cards.get(0);
		cards.remove(0);
		return topCard;
	}

	public boolean isEmpty() {
		return cards.isEmpty();
	}
}
