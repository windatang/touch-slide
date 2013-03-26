/**
 * @name slide pad滑动
 * @version  v1.0
 * @create_date  2012 8
 * @author Winda Tang
 *	注释↓
 */

var SupportsTouches = ("createTouch" in document),//判断是否支持触摸
    StartEvent = SupportsTouches ? "touchstart" : "mousedown",//支持触摸式使用相应的事件替代
    MoveEvent = SupportsTouches ? "touchmove" : "mousemove",
    EndEvent = SupportsTouches ? "touchend" : "mouseup";
var keynote =(function($){
	return keynote = {
		init : function(defult){
			 var param = this.param(defult);
			if(param.order){
				var reg = new RegExp('(' + defult.liClass + ')\d+','g');
				var seq = [];
				for(var i = 0 ; i < defult.li.length; i++ ){
					var ele = reg.exec(defult.li[i].className).replace(defult.liClass,'');
					seq[ele-1] = i;
					order(seq,0,param);
				}
			}
			param.trigger(param);
			param.callBack.call(this,param);
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
			defult.currentLi = defult.preLi = 0;
			defult.li = defult.ul.getElementsByTagName('li');
			if(defult.liClass != null&&defult.liClass != ''){
				defult.li = defult.ul.getElementsByClassName(defult.liClass);
			}else{
				defult.liClass = "keynote_li";
				for(var i = 0 ; i < defult.li.length; i++ ){
					if(!/(keynote_li)/.test(defult.li[i].className)){
						var clasNam = defult.liClass + ' ' + defult.liClass + (i+1)
						defult.li[i].className += ' ' +clasNam;
					}
				}

			}
			defult.preLicontent =  defult.li[0].innerHTML;
			(defult.trigger==null)&&(defult.trigger = this.trigger);
			(defult.speed==null)&&(defult.speed = 1000);
			(defult.liwidth==null)&&(defult.liwidth = 1024);
			(defult.liheight==null)&&(defult.liheight = 652);
			(defult.callBack==null)&&(defult.callBack = function(param){});
			(defult.order==null)&&(defult.order=0);
			defult.margin = 0
			return param = defult;
		},
		//顺序重排
		order : function(seq,star,param){
			if(param == null){
				order.callBack(seq,star,params)
			}
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
		trigger : function(param){
			var scre = param.ul,
				lilist = param.ul.getElementsByClassName(param.liClass);
			scre.addEventListener(StartEvent,function(){
				// event.preventDefault();
				var ev = SupportsTouches ? event.touches[0]:event;
				var x1 = paramtrig.getClient(ev,param),direct = 0,step = 0,nextstate = 0;
			    scre.removeEventListener(MoveEvent,onmove);
			    //scre.onmousemove = null;
				if(this.setCapture) this.setCapture();
				var x3 = 0,x2 = x1,direct = 0;

				var ax = Math.abs(ev.clientX),ay = Math.abs(ev.clientY);
				var bx = 0,by = 0;
				//scre[MoveEvent] =
				scre.addEventListener(MoveEvent,onmove,false);
				function onmove(){
					param.ul.style.webkitTransition = "";
					var evonmove = SupportsTouches ? event.touches[0]:event;
					var csssty = '';
					x2 = paramtrig.getClient(evonmove,param);
					 bx = Math.abs(evonmove.clientX);
					 by = Math.abs(evonmove.clientY);
					direct = x2 - x3;
					step?step:(step = paramtrig.getMargin(param) );
					var shift = Math.abs(x2-x1)>(paramtrig.field(param)/2)? ((paramtrig.field(param)/2)*(x2-x1)/Math.abs(x2-x1)):(x2-x1);
					nextstate = paramtrig.getMargin(param) + shift;
					if(x2!=x3){
						slide(step,x2,x1,nextstate,param.speed/200);
					}
					x3 = x2;
				}
				scre.addEventListener(EndEvent,onend,false);
				function onend(){
					//var ev = SupportsTouches ? ev.touches[0]:ev;
					//var ev = event;
					//alert(ev.clientX +' , '+ x1);
					param.ul.style.webkitTransition = "margin .3s linear";
					scre.removeEventListener(MoveEvent,onmove,false);
					scre.removeEventListener(EndEvent,onend,false);
					var speed = param.speed/1000;
					if((Math.abs(x2 - x1) >10)&&(param.multilevel == 1 || Math.abs((by-ay)/(bx-ax))<1) ){
						param.preLi = param.currentLi;
						if(nextstate>=0){
						    //slide(nextstate,0,1,0,param.speed/200);
							param.currentLi = 0;
						}else if(Math.abs(nextstate)>=(param.li.length-1)*paramtrig.field(param) ){
						    //slide(nextstate,1,0,-(param.li.length-1)*paramtrig.field(param),speed);
							param.currentLi = param.currentLi;
						}else if(direct<0){
						  if(nextstate<paramtrig.getMargin(param)){
							paramtrig.setMargin(param,Math.ceil((paramtrig.getMargin(param)-paramtrig.field(param))/paramtrig.field(param))*paramtrig.field(param))
							param.currentLi = Math.abs(paramtrig.getMargin(param)/paramtrig.field(param));
						    }
							//slide(nextstate,0,1,param.margin,speed);
						}else if(direct>0){ //往左移动
							if(nextstate>paramtrig.getMargin(param)){
								paramtrig.setMargin(param,Math.floor((paramtrig.getMargin(param)+paramtrig.field(param))/paramtrig.field(param))*paramtrig.field(param))
								param.currentLi = Math.abs(paramtrig.getMargin(param)/paramtrig.field(param));
							}
							//slide(nextstate,1,0,param.margin,speed);
						}
						paramtrig.changeMargin(param,paramtrig.getMargin(param))
						param.callBack.call(this,param);
					}else{
						//console.log(paramtrig.getMargin(param));
						paramtrig.changeMargin(param,paramtrig.getMargin(param))
					}
				}
				function slide(_step,_x2,_x1,_nextstate,_speed){
					(_x2-_x1>0)&&(_step++);
					(_x2-_x1<0)&&(_step--);
					// if(_x2>_x1){
					// 	console.log(_x2,_nextstate)
					// }
					paramtrig.changeMargin(param,_step)
					if(_step != _nextstate&&(_step<(paramtrig.field(param)) || _step > (param.li.length*paramtrig.field(param)))){
						 var fun = function(){slide.call(this,_step,_x2,_x1,_nextstate,_speed)}
						 fun();
						//setTimeout(fun,_speed);
					}
				}
				if(this.setCapture)
					this.releaseCapture();
			},false);
			var paramtrig = {
				getClient : function(ev,param){  return (param.multilevel == 1) ? ev.clientY : ev.clientX} ,
				getMargin : function(param){ return (param.multilevel == 1) ? param.elevator : param.margin},
				setMargin : function(param,margin){ return (param.multilevel == 1) ? param.elevator = margin : param.margin = margin},
				field : function(param){ return (param.multilevel == 1) ? param.liheight : param.liwidth},
				changeMargin : function(param,num){ (param.multilevel == 1) ?  param.ul.style.marginTop = num + 'px' : param.ul.style.marginLeft = num + 'px'}
			}
		}
	}
})(window)
// 自动运行动画
/**
 * activeClass  一组动画的相同id 前缀 （or 也是class名称）
 *
**/
keynote.addActive = function(activeClass,param){
	ele = param.li[param.currentLi].getElementsByClassName(activeClass);
	if(ele[0]){
		for (var i = 0; i < ele.length; i++) {
			var str = ele[i].style.cssText;
			ele[i].style.webkitAnimationName =  ele[i].id ;
		}
	}
}
keynote.prerefersh = function(param){
	param.li[param.preLi].removeChild(param.li[param.preLi].children[0]);
	param.li[param.preLi].innerHTML = param.preLicontent;
	param.preLicontent =  param.li[param.currentLi].innerHTML;
}
keynote.goHome = function(param,nextid,callBack){
	//keynote.prerefersh(param);
	if(param.currentLi == param.li.length-1){
		//bacTofirst('first','keynote',param);
		keynote.changeUl(param.ul,nextid);
		param.margin = param.currentLi = 0;
        param.preLicontent =  param.li[0].innerHTML;
        if(callBack){
        	callBack.apply(this,arguments);
    	}
	}
	//console.log(param.preLicontent)

}
keynote.changeUl = function(preid,nextid){
	(typeof(preid) == 'string')&&(preid = document.getElementById(preid));
	(typeof(nextid) == 'string')&&(nextid = document.getElementById(nextid));
	preid.style.opacity = '0'
	preid.style.visibility = 'hidden';
	preid.style.display = 'none';
	preid.style.marginLeft = '0';
	nextid.style.opacity = '1';
	nextid.style.visibility = 'visible';
	nextid.style.display='block';
	nextid.style.marginLeft = '0';
}

keynote.gotoPage = function(index,param,paramNav){
	param.ul.style.webkitTransition = 'none';
	param.margin = index*(-param.liwidth);
	param.ul.style.marginLeft = param.margin+'px';
	param.preLi = param.currentLi;
	setTimeout(function(){
		param.ul.style.webkitTransition = '';
	},20)
	param.callBack(param);
	if(paramNav){
		if(Array.isArray(paramNav)){
			paramNav.forEach(
				function(ele){
					ele.currentLi = index;
				 	keynote.nav.keyLiHover(param,ele);
				}
			)
		}else{
			paramNav.currentLi = index;
			keynote.nav.keyLiHover(param,paramNav);
		}
	}
}

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
