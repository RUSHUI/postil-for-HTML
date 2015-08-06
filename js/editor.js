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
  var $elm = $(".editor .wrapper"); //array
  var rsMouse = {};
  editor.posBox = [];
  var elms = Array.prototype.slice.call($elm);
  elms.forEach(function(item, idx, array) {
    var $item = $(item);
    $item.attr("data-idx", idx);
    //获取每个编辑器的ClientRect参数
    var ths = item.getBoundingClientRect();
    editor.posBox.push({
      element:item,
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
  var render = function(params,fn) {
    $.ajax({
      data: {
        page: params.page
      },
      url: params.url,
      success: function(response) {
        fn&&fn(response);

      },
      failure: function() {
        $.alert("文章获取失败！！！").find(".mask-msg-box").css("color", "rgb(253, 135, 135)");
      }
    });

  };

  //阅读器顶部工具功能实现（暂未实现）
  $(".contentBox .reader-tools").find("i").each(function() {
    $(this).click(function(){
      if($(this).hasClass("read")){
        $(curEditor.element).parent().attr("contentEditable","false");
        $(curEditor.element).parent().css({
          "border":"none",
          "outline":"none"
        });
        $.alert("阅读模式");
      }else{
        $(curEditor.element).parent().attr("contentEditable","true");
        $(curEditor.element).parent().css({
          "border":"2px solid #757575",
          "outline":"#7A7A7B dotted 3px"
        });
        $.alert("编辑模式");
      }
    });

  });
  $(".content").bind("mousewheel",function(e){
    var $content=$(".reader-box .content").get(0),
    scrollTop =$content.parentNode.scrollTop,
    clientHeight= $($content.parentNode).height(),
    scrollHeight=$content.parentNode.scrollHeight;
    if(scrollTop+clientHeight>=scrollHeight){
      render({
        url: "./assets/common.txt",
        page: 0
      },function(text){
        $content.innerHTML+=text;
        $.alert("获取成功");
      });
    }
  });
  $(".contentBox .content").bind("keyup keydown", function(e) {
    if (e.keyCode !== 16) { //shift键
      console.log('=====内容区键盘已禁用=====');
      return false;
    }
    e.stopPropagation();
  });
  $(".contentBox .content").blur(function(e) {
console.log("blur");
    //restoreSelection();
  });
  //阅读器内容选中处理
  $(".contentBox .content").bind("mousedown", function(e) {
    console.log("=====鼠标按下=====");
    $(".tools").hide();
  });

  $(".contentBox .content").bind("mousemove", function(e) {

  });



  $(".contentBox .content").bind("mouseup", function(e) {
    console.log("=====鼠标松开=====");
    rsMouse.targetPos = rsMouse.tmpPos;
    console.log("=====光标位置：%o=====", rsMouse.targetPos);
    if($(curEditor.element).parent().attr("contentEditable")==="true"){
      rsSelectObject(this, e);
    }

    saveSelection();
  });
  $(".content").attr("tabindex",0);

  $(".content").attr("hidefocus","true");


  var insertSign = function(range) {
    var sign = range.createContextualFragment("<sign></sign>");
  };
  var rsSelectObject = function(elm, e) {
    var _select, _content = elm.innerHTML;
    if (null !== (_select = $.getSelectionObject())) {
      var _tPos = $(elm).position();
      console.log("==鼠标位置L:%o,T:%o=====编辑器框的L:%o,T:%o=====提示框的W:%o,H:%o==",
      rsMouse.targetPos.x,rsMouse.targetPos.y,curEditor.left,curEditor.top,
      tooltips.rect().width/2,tooltips.rect().height);
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
      //pos.y = pos.y > diffy ? diffy : pos.y;
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
            <li data-cmd='Bold' class='cmd' data-ops=''   title='文字加粗'><i class='rs rs-bold'></i></li>" +
      "<li data-cmd='Italic'    class='cmd' data-ops=''   title='文字斜体'><i class='rs rs-italic' title='文字斜体'></i></li>" +
      "<li data-cmd='Underline' class='cmd' data-ops=''   title='字下划线'><i class='rs rs-underline'></i></li>" +
      "<li data-cmd='StrikeThrough' class='cmd' data-ops='' title='字删除线'><i class='rs rs-strikethrough'></i></li>" +

      "<li data-cmd='ForeColor' class='cmd' data-ops='rgb(255, 255, 153)'   title='文字高亮'><i class='rs rs-font'></i></li>" +
      "<li data-cmd='ForeColor' class='colorpicker' data-ops=''   title='文字颜色'><i class='fortColor rs rs-font'></i><div class='rs-colorpicker'></div></li>" +
      "<li data-cmd='BackColor' class='cmd' data-ops='rgb(255, 255, 153)'   title='背景高亮'><i  style='font-size: 16px;' class='rs rs-now_wallpaper rs-color_lens'></i></li>" +
      "<li data-cmd='BackColor' class='colorpicker' data-ops=''   title='背景颜色'><i class='backColor rs rs-now_wallpaper rs-color_lens'></i><div class='rs-colorpicker'></div></li>" +
      "<li data-cmd='undo' class='cmd' data-ops=''   title='撤销命令'><i  style='font-size: 16px;' class=' rs rs-undo'></i></li>" +
      "<li data-cmd='Postil' class='postil' data-ops=''   title='添加批注'><i style='font-size: 16px;' class=' rs rs-note_add'></i></li>" +
      "</ul>\
        </div>";
    var tools = $(html).appendTo(options.container);

    tools.find("li").each(function() {
      $(this).click(function() {
        restoreSelection();
        if($(this).hasClass("colorpicker")){
          config.current=$(this);
        }else if($(this).hasClass("cmd")){
          $(curEditor).focus();
          var cmd = $(this).attr("data-cmd"),
            ops = $(this).attr("data-ops");
          document.execCommand(cmd, 0, ops);
          tools.hide();
        }else{
          tools.hide();
          $.prompt("输入批注",true,function(value){
            var range=editor.selectedRange;

        			// //IE之外的浏览器，如果在选择内容包含其他标签的一部分的时候会报异常
        			// var mark = document.createElement("ins");
        			// mark.setAttribute("comment", value);
        			// mark.className = "postil";
        			// mark.id=new Date().getTime();
        			// range.surroundContents(mark);

        			var selected = range.extractContents().textContent;
        			var text = "[ins id='"+(new Date().getTime())+"' comment='"+value+"']"+selected+"[/ins]";
        			var textNode = document.createTextNode(text);
        			range.insertNode(textNode);
        			var content = $(".content").html();
        			var reg = /\[ins id='(\d*)' comment='([\w\W]*)']([\w\W]*)\[\/ins]/gi;
        			console.log(reg.exec(content));
        			var id = RegExp.$1,
        			comment = RegExp.$2,
        			c = RegExp.$3;
              console.log(id,comment);
        			var reHtml = "<ins id='"+id+"' comment='"+comment+"' class='postil' >"+c+"<svg class='icons minipostil icon-bubble2'><use xlink:href='#icon-bubble2'></use></svg></ins>";
        			content = content.replace(reg, reHtml);
        			$(".content").html(content);
              $(".content .minipostil").each(function(){
                $(this).click(function(e){
                  e.preventDefault();
                 e.stopPropagation();
                   $.confirm($(this.parentNode).attr("comment"),function(){

                   });

                });
              });
          });
        }
      });
    });
    $.fn.jPicker.defaults.images.clientPath = 'assets/images/jPicker/';
    $(".rs-colorpicker").jPicker(
      {
        window: {
          expandable: true
        }
      },
        function(color, context)
        {
          var all = color.val('all');
          //alert('Color chosen - hex: ' + (all && '#' + all.hex || 'none') + ' - alpha: ' + (all && all.a + '%' || 'none'));
          var rgba= "rgba("+all.r+","+all.g+","+all.b+","+(all.a/255)+")";

          $(curEditor).focus();
          config.current.attr("data-ops",rgba);
          var cmd = config.current.attr("data-cmd"),
            ops =rgba ;
          document.execCommand(cmd, 0, ops);
          tools.hide();

          $('#Commit').css(
            {
              backgroundColor: all && '#' + all.hex || 'transparent'
            }); // prevent IE from throwing exception if hex is empty
        },
        function(color, context)
        {
          //if (context == LiveCallbackButton.get(0)) alert('Color set from button');
          var hex = color.val('hex');
          // LiveCallbackElement.css(
          //   {
          //     backgroundColor: hex && '#' + hex || 'transparent'
          //   }); // prevent IE from throwing exception if hex is empty
        },
        function(color, context)
        {

        }
  );
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
