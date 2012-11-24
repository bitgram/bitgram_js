// expand naming space.
bitgram.validation = {};

bitgram.validation.SignUp = function(formId) {
	formId = "#" + formId;
	this.formElement = $(formId);

	this.errors = [];

	this.messages = {
		ERROR_ALERT				: "入力項目にエラーがあります. 項目を再確認して下さい.",
		ERROR_REQUIRED 			: "* 必須入力です.",
		ERROR_EMAIL 			: "* メールアドレスの形式で指定して下さい.",
		ERROR_PASSWORD_LENGTH 	: "* 8文字以上を指定下さい.",
		ERROR_ACCOUNT_LENGTH	: "* 6文字以上12文字以下を指定して下さい.",
		WORNING_ACCOUNT_EXISTS	: "アカウントは既に使用されています.",
		ERROR_AGREEMENT_CHECK	: "* 登録には一般使用条件への同意が必要です.",
		ERROR_CONTAIN_BLANK		: "* 空白を含むことはできません.",
		ERROR_NOT_AB_NUM		: "* 英数字のみが使用できます.",
		ERROR_PASSWORD_NO_MATCH	: "* パスワードが一致しません."
	};

	this.elements = {
		lastname: 	$("#input-lastname"),
		firstname: 	$("#input-firstname"),
		account: 	$("#input-account"),
		password: 	$("#input-password"),
		password2: 	$("#input-password-confirm"),
		email: 		$("#input-email"),
		agreement:  $("#input-agreement")
	};

	this.commons = new bitgram.validation.Commons();
	this.init();
};

bitgram.validation.SignUp.prototype = {
	init: function() {
		var _orig = this;
		this.formElement.submit(function(){ return _orig.validate(); });
	},

	trimElementValue: function() {
		for (var i in this.elements) {
			var e = this.elements[i].find("input");
			if (e.val()) {
				e.val(e.val().replace(/(^\s+|\s+$)/, ""));
			}
		}
	},

	validate: function() {
		this.trimElementValue();
		this.errors = [];
		$(".text-error").remove();
		$("#error-message").remove();
		for (var i in this.elements) {
			this.elements[i].removeClass("error");
		}

		this.name(this.elements.lastname);
		this.name(this.elements.firstname);
		this.account(this.elements.account);
		this.password(this.elements.password, this.elements.password2);
		this.email(this.elements.email);
		this.agreement(this.elements.agreement);
		
		if (this.errors.length) {
			var errorMessage = $("<div>").addClass("alert alert-error");
			errorMessage.html("<h5 style='margin:0;'>入力エラー</h5>" + this.messages.ERROR_ALERT);
			errorMessage.attr("id", "error-message");
			this.formElement.find("legend").after(errorMessage);
			alert(this.messages.ERROR_ALERT);
			return false;
		}
		return true;
	},

	name: function(element) {
		var input = element.find("input");
		if (this.commons.isBlank(input.val())) {
			this.addError(element, this.messages.ERROR_REQUIRED);
		}
		if (this.commons.isContainBlank(input.val())) {
			this.addError(element, this.messages.ERROR_CONTAIN_BLANK);
		}
	},

	account: function(element) {
		this.name(element);
		var input = element.find("input");
		if (!this.commons.isABNum(input.val())) {
			this.addError(element, this.messages.ERROR_NOT_AB_NUM);
		}
		if (!this.commons.isRightLength(6, 12, input.val())) {
			this.addError(element, this.messages.ERROR_ACCOUNT_LENGTH);			
		}

	},

	password: function(element, confirmElement) {
		var input = element.find("input");
		if (!this.commons.isABNum(input.val())) {
			this.addError(element, this.messages.ERROR_NOT_AB_NUM);
		}

		if (!this.commons.isRightLength(8, 50, input.val())) {
			this.addError(element, this.messages.ERROR_PASSWORD_LENGTH);
		}

		var confirmInput = confirmElement.find("input");
		if (!this.commons.isRightLength(8, 50, confirmInput.val())) {
			this.addError(confirmElement, this.messages.ERROR_PASSWORD_LENGTH);
		}

		if (input.val() != confirmInput.val()) {
			this.addError(confirmElement, this.messages.ERROR_PASSWORD_NO_MATCH);
		}

	},

	email: function(element) {
		var input = element.find("input");
		if (this.commons.isBlank(input.val())) {
			this.addError(element, this.messages.ERROR_REQUIRED);
		}
		if (!this.commons.isEmail(input.val())) {
			this.addError(element, this.messages.ERROR_EMAIL);
		}
	},

	agreement: function(element) {
		var input = element.find("input");
		if (!input.attr('checked')) {
			this.addError(element, this.messages.ERROR_AGREEMENT_CHECK);
		}
	},

	addError: function(element, message) {
		var error = {
			element: element,
			message: message,
		};

		this.errors.push(error);

		element.addClass("error");
		var errorMessage = $("<span>").text(message);
		errorMessage.css({
			display: 	"block",
			fontSize: 	"small",
			lineHeight: "1",
			marginTop: 	"0.25em",
			marginLeft: "0.5em"
		});
		errorMessage.addClass("text-error");
		element.find("input").after(errorMessage);
	}

};

bitgram.validation.Commons = function() {
}

bitgram.validation.Commons.prototype = {

	isBlank: function(val) {
		if (val) {
			return false;
		}
		return true;
	},

	isContainBlank: function(val) {
		if (val.match(/\s/)) {
			return true;
		}
		return false;
	},

	isABNum: function(val) {
		if (val.match(/[^a-z0-9]/gi)) {
			return false;
		}
		return true;
	},

	isRightLength: function(min, max, val) {
		if (val.length < min || val.length > max) {
			return false;
		}
		return true;
	},

	isEmail: function(val) {
		if (val.match(/[^a-z0-9@\.]/gi)) {
			return false;
		}
		
		if (!val.match(/^\S+@\S+(\.\S+)+$/)) {
			return false;
		}
		return true;
	},
}