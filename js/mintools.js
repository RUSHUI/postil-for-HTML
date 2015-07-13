/*!
 * @packet brooder.mobi.util.mintools;
 */
$.confirm = function(msg, fn) {
	var str = "<div class='mask-msg'><div class='message'><header>" + msg +
		"</header><section><div class='btn cancel'>取消</div><div class='btn ok'>确认</div></section></div></div>";
	var $elm = $(str).appendTo($("body"));
	setTimeout(function() {
		$elm.find(".message").addClass("toCenter");
	}, 50);
	$elm.find(".btn").each(function() {
		$(this).click(function(e) {
			if ($(this).hasClass("ok")) {
				fn && fn();
			}
			$elm.find(".message").removeClass("toCenter");
			setTimeout(function() {
				$elm.remove();
			}, 500);

		});
	});
	$elm.click(function() {
		$elm.find(".message").removeClass("toCenter");
		setTimeout(function() {
			$elm.remove();
		}, 500);
	});
	$elm.find(".message").click(function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
};

$.prompt = function(msg, fn) {
	var str = "<div class='mask-msg'><div class='message'><header>" + msg +
		"</header><section><div class='inputarea'><input type='text' placeholder='输入任务名'></div><div class='btn cancel'>取消</div><div class='btn ok'>确认</div></section></div></div>";
	var $elm = $(str).appendTo($("body"));
	setTimeout(function() {
		$elm.find(".message").addClass("toCenter");
	}, 50);
	$elm.find(".btn").each(function() {
		$(this).click(function(e) {
			if ($(this).hasClass("ok")) {
				fn && fn($elm.find("input").val());
			}
			$elm.find(".message").removeClass("toCenter");
			setTimeout(function() {
				$elm.remove();
			}, 500);
		});
	});
	$elm.click(function(e) {
		$elm.find(".message").removeClass("toCenter");
		setTimeout(function() {
			$elm.remove();
		}, 500);
	});
	$elm.find(".message").click(function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
};
$.alert = function(msg, fn, position) {
	var str = "<div class='mask-msg'><div class='mask-msg-box'><i class='rs rs-sms' ></i> " + msg +
		"</div></div>";
	var $elm = $(str).appendTo(position || $("body"));
	setTimeout(function() {
		$elm.find(".mask-msg-box").addClass("toCenter");
	}, 50);

	setTimeout(function() {
		$elm.find(".mask-msg-box").removeClass("toCenter");
		setTimeout(function() {
			$elm.remove();
		}, 500);
	}, 1500);
};
