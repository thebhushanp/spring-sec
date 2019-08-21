package org.game.badam7.models;

public enum EventType {
	GAME_START(0),
	PLAYED_CARD(1),
    GAME_END(2),
    ERROR(3),
    PLAYER_JOIN(4),
    PLAYER_LEFT(5);

    private int value;

    private EventType(int value) {
        this.value = value;
    }

    public int getValue() {
		return value;
	}

}