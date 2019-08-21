package org.game.badam7.models;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "game")
public class Game {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(name = "max_players")
	private Integer maxPlayers;
	@Column(name = "start_time")
	private LocalDateTime startTime;
	@ManyToOne(cascade = CascadeType.ALL)
	private User admin;
	@OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
	private Set<GameToken> gameTokens;
	@OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
	private Set<GamePlayer> players;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getMaxPlayers() {
		return maxPlayers;
	}

	public void setMaxPlayers(Integer maxPlayers) {
		this.maxPlayers = maxPlayers;
	}

	public User getAdmin() {
		return admin;
	}

	public void setAdmin(User admin) {
		this.admin = admin;
	}

	public LocalDateTime getStartTime() {
		return startTime;
	}

	public void setStartTime(LocalDateTime starTime) {
		this.startTime = starTime;
	}

	public Set<GameToken> getGameTokens() {
		return gameTokens;
	}

	public void setGameTokens(Set<GameToken> gameTokens) {
		this.gameTokens = gameTokens;
	}

	public Set<GamePlayer> getPlayers() {
		return players;
	}

	public void setPlayers(Set<GamePlayer> players) {
		this.players = players;
	}

	public void addPlayer(GamePlayer player) {
		if(players == null) {
			players = new HashSet<>();
		}
		player.setGame(this);
		players.add(player);
	}
}
