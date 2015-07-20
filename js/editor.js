$(function() {
  var editor = {};
  editor.width = $(".reader-box .content").width();

  // 获取选中文本
  var gslt = function() {
    var _selection = window.getSelection ? window.getSelection() : (document.getSelection ?
      document.getSelection() : (document.selection ? document.selection : null));
    return _selection;
  };
  //获取一个文章内容api
  var render = function(params, init) {
    $.ajax({
      data: {
        page: params.page
      },
      url: params.url,
      success: function(response) {
        editor.text = response;
        var rows = splitText(editor.text, editor.width);
        $(".reader-box .content").html("<div>" + rows.join("</div><div>") + "</div>");
        !init && $.alert("render sucess!");
      },
      failure: function() {
        $.alert("文章获取失败！！！").find(".mask-msg-box").css("color", "rgb(253, 135, 135)");
      }
    });

  };
  //首次打开获取内容显示
  render({
    url: "./assets/common.txt",
    page: 0
  }, "init");

  var splitText = function(str, len) {
    var str = str,
      w = len,
      rows = [],
      str_maxLen = 0,
      str_cut = "",
      idx = 0;
    for (var i = 0, _len = str.length; i < _len; i++) {
      var _a = str.charAt(i);
      str_maxLen++;
      if (escape(_a).length > 4) {
        //中文字符的长度经编码之后大于4
        str_maxLen++;
      }
      str_cut = str_cut.concat(_a);
      if (str_maxLen % w === 0) {
        rows[idx++] = str_cut;
        str_cut = "";
      }
      //剩余部分长度不足width长度时
      if (str_maxLen % w !== 0 && i === _len - 1) {
        rows[idx] = str_cut;
      }
    }
    return rows;
  };



  //阅读器顶部工具功能实现（暂未实现）
  $(".contentBox .reader-tools").find("i").each(function() {
    $(this).click(function(e) {
      render({
        url: "./assets/common.txt",
        page: 0
      });
    });
  });

  $(".contentBox .content").bind("keyup keydown", function() {
    return false;
  });
  //阅读器内容选中处理
  $(".contentBox .reader-box").bind("mouseup", function() {
    var _select;
    if (null !== (_select = getSelectionObject())) {
      if (_select.anchorOffset !== _select.focusOffset) {

      }
    } else {
      $.alert("选择器获取失败！！！").find(".mask-msg-box").css("color", "rgb(253, 135, 135)");
    }
  });
});

function mouseMove(ev) {
  Ev = ev || window.event;
  var mousePos = mouseCoords(ev);
  return {
    x: mousePos.x,
    y: mousePos.y
  }
}

function mouseCoords(ev) {
  if (ev.pageX || ev.pageY) {
    return {
      x: ev.pageX,
      y: ev.pageY
    };
  }
  return {
    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
    y: ev.clientY + document.body.scrollTop - document.body.clientTop
  };
}

$(".content").get(0).onmousemove = mouseMove;
//
(function($, win, doc, emt) {
  // $(".reader-box .content").bind("mousedown")

  // @todo 获取所选文本的开始和结束位置
  function getPositions() {
    var el = document.getElementById('selected');
    var startPosition = 0; //所选文本的开始位置
    var endPosition = 0; //所选文本的结束位置
    if (document.selection) {
      //IE
      var range = document.selection.createRange(); //创建范围对象
      var drange = range.duplicate(); //克隆对象

      drange.moveToElementText(el); //复制范围
      drange.setEndPoint('EndToEnd', range);

      startPosition = drange.text.length - range.text.length;
      endPosition = startPosition + range.text.length;
    } else if (window.getSelection) {
      //Firefox,Chrome,Safari etc
      startPosition = el.selectionStart;
      endPosition = el.selectionEnd;
    }
    return {
      'start': startPosition,
      'end': endPosition
    };
  }

  //@todo 获取textarea中，选中的文本
  function getSelected() {
    var position = getPositions();
    var start = position.start; //开始位置
    var end = position.end; //结束位置
    var text = document.getElementById('selected').value;
    var selectText = text.substr(start, (end - start)); //textarea中，选中的文本
  }
})(jQuery, window, document);
