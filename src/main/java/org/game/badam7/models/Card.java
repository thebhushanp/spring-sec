package org.game.badam7.models;

/**
 * An object of type Card represents a playing card from a standard Poker deck,
 * including Jokers. The card has a suit, which can be spades, hearts, diamonds,
 * clubs, or joker. A spade, heart, diamond, or club has one of the 13 values:
 * ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, or king. Note that "ace" is
 * considered to be the smallest value. A joker can also have an associated
 * value; this value can be anything and can be used to keep track of several
 * different jokers.
 */
public class Card {

	public enum SUIT {
		HEARTS(0), SPADES(1), DIAMONDS(2), CLUBS(3);

		// declaring private variable for getting values
		private Integer value;

		// getter method
		public Integer getValue() {
			return this.value;
		}

		// enum constructor - cannot be public or protected
		private SUIT(Integer val) {
			this.value = val;
		}
	}

	public final static int ACE = 1; // Codes for the non-numeric cards.
	public final static int JACK = 11; // Cards 2 through 10 have their
	public final static int QUEEN = 12; // numerical values for their codes.
	public final static int KING = 13;

	/**
	 * This card's suit, one of the constants SPADES, HEARTS, DIAMONDS, CLUBS, or
	 * JOKER. The suit cannot be changed after the card is constructed.
	 */
	private final SUIT suit;

	/**
	 * The card's value. For a normal card, this is one of the values 1 through 13,
	 * with 1 representing ACE. For a JOKER, the value can be anything. The value
	 * cannot be changed after the card is constructed.
	 */
	private final Integer value;

	/**
	 * Creates a card with a specified suit and value.
	 *
	 * @param theValue the value of the new card. For a regular card (non-joker),
	 *                 the value must be in the range 1 through 13, with 1
	 *                 representing an Ace. You can use the constants Card.ACE,
	 *                 Card.JACK, Card.QUEEN, and Card.KING. For a Joker, the value
	 *                 can be anything.
	 * @param theSuit  the suit of the new card. This must be one of the values
	 *                 Card.SPADES, Card.HEARTS, Card.DIAMONDS, Card.CLUBS, or
	 *                 Card.JOKER.
	 * @throws IllegalArgumentException if the parameter values are not in the
	 *                                  permissible ranges
	 */
	public Card(int theValue, SUIT theSuit) {
		if (theValue < 1 || theValue > 13)
			throw new IllegalArgumentException("Illegal playing card value");
		value = theValue;
		suit = theSuit;
	}

	public Card(int intVal) {
		if (intVal < 1 || intVal > 52)
			throw new IllegalArgumentException("Illegal playing card value");
		if (intVal == 13 || intVal == 26 || intVal == 39 || intVal == 52)
			this.value = intVal;
		else {
			this.value = intVal % 13;
		}
		if (intVal > 0 && intVal <= 13) {
			this.suit = SUIT.HEARTS;
		} else if (intVal >= 14 && intVal <= 26) {
			this.suit = SUIT.SPADES;
		} else if (intVal >= 27 && intVal <= 39) {
			this.suit = SUIT.DIAMONDS;
		} else {
			this.suit = SUIT.CLUBS;
		}
	}

	/**
	 * Returns the suit of this card.
	 *
	 * @returns the suit, which is one of the constants Card.SPADES, Card.HEARTS,
	 *          Card.DIAMONDS, Card.CLUBS, or Card.JOKER
	 */
	public SUIT getSuit() {
		return suit;
	}

	public Integer getIntValue() {
		return (this.suit.value * 13) + this.value;
	}

	/**
	 * Returns a String representation of the card's suit.
	 *
	 * @return one of the strings "Spades", "Hearts", "Diamonds", "Clubs" or
	 *         "Joker".
	 */
	public String getSuitAsString() {
		switch (suit) {
		case SPADES:
			return "Spades";
		case HEARTS:
			return "Hearts";
		case DIAMONDS:
			return "Diamonds";
		case CLUBS:
			return "Clubs";
		default:
			return "Joker";
		}
	}

	/**
	 * Returns a String representation of the card's value.
	 *
	 * @return for a regular card, one of the strings "Ace", "2", "3", ..., "10",
	 *         "Jack", "Queen", or "King". For a Joker, the string is always
	 *         numerical.
	 */
	public String getValueAsString() {
		switch (value) {
		case 1:
			return "Ace";
		case 2:
			return "2";
		case 3:
			return "3";
		case 4:
			return "4";
		case 5:
			return "5";
		case 6:
			return "6";
		case 7:
			return "7";
		case 8:
			return "8";
		case 9:
			return "9";
		case 10:
			return "10";
		case 11:
			return "Jack";
		case 12:
			return "Queen";
		default:
			return "King";
		}
	}

	/**
	 * Returns a string representation of this card, including both its suit and its
	 * value (except that for a Joker with value 1, the return value is just
	 * "Joker"). Sample return values are: "Queen of Hearts", "10 of Diamonds", "Ace
	 * of Spades", "Joker", "Joker #2"
	 */
	@Override
	public String toString() {
		return getValueAsString() + " of " + getSuitAsString();
	}

} // end class Card
