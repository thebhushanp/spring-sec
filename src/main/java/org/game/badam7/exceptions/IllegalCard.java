package org.game.badam7.exceptions;

public class IllegalCard extends Exception {

	/**
	 *
	 */
	private static final long serialVersionUID = 8767085667783270711L;
	private int errCode;
	private String msg;

	public IllegalCard(int errCode, String msg) {
		super();
		this.errCode = errCode;
		this.msg = msg;
	}

	public int getErrCode() {
		return errCode;
	}

	public void setErrCode(int errCode) {
		this.errCode = errCode;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

}
