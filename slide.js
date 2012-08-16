/**
 * @name slide pad滑动
 * @version  v1.0
 * @create_date  2012 8
 * @author Winda Tang
 *	注释↓
 */

var keynote =(function($){
	var param = {};
	return keynote = {
		init : function(defult){
			 var param = this.param(defult);
			if(param.order){ 
				var reg = new RegExp('(' + defult.liClass + ')\d+','g');
				var seq = [];
				for(var i = 0 ; i < defult.li.length; i++ ){
					var ele = reg.exec(defult.li[i].className).replace(defult.liClass,'');
					seq[ele-1] = i;
					order(seq,0);
				}
			}
			param.trigger();
			return param;
		},
		//参数处理
		param : function(defult){
			(defult == null) && (defult = {});
			if(defult.ul==null||defult.ul==''){
				defult.ul = document.getElementById('keynote');
			}else if(typeof(defult.ul) == "string"){
				 defult.ul = document.getElementById(defult.ul);
			}else if(!defult.ul.id){
				return false;
			}
			defult.id = defult.ul.id;
			defult.currentli = 0;
			defult.li = defult.ul.getElementsByTagName('li');
			if(defult.liClass != null){
				defult.li = defult.ul.getElementsByClassName(defult.liClass);
			}else{
				defult.liClass = "keynote_li"
				var lilist = defult.ul.getElementsByClassName(defult.liClass);
				if(lilist[0]){
					defult.li = lilist;
				}else{
					for(var i = 0 ; i < defult.li.length; i++ ){
						var clasNam = defult.liClass + ' ' + defult.liClass + (i+1)
						defult.li[i].className += ' ' +clasNam;
					}
				}
			}
			(defult.trigger==null)&&(defult.trigger = this.trigger);
			(defult.speed==null)&&(defult.speed = 1000);
			(defult.liwidth==null)&&(defult.liwidth = 1024);
			(defult.callBack==null)&&(defult.callBack = function(param){});
			(defult.order==null)&&(defult.order=0);
			defult.margin = 0
			return param = defult;
		},
		//顺序重排
		order : function(seq,star){
			if(seq == null) return false;
			var node = param.ul.cloneNode(true);
				nodeli = node.getElementsByClassName(param.liClass);
			(star == null)&&(star == 0);
			for(var i=0; i<seq.length; i++){
				if(seq[i] != null){
					  param.ul.replaceChild(nodeli[seq[i]],param.li[i+star]);
				}
			}
		},
		trigger : function(){
			//var scre = param.ul,
			var scre = document.getElementsByTagName("body")[0],
				lilist = param.ul.getElementsByClassName(param.liClass);
			var SupportsTouches = ("createTouch" in document),//判断是否支持触摸
			    StartEvent = SupportsTouches ? "touchstart" : "mousedown",//支持触摸式使用相应的事件替代
			    MoveEvent = SupportsTouches ? "touchmove" : "mousemove",
			    EndEvent = SupportsTouches ? "touchend" : "mouseup";
			scre.addEventListener(StartEvent,function(){
				event.preventDefault(); 
				var ev = SupportsTouches ? event.touches[0]:event;
				var x1 = ev.clientX,direct = 0,step = 0,nextstate = 0;
			    scre.removeEventListener(MoveEvent,onmove);
			    //scre.onmousemove = null;
				if(this.setCapture) this.setCapture();
				var x3 = 0,x2=x1,direct=0;
				//scre[MoveEvent] = 
				scre.addEventListener(MoveEvent,onmove,false);
				function onmove(){
					var evonmove = SupportsTouches ? event.touches[0]:event;
					var csssty = '';
					x2 = evonmove.clientX;
					direct = x2 - x3;
					step?step:(step = param.margin);
					var shift = Math.abs(x2-x1)>(param.liwidth/2)? ((param.liwidth/2)*(x2-x1)/Math.abs(x2-x1)):(x2-x1);
					nextstate = param.margin + shift;
					if(x2!=x3){
						slide(step,x2,x1,nextstate,param.speed/200);
					}
					x3 = x2;
				}
				//scre[EndEvent]
				//scre.addEventListener("touchend",function(){alert (1244)},false);
				scre.addEventListener(EndEvent,onend,false);
				function onend(){
					//var ev = SupportsTouches ? ev.touches[0]:ev;
					//var ev = event;
					//alert(ev.clientX +' , '+ x1);
					scre.removeEventListener(MoveEvent,onmove);
					scre.removeEventListener(EndEvent,onend);
					var speed = param.speed/200;
					if(x2 != x1 ){
						
						if(nextstate>=0){
							slide(nextstate,0,1,0,param.speed/200);
							param.currentli = 0;
						}else if(Math.abs(nextstate)>=(param.li.length-1)*param.liwidth ){
							slide(nextstate,1,0,-(param.li.length-1)*param.liwidth,speed);
							param.currentli = param.li.length-1;
						}else if(direct<0){
						  if(nextstate<param.margin){ 
							param.margin = Math.ceil((param.margin-param.liwidth)/param.liwidth)*param.liwidth;
							param.currentli = Math.abs(param.margin/param.liwidth);
						    }
							slide(nextstate,0,1,param.margin,speed);
						}else if(direct>0){ //往左移动
							if(nextstate>param.margin){
								param.margin = Math.floor((param.margin+param.liwidth)/param.liwidth)*param.liwidth;
								param.currentli = Math.abs(param.margin/param.liwidth);
							}
							slide(nextstate,1,0,param.margin,speed);
						}
						param.callBack.call(this,param);
					}
				}
				function slide(_step,_x2,_x1,_nextstate,_speed){
					(_x2-_x1>0)&&(_step++);
					(_x2-_x1<0)&&(_step--);
					param.ul.style.marginLeft = _step + 'px';
					if(_step != _nextstate&&(_step<(param.liwidth) || _step > (param.liwidth*param.liwidth))){
						setTimeout(slide.call(this,_step,_x2,_x1,_nextstate,_speed));
					}
				}
				if(this.setCapture)
				this.releaseCapture();
			},false);
		}
	}
})(window)
	  /** 
		* ===================================================================
		* @keynote 参数 
		* =======================
		* 
		*  param ={
		*			ul://,id or <ul>对象  ( 默认为id keynote 的 ul 对象 )
		*			liClass://  eg if liClasslist = ["keynote_li1","keynote_li2",...] liclass="keynote_li"    className 从1开始
		*			order://  1 为需要重新排序，默认为null
		*			method://
		*			callBack: funciton
		*			trigger:funciton//
		*		    speed:number //
		*			liwidth:number// li 的宽度
		*			defult.currentli://当前li序列号 从零开始
		*		}
		*  keynote.init(param);
		*  keynote.order(seq,star);
		*  keynote.param(param); // 改参数;
		*  keynote.param.xx 直接该参数
		*  @seq 新的序列  
		*  @star 从第几个li开始替换     li 下标从0开始
		*   除初始化需要排序的情景下 li class名加序列n 会根据n的顺序进行排序其他函数与n无关
		* 
		* ===================================================================
		* css 规定
		* =======================
		*   body{margin:0;padding:0;height:748px;width:1024px;background:url(img/bg.jpg) repeat;}
		*	.wrap{height:748px;width:1024px;overflow:hidden;}
		*	ul.keynote{height:748px;margin:0;padding:0;width:99999px;list-style:none;}
		*	ul.keynote>li{height:748px;width:1024px; margin:0;padding:0;float:left;list-style:none;box-shadow:0 0 2px 2px rgba(0,0,0,0.2);}
		*   ul.keynote>li>div{height:748px; line-height:748px; width:100%;  font-size: 40px; text-align: center}
		* ===================================================================
		* HTML 规定 & eg
		* =======================
		*  <body>
		*		<!-- wrap  的宽度为屏幕宽度||显示窗口的宽度-->
		*		<div class="wrap">
		*		<!--默认样式-->
		*		<ul id="keynote" class="keynote">
		*			<li class="keynote_li keynote_li1"><div style="background: #66ffcc;">1</div></li>
		*			<li class="keynote_li keynote_li2"><div style="background: #ff99cc;">2</div></li>
		*			<li class="keynote_li keynote_li3"><div style="background: #6699cc;">3</div></li>
		*			<li class="keynote_li keynote_li4"><div style="background: #66ffcc;">4</div></li>
		*			<li class="keynote_li keynote_li5"><div style="background: #ffcc99;">5</div></li>
		*		</ul>
		*		<!--script type="text/javascript">
		*			keynote.init();
		*		</script-->
		*		<!-- ul 无限宽，调整margin，滑动窗口  >
		*		<ul id="note" class="keynote">
		*			<li class="kli kli1"><div style="background: #66ffcc;">1</div></li>
		*			<li class="kli kli2"><div style="background: #ff99cc;">2</div></li>
		*			<li class="kli kli3"><div style="background: #6699cc;">3</div></li>
		*			<li class="kli kli4"><div style="background: #ff66cc;">4</div></li>
		*		</ul >
		*		<script type="text/javascript">
		*			keynote.init({
		*				ul:'note',
		*				callBack:function(param){
		*					//alert(param.currentli)
		*					// console.log(param);
		*				}
		*			});
		*			keynote.order([2,1],1)
		*		</script-->
		*		</div>
		*	</body>
	    */