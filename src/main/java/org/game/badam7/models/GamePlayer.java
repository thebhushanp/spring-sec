package org.game.badam7.models;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "game_player")
public class GamePlayer {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(cascade = CascadeType.ALL)
	private User user;

	@ManyToOne()
	private Game game;

	private Integer position;

	@ElementCollection
	@CollectionTable(name = "player_game_cards", joinColumns = @JoinColumn(name = "player_game_id"))
	@Column(name = "card_val")
	private Set<Integer> cards;

	@Column(name = "am_i_next")
	private Boolean amINext;

	@Column(name = "ws_endpoint")
	private String wsEndpointURL;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public Integer getPosition() {
		return position;
	}

	public void setPosition(Integer position) {
		this.position = position;
	}

	public Set<Integer> getCards() {
		return cards;
	}

	public void setCards(Set<Integer> cards) {
		this.cards = cards;
	}

	public Boolean getAmINext() {
		return amINext;
	}

	public void setAmINext(Boolean amINext) {
		this.amINext = amINext;
	}

	public String getWsEndpointURL() {
		return wsEndpointURL;
	}

	public void setWsEndpointURL(String wsEndpointURL) {
		this.wsEndpointURL = wsEndpointURL;
	}

	@Override
	public String toString() {
		return this.getGame().getId() +":"+ this.getUser().getLoginId();
	}
}
