package org.game.badam7.models;

import java.util.HashMap;
import java.util.Map;

public class Notification {

	private String action;
	private Map<String, Object> data = new HashMap<>();

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

}
