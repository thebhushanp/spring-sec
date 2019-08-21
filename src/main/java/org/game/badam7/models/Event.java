package org.game.badam7.models;

import java.util.HashMap;
import java.util.Map;

public class Event {

	private EventType type;
	private Map<String, Object> data = new HashMap<>();
	private Integer revision = -1;
	private String source;

	public EventType getType() {
		return type;
	}

	public void setType(EventType type) {
		this.type = type;
	}

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

	public void setAttribute(String key, String value) {
		data.put(key, value);
	}

	public Object getAttrValue(String key) {
		return data.get(key);
	}

	public Integer getRevision() {
		return revision;
	}

	public void setRevision(Integer revision) {
		this.revision = revision;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}
}
