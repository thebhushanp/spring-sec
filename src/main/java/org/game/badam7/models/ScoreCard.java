package org.game.badam7.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "score_card")
@SequenceGenerator(name = "sc_id_seq", sequenceName = "sc_id_seq", allocationSize = 1)
public class ScoreCard {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sc_id_seq")
	@Column(name = "id")
	private int id;

	@Column
	private Integer score = 0;

	@ManyToOne()
	@JoinColumn(name = "player_game_id")
	private GamePlayer playerGame;

	public ScoreCard() {
	}

	public ScoreCard(Integer score, GamePlayer playerGame) {
		super();
		this.score = score;
		this.playerGame = playerGame;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}

	public GamePlayer getPlayerGame() {
		return playerGame;
	}

	public void setPlayerGame(GamePlayer playerGame) {
		this.playerGame = playerGame;
	}

}
