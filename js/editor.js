;
(function($, win, doc, ufd) {

  if (!("rs" in win)) {
    var rs = {};
  }

  function Editor() {
    var config = {};
    this.init();
  }
  Editor.prototype = {
    constructor: Editor,
    init: function() {
      this.createDom();
      this.bindEvent();
    },
    createDom: function() {},
    bindEvent: function() {},
    show: function() {},
    hide: function() {},
    destory: function() {}
  };
  win.editor = new Editor();

})(jQuery, window, document);


$(function() {
  console.log($);
  var editor = {};
  var $elm = $(".editor"); //array
  var rsMouse = {};
  editor.posBox = [];
  var elms = Array.prototype.slice.call($elm);
  elms.forEach(function(item, idx, array) {
    var $item = $(item);
    $item.attr("data-idx", idx);
    //获取每个编辑器的ClientRect参数
    var ths = item.getBoundingClientRect();
    editor.posBox.push({
      index: idx,
      left: ths.left,
      right: ths.right,
      top: ths.top,
      bottom: ths.bottom,
      width: ths.width,
      height: ths.height
    });
  });
  var curEditor = editor.posBox[0];

  //到父窗口的位置转换

  // 初始化文章
  $.ajax({
    data: {
      page: 0
    },
    url: "./assets/common.txt",
    success: function(response) {
      $(".reader-box .content").html(response);
      editor.article = response;
      $.alert("init article sucess!");
    },
    failure: function() {
      $.alert("文章获取失败！！！")
        .find(".mask-msg-box")
        .css("color", "rgb(253, 135, 135)");
    }
  });

  //获取用户选中文本对象
  var getCurRange = function() {
    var sel = null,
      range = null;
    if (window.getSelection) {
      sel = window.getSelection();
      //console.log("选中对象个数:%o", sel.rangeCount);
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
      }
    } else if (document.selection) {
      range = document.selection.createRange();
    }
    return range;
  };

  $.getSelectionObject = getCurRange;
  //获取一个文章内容api
  var render = function(params) {
    $.ajax({
      data: {
        page: params.page
      },
      url: params.url,
      success: function(response) {
        $(".reader-box .content").html(response);
        $.alert("render sucess!");
      },
      failure: function() {
        $.alert("文章获取失败！！！").find(".mask-msg-box").css("color", "rgb(253, 135, 135)");
      }
    });

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

  $(".contentBox .content").bind("keyup keydown", function(e) {
    if (e.keyCode !== 16) { //shift键
      console.log('=====内容区键盘已禁用=====');
      return false;
    }
    e.stopPropagation();
  });
  //阅读器内容选中处理
  $(".contentBox .artcontent").bind("mousedown", function(e) {
    console.log("=====鼠标按下=====");
    $(".tools").hide();
  });

  $(".contentBox .artcontent").bind("mousemove", function(e) {

  });



  $(".contentBox .artcontent").bind("mouseup", function(e) {
    console.log("=====鼠标松开=====");
    rsMouse.targetPos = rsMouse.tmpPos;
    console.log("=====光标位置：%o=====", rsMouse.targetPos);
    rsSelectObject(this, e);
    saveSelection();
  });
  $(".contentBox .artcontent").get(0).onblur = function(e) {
    restoreSelection();
  };
  var insertSign = function(range) {
    var sign = range.createContextualFragment("<sign></sign>");
  };
  var rsSelectObject = function(elm, e) {
    var _select, _content = elm.innerHTML;
    if (null !== (_select = $.getSelectionObject())) {
      var _tPos = $(elm).position();
      var pos = {
        x: rsMouse.targetPos.x - curEditor.left + _tPos.left - tooltips.rect().width / 2 -
          10,
        y: rsMouse.targetPos.y - curEditor.top - _tPos.top - tooltips.rect().height - 20 -
          10
      };
      var diffx = curEditor.width - tooltips.rect().width;
      var diffy = curEditor.height - tooltips.rect().height;
      pos.x = pos.x < 0 ? 0 : pos.x;
      pos.x = pos.x > diffx ? diffx : pos.x;
      pos.y = pos.y < 0 ? 0 : pos.y;
      pos.y = pos.y > diffy ? diffy : pos.y;
      if (!_select.collapsed) { //起始和结束是否重合
        $(".tools").css({
          display: "block",
          left: pos.x + "px",
          top: pos.y + "px"
        });

        //  console.log("被选文本%o的起始位置(起始偏移):%o,结束位置:%o,结束尾偏移:%o", _select.toString(), _select.startOffset,
        //  _select.endOffset, _content.length - _select.endOffset);
        saveSelection();
        insertSign(_select);
      } else {
        $(".tools").css({
          display: "none",
          left: pos.x + "px",
          top: pos.y + "px"
        });
        console.log("请插入内容", _select.startOffset);
      }
    } else {
      $.alert("选择器获取失败！！！").find(".mask-msg-box").css("color", "rgb(253, 135, 135)");
    }
  };
  //获取当前的选中范围
  var getCurrentRange = function() {
      //获取浏览器的选择区域（注意，低版本IE不支持，有另外的兼容性方案）
      //如果此时鼠标选中一段文字，则将获取选中的内容；如果此时鼠标未选中任何内容，则返回空内容（不是null）
      var sel = window.getSelection();

      if (sel.getRangeAt && sel.rangeCount) {
        //检查这段选中区域选中的范围（range），并返回第一个range
        //浏览器支持一个selection中多个range，但是富文本编辑器是通过鼠标选中得到range，此时只有一个，取第一个即可
        return sel.getRangeAt(0);
      }
    },

    //将当前选中的范围，保存到一个变量中（供 restoreSelection 方法使用）
    saveSelection = function() {
      // selectedRange 是一个全局变量
      editor.selectedRange = getCurrentRange();
    },

    //将当前 selectedRange 变量中存储的范围，恢复到选择区域中
    restoreSelection = function() {
      //获取一个选区。（这时候一般都是空选取，因为要等待用存储的range来restore这个选取）
      var selection = window.getSelection();

      // selectedRange 是一个全局变量
      if (editor.selectedRange) {
        try {
          selection.removeAllRanges();
        } catch (ex) {
          var textRange = document.body.createTextRange();
          textRange.select();
          document.selection.empty();
        }

        //将 selectedRange 存储的范围，添加到这个选取上
        selection.addRange(editor.selectedRange);
      }
    };
  $.toolTips = function(ops) {
    var config = {
      direction: "top",
      theme: "default",
      container: $("body")
    };
    var options = $.extend(config, ops);
    var html =
      "<div class='tools'>\
          <ul>\
            <li data-cmd='Bold' data-ops=''   title='文字加粗'><i class='rs rs-bold'></i></li>" +
      "<li data-cmd='Italic'    data-ops=''   title='文字斜体'><i class='rs rs-italic' title='文字斜体'></i></li>" +
      "<li data-cmd='Underline' data-ops=''   title='字下划线'><i class='rs rs-underline'></i></li>" +
      "<li data-cmd='StrikeThrough' data-ops='' title='字删除线'><i class='rs rs-strikethrough'></i></li>" +

      "<li data-cmd='ForeColor' data-ops='rgba(234, 236, 138, 0.76)'   title='文字高亮'><i class='rs rs-font'></i></li>" +
      "<li data-cmd='ForeColor' data-ops=''   title='文字颜色'><i class='fortColor rs rs-font'></i><div class='rs-colorpicker'></div></li>" +
      "<li data-cmd='BackColor' data-ops='rgba(234, 236, 138, 0.76)'   title='背景高亮'><i class='rs rs-now_wallpaper rs-color_lens'></i></li>" +
      "<li data-cmd='BackColor' data-ops=''   title='背景颜色'><i class='backColor rs rs-now_wallpaper rs-color_lens'></i><div class='rs-colorpicker'></div></li>" +
      "</ul>\
        </div>";
    var tools = $(html).appendTo(options.container);

    tools.find("li").each(function() {
      $(this).click(function() {
        restoreSelection();
        $(curEditor).focus();
        var cmd = $(this).attr("data-cmd"),
          ops = $(this).attr("data-ops");
        document.execCommand(cmd, 0, ops);
        tools.hide();
      });
    });
    $.fn.jPicker.defaults.images.clientPath = 'assets/images/jPicker/';
    $(".rs-colorpicker").jPicker({
      window: {
        expandable: true
      }
    });
    return tools;
  };

  var tooltips = $.toolTips({
    container: $(".wrapper")
  });
  tooltips.rect = function() {
    return {
      width: $(".wrapper").find(".tools").width(),
      height: $(".wrapper").find(".tools").height()
    };
  };
  //这个三个方法的应用顺序一般是：
  //1. 鼠标选中editor的一段内容之后，立即执行 saveSelection() 方法
  //2. 当你想执行 execCommand（例如加粗、插入链接等） 方法之前，先调用 restoreSelection() 方法


  function mouseMove(ev) {
    Ev = ev || window.event;
    var mousePos = mouseCoords(ev);
    //console.log(rsMouse.x + "    ===" + rsMouse.y);
    return {
      x: mousePos.x,
      y: mousePos.y
    };
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

  $.ajax({
    url: "./js/a.js",
    dataType: "jsonp",
    jsonp: "callback",
    success: function() {
      alert(3);
    }
  });
  // callback = function(response) {
  //   alert(response.text);
  // }

  $(".content").bind("mousemove", function(e) {
    rsMouse.tmpPos = mouseMove(e);
  });
});


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
