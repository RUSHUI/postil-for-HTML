$(function() {
  var editor = {};
  editor.width = $(".reader-box .content").width();

  var rsMouse = {};



  // 获取选中文本
  var getSelectionObject = function() {
    var _selection = window.getSelection ? window.getSelection() : (document.getSelection ?
      document.getSelection() : (document.selection ? document.selection : null));
    return _selection;
  };

  //获取用户选中文本对象
  getCurRange = function() {
    var sel = null,
      range = null;
    if (window.getSelection) {
      sel = window.getSelection();
      console.log("选中对象个数:%o", sel.rangeCount);
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
      }
    } else if (document.selection) {
      range = document.selection.createRange();
    }
    return range;
  }

  $.getSelectionObject = getCurRange;
  //获取一个文章内容api
  var render = function(params, init) {
    $.ajax({
      data: {
        page: params.page
      },
      url: params.url,
      success: function(response) {
        $(".reader-box .content").html(response);
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

  //阅读器顶部工具功能实现（暂未实现）
  $(".contentBox .reader-tools").find("i").each(function() {
    $(this).click(function(e) {
      render({
        url: "./assets/common.txt",
        page: 0
      });
    });
  });

  $(".contentBox .content").bind("keyup keydown", function(e) {
    console.log('内容区键盘key事件被阻止');
    e.stopPropagation();
    return false;
  });
  //阅读器内容选中处理
  $(".contentBox .artcontent").bind("mousedown", function(e) {
    console.log("鼠标按下事件被捕获，然而什么都没干");
  });
  $(".contentBox .artcontent").bind("mouseup", function(e) {
    console.log("鼠标松开事件被捕获");
    rsSelectObject(this, e);
  });

  var rsSelectObject = function(elm, e) {
    var _select, _content = elm.innerHTML;
    if (null !== (_select = $.getSelectionObject())) {
      if (_select.endOffset !== _select.startOffset) {
        console.log("被选文本%o的起始位置(起始偏移):%o,结束位置:%o,结束尾偏移:%o", _select.toString(), _select.startOffset,
          _select.endOffset, _content.length - _select.endOffset);
        window.event
      } else {
        console.log("您将鼠标插入在当前文本的%o文字之后", _select.startOffset);
      }
    } else {
      $.alert("选择器获取失败！！！").find(".mask-msg-box").css("color", "rgb(253, 135, 135)");
    }
  };
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
