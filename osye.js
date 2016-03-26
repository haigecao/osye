

// 创建一个js的基础类库osye
/*


函数作用:,
	参数:0个或者1个, 
			0个: 	,
  			1个: 	
  返回值: Osye对象.



想法,需要解决的问题;

	(1)做一个判断函数,可以传入变量,判断出变量可能的类型,并打印出变量内容.
	不论变量是jason,json,事件,数组,函数,还是nan或者undefined.等...包括DOM对象
	并反回为 $og对象.
	对象构成为, $og = {
						0 : elemen1,
						,,,
						this.length: 变量的参数.
					}

	(2)节点的操作,增删改查.还有克隆.
	(3)对elements数组做各种操作,转化为各种格式.

	(4)这里声明的对象,产生的新对象,都没有释放,需要找到释放不用变量的一个方式.

	(5)需要找建造一个堆栈的方式,来解决内存释放的问题.

	(6) 希望支持划线,支持画原型,方框,选择现行,选择颜色,粗细等参数.

	(7) 写一个全局的函数,初始化$sy.prototype.elements变量.

*/


/******************************************************//******************************************************/
//==================================Osye的构造函数===========================================//
/******************************************************
保证每次都调用$sy的时候,都有一个新的实例对象,返回一个对象,使其他this的属性定义无效
_this_属性,是处理事件函数中,给osye中传入节点对象.$sy(this)

函数作用:Osye基础对象,每一次$sy()生成一个新的Osye对象,
	参数:0个或者1个(元素对象), 
			0个: 	创建一个Osye的空对象,
  			1个: 	传入节点元素,返回一个Osye的对象.
  返回值: Osye对象.

******************************************************/
var $sy = function () {
	return new Osye(arguments[0]);
};
/*********************	$sy构造函数结束******************************************************************************************************************/	








//Osye 定义函数内部的变量,封装对DOM的操作,特效,等等.
/*****************************************************************************/
function Osye() {


/*****************************************************************************/
//默认就是没有参数传入,这样构造属性并初始化.
this.elements = [];		//保存选择的ID或标签所对应的元素
this.length = 0;		//选择器所选择的元素长度,出事化为0


/**************************************
函数作用:通过传入的ID参数,进行DOM的筛选.
	参数:1个,类型:字符串. 选择ID的值.
  返回值: Osye对象.
***************************************/
Osye.prototype.gid = function (id) {
	if (!isString (id)) {		//判断id是否是字符串,如果不是就返回错误
		alert("gid function : ID equal [ " + id + ' ] is not String');
		return null;
	}
	var elem = document.getElementById(id);

	if (elem != null)	//所有测试浏览器符合找不到返回null
	{
		this.elements.push(elem);
		this.length = 1;
		return this;
	}
	
	alert("gid function :  element ID equal [ " + id + ' ] is not exit');
	return null;
};
/*****************************************************************************/

/**************************************
函数作用:通过传入的标签参数,进行DOM的筛选.
	参数:必须是1个,类型:字符串. 选择标签的值.例如div,p
  返回值: Osye对象.
***************************************/
Osye.prototype.gtag = function (tag) {
	if (!isString (tag)) {		//判断id是否是字符串,如果不是就返回错误
		alert("gtag function : target equal [ " + tag + ' ] is not String');
		return null;
	}
	if (arguments.length != 1) {
		alert('gtag function : must be arguments is only one, but arguments.length = ' + arguments.length);
		return null;
	}

	var tags = document.getElementsByTagName(tag);
	this.length = tags.length;

	if (this.length <= 0)
	{
		alert("gtag function : dom target equal [ " + tag + " ] is not exit");
		return null;
	}
	else
	{
		for (var i = 0; i < this.length; i++)
		{
			this.elements.push(tags[i]);
		}
	}
	return this;
}
/*****************************************************************************/

/**************************************
函数作用:通过传入的class参数,进行DOM的筛选.
	参数:1个或2个,类型:字符串. 
			1个: 选择class的值.
			2个: class 和 ID,第二个参数ID是用来限制class的区域的选择器.
  返回值: Osye对象.
***************************************/

Osye.prototype.gclass = function (className, id) {

	if (!isString (className)) {		//判断id是否是字符串,如果不是就返回错误
		alert("gclass function : className equal [ " + className + ' ] is not String');
		return null;
	}

	var cls = null;
	var cid = null;

	if (arguments.length == 1) {		//参数为1的时候,获取指定classname的标签
		cid = '';
		cls = document.getElementsByTagName("*");
		// alert('cls.length' + cls.length);		
	}
	else if (arguments.length == 2) {	//参数为2的时候,获取指定ID下面,拥有classname的标签.
		if (!isString (id)) {			//判断id是否是字符串,如果不是就返回错误
			alert("gclass function : id equal [ " + id + ' ] is not String');
			return null;
		}

		var idElem = document.getElementById(id);
		if (idElem == null) {				//如果id所对应的标签不存在
			alert('gclass function : id name equal ["' + id + '"] ' + ' is not exit');
			return null;
		}

		cid = " Id is exit and id =  " + id + " ";		//id所对应的元素存在
		cls = idElem.getElementsByTagName("*");			//返回id对象所对应的所有元素.
	}

	for (var i = 0; i < cls.length; i++) {			//遍历选择到的标签,
		if (cls[i].className == className)
		{	
			this.elements.push(cls[i]);				//将类名符合要求的元素,压入数组
			this.length += 1;						//获取拥有类名为className的个数
		}
	}

	if (this.length == 0) {			//如果没有找到类标签,但是id存在.证明ID中没有class标签.
		alert("gclass function : " + cid + ' |  classname equal ["' + className + '"]  is not exit ' );
		return null;
	}

	return this;
};
/*****************************************************************************/

/**************************************
函数作用:通过传入的数字参数,对Osye对象进行DOM的筛选.
	参数:1个: 类型 数字. 索引选择器选择出来的对象,在this.elements[]数组中查询.
  返回值: DOM对象.
***************************************/

Osye.prototype.eq = function (num) {
	if (arguments.length != 1) {
		alert('eq function : arguments.length is not 1, and arguments.length = ' + arguments.length);
		return null;
	}
	if (!isNumbers(num)) {
		alert("index function : " + num + ' is not a number!');
	}
	else if (num < 0 || num >= this.length) {
		alert("index function : " + num + ' is over dom length [ ' + this.length + ' ] border!');
	}
	var element = this.elements[num];
	// this.elements = [];
	// this.elements.push(element);

	return element;
}


/**************************************
函数作用:返回选择器选择的第一个DOM节点
	参数:0个
  返回值: DOM对象.
***************************************/

Osye.prototype.first = function () {
	if (arguments.length != 0) {
		alert('first function : arguments.length is not 0, and arguments.length = ' + arguments.length);
		return null;
	}

	if (this.length == 0) {
		console.log('do not choice every one, because of no element can choice, this.length = 0');
		return null;
	}

	var element = this.elements[0];		//返回第一个元素
	return element;
}

/**************************************
函数作用:返回选择器选择的最后一个DOM节点
	参数:0个
  返回值: DOM对象.
***************************************/

Osye.prototype.last = function () {
	if (arguments.length != 0) {
		alert('last function : arguments.length is not 0, and arguments.length = ' + arguments.length);
		return null;
	}

	if (this.length <= 0) {
		console.log('do not choice every one, because of no element can choice, this.length = 0');
		return null;
	}

	var element = this.elements[this.length - 1];		//返回最后一个元素
	return element;
}



/*****************************************************************************/
// 					以后会添加find,next等选择器.
/*****************************************************************************/


/**************************************
函数作用:给选择器选择的元素添加class属性.
	参数:1个或多个, 类型:字符串. 
			1个: 添加class的值. 允许一次添加多个,比如 'a b c'.空格隔开
			多个:  添加多个.
  返回值: Osye对象.
***************************************/
Osye.prototype.addClass = function () {
	if (arguments.length == 0) {
		alert('addClass function : is wrong, arguments.length = 0');
		return this;
	}
	if (arguments.length == 1) {
		if (!isString (arguments[0])) {		//判断id是否是字符串,如果不是就返回错误
			alert("addClass function : arguments equal [ " + arguments[0] + ' ] is not String');
			return null;
		}
		for (var i = 0; i != this.length; i++) {
			if (!hasClass(this.elements[i], arguments[0]))		//判断元素的属性是否存在,如果存在返回字符串.不存在返回空.
			{
				//这里不做匹配,因为匹配除了减少字符串的长度,其他是没有意义的,如果用户写错了,那还是错.						
				this.elements[i].className += " " + arguments[0] + " ";		//添加,注意加入空格.
			}
		}

	}
	else if (arguments.length > 1)	//传入多个.
	{

		for (var k = 0; k != arguments.length; k++)
		{
			if (!isString (arguments[k])) {		//判断是否是字符串,如果不是就返回错误
				alert("addClass function : arguments equal [ " + arguments[k] + ' ] is not String');
				return null;
			}
			for (var i = 0; i != this.length; i++) {
				if (!hasClass(this.elements[i], arguments[k]))		//判断元素的属性是否存在,如果存在返回字符串.不存在返回空.
				{
					//这里不做匹配,因为匹配除了减少字符串的长度,其他是没有意义的,如果用户写错了,那还是错.						
					this.elements[i].className += " " + arguments[k] + " ";		//添加,注意加入空格.
				}
				
			}
		}
	}

	return this;
}
/*****************************************************************************/
/**************************************
函数作用:给选择器选择的元素删除class属性.
	参数:1个,类型字符串.
  返回值: Osye对象.
***************************************/

Osye.prototype.removeClass = function (className) {
	//判断标签内没有这个类属性
	//匹配的要求是:第一个是开头,没有左空格,结尾没有右空格,其他都是一前一后2个空格.如果有就删除
	if (arguments.length == 0)
	{
		alert('removeClass function : arguments.length = 0');
		return this;
	}
	if (arguments.length >= 1) {

		for (var k = 0; k != arguments.length; k++)
		{
			if (!isString (arguments[k])) {		//判断是否是字符串,如果不是就返回错误
				alert("addClass function : arguments equal [ " + arguments[k] + ' ] is not String');
				return null;
			}
			var parrent = '(\\s|^)' + arguments[k] + '(\\s|$)';
			parrent = new RegExp(parrent);
			for (var i = 0; i < this.length; i++) {
				if (!hasClass(this.elements[i], arguments[k]))	{		//在class类中查找是否存在,存在就删除
					this.elements[i].className = this.elements[i].className.replace(parrent, ' ');	//删除就是替换为空格
				}
			}
		}
	}

	return this;
}

/*****************************************************************************/
/**************************************
函数作用:操作osye对象中元素的css属性.
	参数:1个,2个类型字符串.
			1个: 获取该style.attr的属性值.
			2个: 设定dom的 style.attr = value.
  返回值: 		1个参数:返回获取的属性值.如果osye中有很多对象,这里css只返回第一个对象的值.
  				2个参数:返回Osye对象
***************************************/
Osye.prototype.css = function (attr, value) {
	if (arguments.length > 2)
	{
		alert("css function : arguments.length > 2, is wrong ! ");
		return this;
	}
	if (arguments.length == 0)
	{
		alert('css function : arguments.length = 0!');
		return this;
	}

	if (arguments.length == 1) {
		if (!isString (attr)) {		//判断是否是字符串,如果不是就返回错误
			alert("css function : arguments is not a string");
			return null;
		}
	}

	if (arguments.length == 2) {
		if (!isString (attr, value)) {		//判断是否是字符串,如果不是就返回错误
			alert("css function : arguments is not a string");
			return null;
		}
	}

	if (this.length == 0) {

		console.log('css function do\'t change eveyone, because of no element be selected int this.elements . ');
		return this;
	}

	for (var i = 0; i != this.length; i++)
	{

		//如果参数长度为1,	即css(attr),返回html.如果选择器选择多个,也只返回第一个.
		if (arguments.length == 1) {		
			if (!hasClass(this.elements[i], attr))		//判断元素的属性是否存在,如果存在返回字符串.不存在返回空.
			{
				return gStyle(this.elements[i], attr);		//返回查找的css属性
			}
			else {
				alert("css function : css = " + attr + "  is not exit.");
				return null;
			}
		}

		this.elements[i].style[attr] = value;			//参数2个,就是设置.
	}

	return this;
};

/*****************************************************************************/
/**************************************
函数作用:设定或者获取osye对象的html值..
	参数:0个, 1个,类型字符串.
			0个: 获取选定osye对象的html.但是对象的length必须为1.也就是只有一个元素.
			1个: 设定osye对象内的dom的html内容为传入的参数.
  返回值: 		0个: 元素的值.字符串.
  				1个: osye对象
***************************************/
Osye.prototype.html = function (str) {
	//如果参数长度为0,即html(),返回html.如果选择器选择多个,也只返回第一个.
	if (arguments.length == 0) {				
		return this.elements[0].innerHTML;		//返回html内容,并且无法继续连缀了.
	}	

	if (arguments.length != 1) {				
		alert('css function : arguments.length must be equal 0 or 1, but arguments.length = ' + arguments.length);
		return this  		//返回html内容,并且无法继续连缀了.
	}	

	if (!isString (str)) {		//判断是否是字符串,如果不是就返回错误
		alert("css function : arguments is not a string");
		return null;
	}

	if (this.length == 0) {

		console.log('html function do\'t change eveyone, because of no element be selected int this.elements . ');
		return this;
	}

	for (var i = 0; i < this.length; i++)
	{
		this.elements[i].innerHTML = str;
	}
	return this;
};

/*****************************************************************************/
/**************************************
函数作用:将osye内隐藏的元素显示
	参数:0个
  返回值:osye对象
***************************************/
Osye.prototype.show = function () {

	if (this.length == 0) {

		console.log('show function do\'t change eveyone, because of no element be selected int this.elements . ');
		return this;
	}

	for (var i = 0; i < this.length; i++)
	{
		this.elements[i].style.display = 'block';
	}

	return this;
}

/*****************************************************************************/
/**************************************
函数作用:将osye内显示的元素隐藏
	参数:0个
  返回值:osye对象
***************************************/
Osye.prototype.hide = function () {
	if (this.length == 0) {

		console.log('hide function do\'t change eveyone, because of no element be selected int this.elements . ');
		return this;
	}

	for (var i = 0; i < this.length; i++)
	{
		this.elements[i].style.display = 'none';
	}

	return this;
}

//--------------------------------------------------------------------------------------------------------

/**************************************
函数作用: 模仿jQuery添加事件绑定on()函数.进行事件绑定.
	由于这是$sy对象内的原型函数,所以,绑定事件之前,一定会调用选择器.
所有绑定事件,都是绑定在选择器DOM中的.

//js很神奇,可以这样给对象绑定事件.并且执行.
//windows['onload'] = function () { alert(); }	

	参数: 	参数1: 事件名称, 比如click, hover等.字符串形式传入
			参数2: 要绑定的函数. fun() {}, 或者函数名称.
					在fun函数中,可以使用this和e,this是dom元素对象,e是绑定的事件对象.通过call的对象冒充实现的.很酷.
			[参数3]: 可选,参数2中函数传入的数据,data.

	实现方法: 为绑定事件的标签dom.定义一个events对象.保存从 [事件-->函数-->数据] 的对应集合
				events{} --->	
							创建events[  on + type]  事件数组.
							创建events[type + data]  数据数组.
				这两个数组一一对应.一个保存了事件的对应函数,另一个保存了传入的变量,没有传入变量的,就存入null. 

调用方式举例:
		$sy().gid('wj').on('click', function (event, data) {
			alert(2222);
			alert('data' + data);
		}, 234);

		$sy().gid('wj').on('click', function (event) {
			alert(3333);
		});

  返回值: 	osye对象,支持连缀操作.并且取消默认行为.比如标签<a>,点击会跳转.
***************************************/
Osye.prototype.on = function (evType, func, data) {
	if (arguments.length < 2) {
		alert('on function : arguments.length is not enough!');
		return null;
	}
	if (arguments.length > 3) {
		alert('on function : arguments.length is wrong, because of  more than 3.');
		return null;
	}
	if (!isString (evType)) {		//判断是否是字符串,如果不是就返回错误
		alert("on function : evType is not a string");
		return null;
	}
	if (!isFunctions(func)) {
		alert(func + 'is not a function, do\'t attach with $syaddLoadEvent');
		return null;
	}

	if (this.length == 0) {

		console.log('hide function do\'t change eveyone, because of no element be selected int this.elements . ');
		return this;
	}

	for (var i = 0; i != this.length; i++)
	{
		//使用内部函数bind,	将事件, 函数和变量绑定到一起.
		Osye.prototype.bind(this.elements[i], evType, arguments.length, func, data);
	}
	return this;
};


/**************************************
函数作用:绑定函数.内部使用			
	参数: lableDom, 		evType, 		arglength, 				func, 			data
		  this.element[i]	事件类型type	是2个参数还是3个参数	绑定的函数		函数传入的数据.
					
	为evType类型的事件,绑定func的函数,如果有参数,传入data数据.并有arglength=2 || 3来半段参数个数.

返回值:无
***************************************/

Osye.prototype.bind = function (lableDom, evType, arglength, func, data) {

		var typedata = evType + "data";
		if (lableDom.events == undefined)		//该dom标签的事件集合没有创建过.
		{
		//第一绑定事件
			lableDom.events = {};				//创建该dom标签的事件函数集合.
		//第一次定义type事件集合
			lableDom.events[evType] = [];		//创建click事件的函数数组队列. (因为顺序绑定和执行).	
		//将函数压入事件所对应的数组
			lableDom.events[evType].push(func);	//把这次创建的事件处理函数,进入数组中.

		//定义该事件集合函数所对应的数据的集合.
			lableDom.events[typedata] = [];
		}

		else 	//dom标签的事件集合存在.就意味着,并不是第一次绑定该标签的事件
		{
			// alert('2 --- add ');
			//首先判断,事件集合events中,是否有click事件被创建过
			if (lableDom.events[evType] == undefined) {	
				lableDom.events[evType] = [];	//如果没有被定义过,就在events事件集合中定义事件类型 evType
				lableDom.events[typedata] = [];
			}

			lableDom.events[evType].push(func);
		}

		if (arglength == 3) {	//如果参数是3个,以为最后一个是数据.
			lableDom.events[typedata].push(data);
		}
		else 	//没有数据,为了保持数组同步, 将空数据传入数组.
		{
			lableDom.events[typedata].push(null);
		}

		lableDom['on' + evType] = function(event) 
		{	
			if (event == undefined) {
				event = window.event;
				// alert('window.event ' + window.event);
			}

			var evt = event || fixEvent(window.event);	//适配event并且取消默认行为
			var oldEventfuns = this.events[evt.type];		// oldEventfuns 是该对象事件过去所绑定的所有的函数.
			for (var pro in oldEventfuns) {						//遍历所绑定的函数,进行执行
					var dataval = lableDom.events[typedata][pro];
					// alert('dataval ' + dataval);
					if (dataval != null) {
						//对象冒充的方法,让this(绑定的标签对象),执行存储的函数.databal是函数传入的参数
						oldEventfuns[pro].call(this, evt, dataval);		
					}
					else
					{
						oldEventfuns[pro].call(this, evt);		//对象冒充的方法,让this(绑定的标签对象),执行存储的函数.
					}
			}
		};
};

//获取IE 的event，兼容W3C的调用
Osye.prototype.on.fixEvent = function (event) {
	event.preventDefault = Osye.prototype.on.fixEvent.preventDefault;
	event.stopPropagation = Osye.prototype.on.fixEvent.stopPropagation;
	return event;
};

//兼容IE 和W3C 阻止默认行为
Osye.prototype.on.fixEvent.preventDefault = function () {
	this.returnValue = false;
};

//兼容IE 和W3C 取消冒泡
Osye.prototype.on.fixEvent.stopPropagation = function () {
	this.cancelBubble = true;
};


/**************************************
函数作用: 删除绑定事件
	参数: 	0个: 删除此标签的所有绑定事件
			1个: 绑定事件类型, 例如click, 删除此标签, 这一类型的所有函数.
			2个: (1)绑定的事件;(2)函数名称,或者索引个数.(支持倒数索引,比如 -1,代表最后一个.)						

返回值:osye对象
***************************************/
Osye.prototype.off = function () 
{
	if (this.length == 0) {

		console.log('off function do\'t change eveyone, because of no element be selected int this.elements . ');
		return this;
	}

//没有参数传入.删除所有选择器中事件和事件所对应的函数.
	if (arguments.length == 0) 
	{
		for (var i = 0; i != this.length; i++) {	//变量选择器中的元素
			if (this.elements[i].events != undefined) {
				this.elements[i].events = {};		//直接清空.
			}
		}
	}
//1个参数传入.删除该参数传入类型的事件.
	else if (arguments.length == 1)
	{
		if (!isString(arguments[0])) {
			alert('off function is wrong, arguments must be string.');
			return this;
		}
		for (var i = 0; i != this.length; i++) {
			if (this.elements[i].events != undefined) {
				if (this.elements[i].events[arguments[0]] != undefined)
				{
					alert();
					this.elements[i].events[arguments[0]] = [];				//删除
					this.elements[i].events[arguments[0] + "data"] = [];
				}	
			}
		}
	}
//2个参数传入.删除该参数传入类型的事件.
	else if (arguments.length == 2)
	{
		if (!isString(arguments[0])) {
			alert('off function is wrong, arguments must be string.');
			return this;
		}

		if (typeof arguments[1] == 'function') 	//判断是否是函数.如果不是,提示错误.
		{	
		//删除指定事件中,指定的函数
			for (var i = 0; i != this.length; i++) 									//遍历选择的标签,进行事件处理
			{
				if (this.elements[i].events != undefined) {							//判断events事件集合是否定义
					if (this.elements[i].events[arguments[0]] != undefined)			//判断该事件是否存在于事件集合中
					{
						//事件存在于事件集合中,赋值给中间变量.
						var  lableEvent = this.elements[i].events[arguments[0]];
						for (var pro in lableEvent) { 								//遍历事件函数集合.

							if (lableEvent[pro] == arguments[1]) {									//判断标签事件内的函数是否存在.如果存在
								lableEvent.splice(pro, 1);											//删除数组中pro位置的1元素.
								this.elements[i].events[arguments[0] + "data"].splice(pro, 1);		//函数对应元素位置也要删除.
							}
						}
					}	
				}
			}
		}
		else if (typeof arguments[1] == 'number') 	//判断是否是数字.如果不是,提示错误.
		{	
		// 删除指定事件中,指定的索引,索引可以小于0.
			for (var i = 0; i != this.length; i++) 									//遍历选择的标签,进行事件处理
			{
				if (this.elements[i].events != undefined) 							//判断events事件集合是否定义
				{							
					if (this.elements[i].events[arguments[0]] != undefined)			//判断该事件是否存在于事件集合中
					{
						//事件存在于事件集合中,赋值给中间变量.
						var  lableEvent = this.elements[i].events[arguments[0]];
					
						var label = 0;
						if (arguments[1] < 0) {							//如果索引小于0,从后向前遍历
							label = lableEvent.length + arguments[1];	//调整顺序,用负数加数组长度.
							if (label < 0) {							//传入的负数太小,超越了事件长度.
								alert('off function : index is wrong, the events length is ' + lableEvent.length);
								return this;
							}
							else 	//正确.符合从0 到 length-1的长度.
							{
								lableEvent.splice(label, 1);											//删除数组中pro位置的1元素.
								this.elements[i].events[arguments[0] + "data"].splice(label, 1);		//函数对应元素位置也要删除.
							}
						}
						else 	//大于0 .正想索引
						{
							var label = arguments[1];
							if (label >= lableEvent.length) {		//传入的索引正数过大,超越了事件长度.也是错误
								alert('off function : index is wrong, the events length is ' + lableEvent.length);
								return this;
							}
							else 	//正确.   从0 到 length-1.是正确的索引.
							{
								lableEvent.splice(label, 1);											//删除数组中pro位置的1元素.
								this.elements[i].events[arguments[0] + "data"].splice(label, 1);		//函数对应元素位置也要删除.
							}	
						}
					}	
				}
			}
		}

		else	//既不是函数,也不是数字,就报错.
		{
			alert('arguments[1] is not function and arguments[1] is not number. is wrong!');
			return this;
		}			
	}

		return this;
};


//---------------------------------------------------------------------------------------------
/*****************************************************************************/
/**************************************
函数作用:点击事件.			执行顺序按照绑定顺序.
	参数:1个函数
					
/****	注意: 这里绑定的点击事件传入的是函数.function () { }
/********		函数有一个默认的参数是event,是这个触发事件.function(event) {}. 
/********		在绑定函数内,this指针,指向的是这个dom标签.
		click的绑定,默认是不屏蔽冒泡.
	用原生的js,重写该元素的click事件,那么之前的绑定,就删除了.可以继续使用click或者on绑定新的函数.

返回值:osye对象
***************************************/
Osye.prototype.click = function (fun) {

	if (this.length == 0) {

		console.log('click function do\'t change eveyone, because of no element be selected int this.elements . ');
		return this;
	}

	if (arguments.length != 1) {
		alert('click function : arguments.length is wrong! arguments.length = ' + arguments.length);
		return this;
	}
	if (!isFunctions(fun)) {
		alert('click function :' + fun + " is not function, and do't attach in click! in " + this.elements[0].tagName);
		return ;
	}

	for (var i = 0; i != this.length; i++)
	{
		var data = null;
		Osye.prototype.bind(this.elements[i], 'click', arguments.length, fun, data);
	}
	return this;
};

/*****************************************************************************/
/**************************************
函数作用:hover函数是鼠标移出移出函数.
	参数:传入2个函数;
		osye对象内的元素触发事件,鼠标移入是第一个,移除发生第二个.
  返回值:osye对象
***************************************/
Osye.prototype.hover = function (over, out) {
	if (!isFunctions(over, out)) {
		alert( 'hover event : ' + over + " \n  or \n " + out + " \n is not a function, and do't attach in hover event!");
		return ;
	}

	if (this.length == 0) {

		console.log('hover function do\'t change eveyone, because of no element be selected int this.elements . ');
		return this;
	}

	for (var i = 0; i != this.length; i++)
	{
		Osye.prototype.bind(this.elements[i], 'mouseover', 2, over);	//绑定事件mouseover
		Osye.prototype.bind(this.elements[i], 'mouseout',  2, out);		//绑定mouseout
	}

	return this;
}

/*****************************************************************************/
/**************************************
函数作用:浏览器尺寸调整的时候发生的触发事件.
	参数:1个,或多个函数;
		执行顺序按照参数传入的顺序.
  返回值:osye对象
***************************************/
Osye.prototype.resize = function () {
	if (this.length == 0) {

		console.log('resize function do\'t change eveyone, because of no element be selected int this.elements . ');
		return this;
	}

	if (arguments.length == 0)
	{
		alert("resize event arguments.length == 0 is wrong, because of arguments.length > = 1");
		return this;		//就当什么都没发生
	}

	for (var i = 0; i != arguments.length; i++)
	{
		if (!isFunctions(arguments[i])) {
			alert(arguments[i] + "  is not a function, and do't attach in hover event!");
			return this;
		}
		// $syaddResizeEvent(arguments[i]);	//添加窗口事件

		Osye.prototype.bind(window,'resize', 2, arguments[i]);
	}

	return this;
}

/*****************************************************************************/
/**************************************
函数作用:浏览器dom装载完成,触发事件/
	参数:1个,多个函数.
		执行顺序,按参数传递顺序.
  返回值:osye对象
***************************************/
Osye.prototype.load = function () {

	if (this.length == 0) {

		console.log('resize function do\'t change eveyone, because of no element be selected int this.elements . ');
		return this;
	}

	if (arguments.length == 0)
	{
		alert("load event arguments.length == 0 is wrong, because of arguments.length > = 1");
		return this;		//就当什么都没发生
	}

	for (var i = 0; i != arguments.length; i++)
	{
		if (!isFunctions(arguments[i])) {
			alert(arguments[i] + "  is not a function, and do't attach in hover event!");
			return this;
		}
		$syaddLoadEvent(arguments[i]);	//添加窗口事件
	}

	return this;
}

/*****************************************************************************/
/**************************************
函数作用:浏览器锁屏操作.
	参数:0个
  返回值:osye对象
注意:这里有一个$sy对象的原型参数.就是锁屏时候,锁屏的层高.默认是99.
如果想更改锁屏层高,设定$sy.prototype.lockzIndex = value.即可.
***************************************/
Osye.prototype.lock = function () {
	document.documentElement.style.overflow = 'hidden'; 			//禁止滚动条,防止拖拽出空白区域
	//防止IE的触发事件.可以在有滚动条时,继续拖拽.让滚动条为0,禁止拖动.
	window.onscroll = function () {			//这是个坑,以后需要解决.
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	};
				
	$sy.prototype.isScreenLock = true;								//屏幕锁定.
	$sy.prototype.odjScreenLock = $sysingleLocker();				//全局函数.锁屏



	return this;
}

/*****************************************************************************/
/**************************************
函数作用:浏览器锁屏的解锁操作.
	参数:0个
  返回值:osye对象
***************************************/
Osye.prototype.unlock = function () {

	document.documentElement.style.overflow = 'auto'; 		//还原默认滚动条状态
	$sy.prototype.isScreenLock = false;						//屏幕锁定
	$sy.prototype.odjScreenLock.destroy();					//调用销毁函数,销毁锁屏时产生的标签
	$sy.prototype.odjScreenLock = null;						//注释为null,帮助浏览器回收.
	
	window.onscroll = null;		//将滚动条事件去除.这里有个bug.以后解决.
	return this;
}


/*****************************************************************************/
/**************************************
函数作用: 添加link 或style 中的CSS 规则
	很少使用,这里不介绍了
  返回值:osye对象
***************************************/
Osye.prototype.addRule = function (num, selectorText, cssText, position) {
	var sheet = document.styleSheets[num];

	if (typeof sheet.insertRule != 'undefined') {	//W3C
		sheet.insertRule(selectorText + "{" + cssText + "}", position);
	} 
	else if (typeof sheet.addRule != 'undefined') {	//IE
		sheet.addRule(selectorText, cssText, position);
	}

	return this;
};

/**************************************
函数作用: 移除link 或style 中的CSS 规则
	很少使用,这里不介绍了
  返回值:osye对象
***************************************/
Osye.prototype.removeRule = function (num, index) {
	var sheet = document.styleSheets[num];

	if (typeof sheet.deleteRule != 'undefined') {	//W3C
		sheet.deleteRule(index);
	}
	else if (typeof sheet.removeRule) {	//IE
		sheet.removeRule(index);
	}
	
	return this;
};


/************************************将选择元素屏幕居中***************************************/
/***************************************************************************

可以将隐藏的元素标签居中. 用途,点击登录按钮,弹出登录框,这种.
参数:无
		函数使用,首先使用选择器将dom元素选择,但是这里这里只接受选择器中唯一一个元素,
	如果,dom有很多标签元素,实际上是可以实现的,但是剧中显示之后,容易重叠,影响体验.因此,这里就唯一元素.
	
			居中显示的默认z-index = 1000000; 原则上面,应该很大.
		如果需要更改,$sy.prototype.screenLableCenterZindex = value就可以了;

	这里未来应该给一个$sy的初始化函数.作为全局设置.

并且这里默认,即使是调整浏览器大小,被居中的标签,依旧会在调整过后,继续居中,

***************************************************************************/
 Osye.prototype.screenLableCenter = function() {

	if (this.length != 1) {
		alert('selector must be choose one dom label. but now have ' + this.length);
		return this;
	}
	var eid = this.elements[0];		//将选择器中第一个元素,复制给eid.

	//返回一个osyePoint的对象,来表示显示屏幕的宽度(.x)和高度(.y).
	var syPointScreenSize = $sygetBrowserShowSize();		
	// alert(syPointScreenSize.xLeft + " " + syPointScreenSize.yRight);

	eid.style.display = 'block';		//display为隐藏状态的时候,无法获取标签的大小
	var eidWidth = eid.offsetWidth;		//获取标签的宽度和高度
	var eidHeight = eid.offsetHeight;

	var left = (syPointScreenSize.xLeft - eidWidth) / 2;
	var top = (syPointScreenSize.yRight - eidHeight) / 2;
	if (left < 0 )
		left = 0;
	if (top < 0)
		top = 0;

	eid.style.position = 'absolute';	//先将position设置为绝对位置
	eid.style.left = left + 'px';
	eid.style.top = top + 'px';
	eid.style.display = 'block';		//如果标签隐藏,就显示出来.
	eid.style.zIndex = $sy.prototype.screenLableCenterZindex;
	
	$syaddResizeEvent(function () {
		if (eid.style.display == 'block')
		{
			var syPointScreenSize = $sygetBrowserShowSize();		
			eid.style.display = 'block';		//display为隐藏状态的时候,无法获取标签的大小
			var eidWidth = eid.offsetWidth;		//获取标签的宽度和高度
			var eidHeight = eid.offsetHeight;

			var left = (syPointScreenSize.xLeft - eidWidth) / 2;
			var top = (syPointScreenSize.yRight - eidHeight) / 2;
		
			if (left < 0 )
				left = 0;
			if (top < 0)
				top = 0;

			eid.style.position = 'absolute';	//先将position设置为绝对位置
			eid.style.left = left + 'px';
			eid.style.top = top + 'px';
			eid.style.display = 'block';
		}	
	});

	return this;
}


/*************************************拖拽函数****************************************/
/**************************************
函数作用:浏览器拖拽的操作,只要是选定的元素都可以.
	参数:1个, 选择元素内的Id,或者标签名称,比如P.H2,作为拖动的区域.

	因为如果选择器里选出的是一个登录框,肯定有填入数据的地方,如果都选择为拖动区域,
就无法在输入框中选择内容了.

	只要是被osye选择器,选择的元素标签,使用这个函数,都可以被拖拽.
如果有选择器中有多个元素被选中,实现是从下向上操作
	(1)获取元素相对屏幕的位置,
	(2)将position属性设定为绝对定位.
	(3)将相对屏幕的位置,重新赋值给元素.
因为,如果从上向下进行变量,会改变文档的位置.

当然这个只能一定程度上缓解,除非先获取dom所有的节点,进行位置保存,
然后在更改那些不需要绝对定位的元素.这里没有选择实现.
  返回值:osye对象
*******************************************************************************/
 Osye.prototype.drag = function (){

	if (this.length <= 0) {
		alert('do\'t choice any one lable.');
		return this;
	}			
		
	var lable = null;
	if (arguments.length == 1) {
		lable = arguments[0];
	}

	if (this.length == 1)			//如果只选择了一个标签元素.
	{
		var left = this.elements[0].offsetLeft;
		var top  = this.elements[0].offsetTop;

		this.elements[0].style.position = 'absolute';		//强制设定绝对定位,这样所有标签都可以拖拽.
		this.elements[0].style.left     = left + "px";		//从新定位
		this.elements[0].style.top      = top  + "px";

	}
	
	else if (this.length > 1)		//多个标签,从后选择
	{
		for (var i = this.length - 1; i != -1; i--) {
			var left = this.elements[i].offsetLeft;
			var top  = this.elements[i].offsetTop;
			// alert(left + " " + top);

			this.elements[i].style.position = 'absolute';		//强制设定绝对定位,这样所有标签都可以拖拽.
			this.elements[i].style.left     = left + "px";		//从新定位
			this.elements[i].style.top      = top  + "px";
		}
	}
	
	for (var i = 0; i != this.length; i++) 
	{
		
		//为了支持标签的操作,让所有的元素都设定为绝对位置

		//通过bind,将事件,函数和元素标签,绑定到一起,当元素添加事件的时候,每个元素,各自维护自身的events事件函数集合的对象,
		Osye.prototype.bind(this.elements[i], 'mousedown', 2, function(evt) 
		{
			var _this = this;	//this代表外部的标签,
			var ev    = evt || window.event;
			var tag   = evt['target'] || evt['srcElement']; 
			if (trim(this.innerHTML).length == 0)	//标签内,没有任何东西
			stopDefaultBeavior(ev);
			var difX  = ev.clientX - _this.offsetLeft;
			var difY  = ev.clientY - _this.offsetTop;

			//如果传入了标签名或者标签的ID,这个标签就是用来移动可拖拽区域的标签.
			//因为如果可拖拽区域的所有标签都可以移动可拖拽区域,那就无法选定元素内容了.
			//这样.指定拖拽区域,来移动标签,可以让那些输入区域,进行选定的操作.

			if (lable != null) 
			{	
			//这里将标签转换为大写进行判断.
				if (tag.tagName == lable.toUpperCase() || tag.getAttribute('id') == lable) 
				{

					document.onmousemove = function(evt) {
						var ev = evt || window.event;
						var left = ev.clientX - difX;
						var top = ev.clientY - difY;
						var browserSize = $sygetBrowserShowSize();		//获取浏览器的尺寸,返回点.

						if (left < 0) {		//调整拖拽的物体位置,如果小于0 ,左面出去了
							left = 0;
						}
						if (left > browserSize.xLeft - _this.offsetWidth) {	//防止标签右侧,移出屏幕.
						//原则是:标签的宽度 + 标签左边距离屏幕的距离  < 屏幕距离.
							left = browserSize.xLeft - _this.offsetWidth;
						}
						if (top < 0) {		//调整拖拽的物体位置,如果小于0 ,上面出去了
							top = 0;
						}
						if (top > browserSize.yRight - _this.offsetHeight) {
							top = browserSize.yRight - _this.offsetHeight;
						}

						_this.style.left = left + "px";		//移动外部的标签
						_this.style.top  = top + "px";

						}
						document.onmouseup = function () 
						{
							document.onmousemove = null;		//this代表标签
							document.onmouseup   = null;
						}
					};
				}

				else if (lable == null)
				{
					document.onmousemove = function(evt) 
					{
						var ev = evt || window.event;
						var left = ev.clientX - difX;
						var top = ev.clientY - difY;
						var browserSize = $sygetBrowserShowSize();		//获取浏览器的尺寸,返回点.

						if (left < 0) {		//调整拖拽的物体位置,如果小于0 ,左面出去了
							left = 0;
						}
						if (left > browserSize.xLeft - _this.offsetWidth) {	//防止标签右侧,移出屏幕.
							//原则是:标签的宽度 + 标签左边距离屏幕的距离  < 屏幕距离.
							left = browserSize.xLeft - _this.offsetWidth;
						}
						if (top < 0) {		//调整拖拽的物体位置,如果小于0 ,上面出去了
							top = 0;
						}
						if (top > browserSize.yRight - _this.offsetHeight) {
							top = browserSize.yRight - _this.offsetHeight;
						}

						_this.style.left = left + "px";		//移动外部的标签
						_this.style.top  = top + "px";

					}
					document.onmouseup = function () 
					{
						document.onmousemove = null;		//this代表标签
						document.onmouseup   = null;
					}
				} 		
			}
		);
		
	}

	
	return this;

}



/*=============================================================================================*/
//封装插件:为以后的服务扩展,模仿jquery的功能,自我实现.
//插件接口
//参数1:函数的名称,参数2:传入的函数.
//使用方法: $sy().exdtend('funname', function() {});
////////////////////////////////////////////////////////
/*=============================================================================================*/

Osye.prototype.extend = function (funName, func) {
	if (!isString(funName) || !isFunctions(func)) {
		alert('extend function is wrong! arguments one must be string, two is function!');
		return null;
	}
	Osye.prototype[funName] = func;		//赋值

	return this;
}

/**************************************
函数作用: ready 在dom加载完就执行,不用等到网页全部加载结束后执行
	参数:执行的函数,一个函数
  返回值:osye对象
**************************************/
Osye.prototype.ready = function() {

	if (arguments.length != 1) {
		alert('ready function is wrong, because of arguments length != 1');
		return null;
	}

	domReadyLoad(arguments[0]);		//调用函数,实现当文档加载完成就执行函数,而不是网页加载完成.

	return this;
} 

/**************************************动作函数.animate**************************************/
/**************************************
函数作用: animate 很酷的一个函数,思考过后,决定要尝试着写一下.
	用了一下JQ的animate,是同步执行.但感觉应该要加上一个顺序执行的这样一个功能.

参数: 参数1:[必填] 是一个对象,类似, {left:'20', top : '20', step:20}
						设定数字可以,默认会获取dom的单位.
						通过这个参数,来决定选择的DOM最终所体现的一个状态.

	  参数2:[可选] 执行时间,就是多久移动一个步长的时间,默认步长step=7.想要设定步长,再床土的对象中加入step:数子.
	  					有"slow","normal", or "fast",或者一个数字,比如1000,如果设定的数字,那么就是总时间.
								这里slow就60, normal:40, fast:20.

	  参数3:[可选] 顺序执行,还是同步执行.(默认是同步执行.就是所有运动一起执行.异步就是分开先后执行) 
	  					true同步,false异步顺序执行.


	  [注意:]分割,不能保证每个时间片都相等,可能最后一个或多或少,但保证总量不变.
	  (当然,也可以考虑另一种实现方式,就是轮空一段时间,保证整除.这里就不做这样的调整了.)



属性说明,这里强调的是属性可以用数字,或百分比表示的.比如color这种,就不做处理了.
可以改变的参数有:
	left, top, height, width, step. (这里不处理button,和right,其实没有意义.)

	step属性 : 步长.变化的速率.比如5px or 6em.但是这里只设定数字就可以了.
	step在同步执行中,只能保证第一个是按照这个步长在行走,其他的操作无法都按照这个步长.
	因为同步意味着同时到达终点.但是间距不同,所有速度不可能一样.

注意:同步支持opacity的渐进式,异步不支持opacity的渐进改变.
	因为,如果想设定opacity,可以调用成员函数opacity(num).即可.

****************************************************************************
同步执行的设计思想:昨天选择了一个困境,要维护定时器的个数和状态,最后失败.
简单的方式是,维护一个定时器,用循环来解决同步问题,
	第一次执行定时器的时候,让所有元素的,所有属性,都初始化到可以同步到达的状态.
		
		举个例子,A元素,left:100,B元素left300,速度为7. 终点left:50;
		这样,根据第一个元素,属于设定速度的原则,A要走8次,因为终点-起点=50, 50/7,并且向上取整.为8 
		B元素要走-150个元素,所以150/8 = 19px. 但是都是小数取整之后的,那么第一次调整
		A将位置移到  (8 - 1) * 7的位置上面.
		B将位置移动到  (8 - 1) * 19 的位置上面.这样,之后的执行,就可以同步到的终点了.

用的就是这个想法,最终解决了同步问题.用了一天的时间,感觉很酷.
****************************************************************************


  返回值:osye对象
**************************************/
//定义全局动作栈
var animateStack = {
	elements : [],		//元素.
	start    : [],		//起始点
	end      : [],		//终点
	unit     : []		//单位
};		
Osye.prototype.animate = function() {

	if (arguments.length < 1 || arguments.length > 4) {
		alert('animate function is wrong, because of arguments length is wrong.');
		return null;
	}

	if (typeof arguments[0] != 'object') {
		alert('animate function arguments[0] is wrong, it must be object.');
	}
	
	var obj = arguments[0];		//获取元素参数
	var time = 40;				//时间设定.
	var sync = true;			//是否同步执行,是
	var func = null;			//执行函数
	var step = 27;				//默认步长

	if (arguments.length > 1) 
	{
		for (var i = 1; i < arguments.length; i++) {
		
			if (typeof arguments[i] == 'number') {			//获取速度
				time = arguments[i];
			}
			else if (typeof arguments[i] == 'string') {		//获取速度
				var str = trim(arguments[i]);
				switch (str) {
					case 'normal': 
						time = 40;
						break;
					case 'slow':
						time = 60;
						break;
					case 'fast':
						time = 20;
						break;
				}
			}

			else if (typeof arguments[i] == 'boolean'){		//获取执行顺序,同步还是异步
				sync = arguments[i]
			}
		}
	}

	var domArgu = arguments[0];			//保存要将元素设定值.
	var setQueueList = [];				//需要设定的元素的属性列表
	var opacitySingal = null;			//透明度标记.

	for (var pro in domArgu) {			//这里用push和shift完成队列的操作.顺序压入队列.
		if ('step' == pro) {			//设定步长了.
			step = parseInt(domArgu['step']);		//重新设定步长.
			continue;								//不保存.
		}
		else if ('opacity' == pro) {			//如果设定了opacity透明度的值.
			opacitySingal = domArgu['opacity'];
			continue;
		}
		else
		{
			setQueueList.push(pro);			//将需要改变的属性压入队列.
		}
	}

 	var numStep = 0;					//需要执行几次.通过第一个有效属性获取.	
	var unit = {};						//保存要改变的属性的单位
	var speed = {};						//速度对象,保存所有标签的,对应属性的速度大小.
 	var elements = this.elements;		//赋值
 	var length = this.length;	
 	var opacityStep = [];				//定义透明度的

 	if  (sync == true) {				//同步运动,同时到达终点
 		for (var k = 0; k != length; k++) {		//获取所有选择元素的的初始化属性,和常规移动速度.
	 		var elem = elements[k];				//赋值,当前元素
	 		speed[k] = [];						//获取这个标签,下面所有属性的改变速度.第一个速度为step.后面的根据第一个设定.
	 		unit[k] = []
			for (var i = 0; i < setQueueList.length; i++) 
			{
				var start = parseInt(gStyle(elem, setQueueList[i]));
				unit[k].push(trim(gStyle(elem, setQueueList[i]).replace(/[\d]*/, '')));		//去掉所有的数字.然后在去掉多余的空格.获取单位.
				var end =  parseInt(domArgu[setQueueList[i]]);

				if (end > start) {
					var dis = end - start;				//开始和结束的距离.
					if (numStep == 0) {					//根据第一个有效参数,设定全局.
						numStep = Math.ceil(dis/step);	//向上取整,执行setInterval的次数.
						speed[k].push(step);	
					}
					else {
						speed[k].push(Math.floor(dis/numStep));	//保存速度
					}
				}
				else if (end < start) {
					var dis = end - start;						//开始和结束的距离.
					if (numStep == 0) {							//根据第一个有效参数,设定全局.
						numStep = Math.ceil(dis/step) * (-1);	//向下取整,执行setInterval的次数.因为是负数.在取反.
						speed[k].push(step);						//取反,因为要向反方向移动.
					}
					else {
						speed[k].push(Math.ceil(dis/numStep));	//设定速度,反向,速度小于0,向下取整.
					}
				}
			}
			
			if (opacitySingal != null) {
				if ((numStep - 1) != 0) {
					var numStepOpaccity = parseFloat(opacitySingal) * 100 - parseFloat(gStyle(elem, 'opacity') * 100);
					numStepOpaccity = numStepOpaccity * 1.0/(numStep - 1) ;
					
					if (numStepOpaccity > 0) {
						numStepOpaccity = Math.ceil(numStepOpaccity);
					}
					else {
						numStepOpaccity = Math.floor(numStepOpaccity);
					}
					opacityStep.push(numStepOpaccity);
					// alert(numStepOpaccity);
				}
				else
				{
					opacityStep.push(null);
				}
			}
		}

		var countNum = 0;
 		clearInterval(interval);
		var singalInit = false;			//初始化状态.
	 	var interval = setInterval(function () {

			if (singalInit == false) {	//调整元素的初始位置.这样就可以保证他们一起到达终点.
			
				for (var m = 0; m < length; m++) 
				{
					var elem = elements[m];				//赋值,当前元素
					for (var i = 0; i < speed[m].length; i++) 
					{
						var currentState = parseInt(elem.style[setQueueList[i]]);	//当前状态
						var endState = parseInt(domArgu[setQueueList[i]]);			//结束状态
						//这里汉藏玄机啊.重定位的时候,可能会有偏差.
						elem.style[setQueueList[i]] = (endState - (speed[m][i] * (numStep-1))) + unit[m][i];		//这样就可以一起达到终点了
					}
				}
				singalInit = true;
			}
			else 
			{
				for (var m = 0; m < length; m++) {
					var elem = elements[m];		//赋值,当前元素

					if (sync == true) {			//同步执行,
						
						if (opacityStep.length != 0) {
							if (opacityStep[m] != null) {
								if (opacityStep[m] > 0) {
									var inputStep = parseInt(parseFloat(gStyle(elem, 'opacity')) * 100) + opacityStep[m];
									inputStep =  inputStep / 100;
						 			if (inputStep < opacitySingal) {
						 				elem.style['opacity'] = inputStep;
						 				elem.style.filter = "alpha(opacity=" + inputStep * 100 + ")";
						 			}
						 			else {
						 				elem.style['opacity'] = opacitySingal;
						 				elem.style.filter = "alpha(opacity=" + opacitySingal * 100 + ")";
						 			}
								}
								else 
								{
									var inputStep = parseInt(parseFloat(gStyle(elem, 'opacity')) * 100) + opacityStep[m];
									inputStep =  inputStep / 100;
						 			if (inputStep > opacitySingal) {
						 				elem.style['opacity'] = inputStep;
						 				elem.style.filter = "alpha(opacity=" + inputStep * 100 + ")";

						 			}
						 			else {
						 				elem.style['opacity'] = opacitySingal;
						 				elem.style.filter = "alpha(opacity=" + opacitySingal * 100 + ")";

						 			}

								}
							}
							else {
								elem.style.filter = "alpha(opacity=" + parseFloat(opacitySingal) * 100 + ")";
								elem.style['opacity'] = parseFloat(opacitySingal);
							}
					 		
					 	}
						
						for (var i = 0; i < speed[m].length; i++) 
						{
							var currentState = parseInt(elem.style[setQueueList[i]]);	//当前状态
							var endState = parseInt(domArgu[setQueueList[i]]);			//结束状态

							if (speed[m][i] > 0) {	//speed大于0,证明:终点大于起点.
								if(currentState + speed[m][i] >= endState) {
									elem.style[setQueueList[i]] = domArgu[setQueueList[i]];	 //直接等于终点
								}
								else 
								{
									elem.style[setQueueList[i]] = currentState + speed[m][i] + unit[m][i];
								}
							}

							else 	//speed小于0,证明:终点小于起点.
							{	
								if(currentState + speed[m][i] <= endState) {
									elem.style[setQueueList[i]] = domArgu[setQueueList[i]];
								}
								else {
									elem.style[setQueueList[i]] = currentState + speed[m][i] +  unit[m][i];
								}
							}
						}
					}
				}
			}
		}, time);



	}

	else {	
		//异步顺序执行,	首先查看元素,按照元素先后顺序执行,而后,按照传入参数的顺序移动,
		//设计思想,一个动作结束之后,在进行下一个动作.结束之后,触发一下个定时器.
		//这里可以使用栈的模式来思考.将数据全部压入栈内,然后依次执行.执行后出战.

		//定义全局动作栈
		animateStack = {
			elements : [],		//元素.
			attr     : [],		//属性 
			start    : [],		//起始点
			end      : [],		//终点
			unit     : []		//单位
		};	

 		for (var k = 0; k != length; k++) {		//获取所有选择元素的的初始化属性,和常规移动速度.
	 		var elem = elements[k];				//赋值,当前元素

			for (var i = 0; i != setQueueList.length; i++) 
			{
				animateStack['elements'].push(elem);
				
				var start = parseInt(gStyle(elem, setQueueList[i]));
				var unit = trim(gStyle(elem, setQueueList[i]).replace(/[\d]*/, ''));		//去掉所有的数字.然后在去掉多余的空格.获取单位.
				var end = parseInt(domArgu[setQueueList[i]]);
				
				animateStack['attr'].push(setQueueList[i]);
				animateStack['start'].push(start);
				animateStack['end'].push(end);
				animateStack['unit'].push(unit);
			}

		 }

		//定义局部全局变量
		var someActionIsFinsh = true;		//一个标签的某一个事件是否完成.如果完成就是true.执行下一件事情.
		var singalAction = false;			//判断是否在运动中.false停止, true运动中,
		var syncelement = null;
		var syncattr = null;
		var syncstart = null;
		var syncend = null;
		var syncunit = null;

		var interval = setInterval(function () {

			//事件都执行结束了,并且元素为空了.没有继续执行的元素了.
			if (singalAction == false && someActionIsFinsh == false && animateStack['elements'].length == 0) {		
				clearInterval(interval);	//永远停止.
			}

			if (someActionIsFinsh == true) {		//获取参数.
				syncelement = animateStack['elements'].shift();
				if (syncelement == undefined) {
					clearInterval(interval);	//永远停止.
					return this;
				}
				syncattr = animateStack['attr'].shift();
				syncstart = animateStack['start'].shift();
				syncend = animateStack['end'].shift();
				syncunit = animateStack['unit'].shift();

				someActionIsFinsh = false;
			}

			if (syncstart < syncend) {		//证明终点在起点的右侧.step要大于0
				singalAction = true;
				step = Math.abs(step)
				syncstart += step;			//改变状态.

				if (syncstart >= syncend) {
					syncelement.style[syncattr] = syncend +  syncunit;
					someActionIsFinsh = true;
					singalAction = false;
				}
				else
				{	
					syncelement.style[syncattr] = syncstart +  syncunit;
				}


			}
			else {
				singalAction = true;
				step = Math.abs(step) * (-1);
				syncstart += step;			//改变状态.

				if (syncstart <= syncend) {
					syncelement.style[syncattr] = syncend + syncunit;
					someActionIsFinsh = true;
					singalAction = false;
				}
				else
				{	
					syncelement.style[syncattr] = syncstart +  syncunit;
				}
			}

		}, time);
	}

	return this;
};


/************************************************************************
函数:透明度改变:
参数: 	最好是 {0, (1, 100]} 的整数.
			但是也接受 [0, 1]之间的整数和小数.

返回值:osye的对象.
************************************************************************/
Osye.prototype.opacity = function (num) {

	if (!isNumbers(num)) {
		console.log('opacity function arguments is wrong.');
		return this;
	}
	var ieNum = null;

	if (num >= 0 && num <= 1) {
		ieNum = "alpha(opacity=" + parseInt(num * 100) + ")";		//IE浏览器是0到100.
	}
	else if (num > 0 && num < 100 && num > 1) {
		var ieNum = "alpha(opacity=" + num / 100 + ")";
		num = num / 100;											//非IE是0-1.
	}
	
	for (var i = 0; i < this.length; i++) {

		this.elements[i].style.opacity = num;
		this.elements[i].style.filter = ieNum;
	}

	return this;
}







/*****************************************Osye原型函数定义结束**********************************************************************************************/

/************************************************************************
/*
//一直在思考一个问题,一直没有封装ready这个函数,想想是如何实现的.
//(1)其实可以考虑,在网页底部设定一个信号锚点,看这个锚点是否可以获取了.
//在判断浏览器的状态,是否complete,但是如果有iframe标签,这种方法就不适用了,
//需要等iframe加载之后,才可以,果断放弃.

http://dengo.org/archives/1037 参考资料,感谢作者.

看了一下这个人的思路,除了IE6.7.8做个兼容之外,其他的浏览器大都支持DOMContentLoaded事件.
那就分为2类,做个兼容就可以了.
下面我借鉴他的思路,封装一个函数,实现下ready.也可以将$sy库的加载时间提前.
*************************************************************************/
function domReadyLoad(fun) {
	var isReady = false;					//定义是否已经加载完成,false没有,true有
	var sydomReadyloadtimer = null;			//定义事件
	var sys =  $sy.prototype.browserSys;	//赋值定义浏览器的类型.

	function executeFunction () {					//将要执行的函数.
		if (sydomReadyloadtimer) {					//如果有事件对象,就将事件干掉
			clearInterval(sydomReadyloadtimer);
		}
		fun();										//传入将要执行的函数.
	}

	if ((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)) {
		//这个应该不怎么用.
		sydomReadyloadtimer = setInterval (function () 
		{
			if (document && document.getElementById && document.getElementsByTagName && document.body) 
			{
				executeFunction();
			}
		}, 20);
	} 
	else if (document.addEventListener) {			//W3C
		//W3C标准有DOMContentLoaded这个事件来判断是否加载完成.
		document.addEventListener('DOMContentLoaded', function() {
			executeFunction();
			//arguments.callee :返回正被执行的 Function 对象，也就是所指定的 Function 对象的正文
			//arguments.callee 这个参数很少使用,但是在这里很酷啊.找到你不容易啊
			document.removeEventListener('DOMContentLoaded', arguments.callee, false);		//删除事件绑定函数
		}, false);
	} 
	else if (sys.ie && sys.ie < 9) {				//IE
		var sydomReadyloadtimer = null;
		sydomReadyloadtimer = setInterval (function () 
		{
			try {
				document.documentElement.doScroll('left');
				executeFunction();
			} 
			catch (e) {};
		}, 20);
	}
}


/***********************************************************************/
/***********************************************************************/



/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
	//参数为1的时候,获取DOM标签的对象.并改变初始化的参数.
	if (arguments.length == 1 && arguments[0] != undefined) {
		this.elements = [];
		this.length = 0;

		//如果传入的是函数,OK,这意味着想要在DOM加载完成就执行,而不是等待浏览器全部都加载完成执行.
		if (typeof arguments[0] == 'function') {

			Osye.prototype.ready(arguments[0]);			//将函数添加入ready函数中,在加载完dom之后就立刻执行.
		}

		//如果是字符串,就采用css选择器.进行dom标签选择.
		else if (typeof arguments[0] == 'string') {

			var elements = Sizzle(arguments[0]);		//保存选择器中的筛选的数组.	

			if (elements != null && elements.length != 0) {		//如果选择到元素,改写osye对象.
				this.elements = elements;						//选择器.返回选择的elements.并初始化给osye对象.
				this.length = this.elements.length;				//赋值osye对象的长度.
			}
			// alert('this.length ' + this.length);

		}
		
		//_this_是一个文档对象，undefined也是一个对象，区别与typeof返回的带单引号的'undefined'
		else if (typeof arguments[0] == 'object') 		//如果是对象标签,
		{
			//这里只处理: 元素element=1, 文本text=3, 文档document=9
			if (arguments[0].nodeType == 1 || arguments[0].nodeType == 3 || arguments[0].nodeType == 9) 
			{
				this.elements[0] = arguments[0];	//只选择一个当前this指向的节点
				this.length = 1;					//长度为1
			}
			else if (arguments[0] == window)		//传入的是windows对象
			{	
				// alert('arguments[0] == window');
				return null;	//返回windows对象.停止连缀功能.
			}
			else {
				alert('argument nodeType is don\'t Element(1), Text(3), Document(9). |' + arguments[0].nodeType + " |" );
				return null;
			}
		}
		else {
			alert('argument is undefined or is not object | ' + arguments[0] + " |  $sy initialize is wrong, ");
			return null;
		}
	}

/*****************************************Osye构造函数结束**********************************************************************************************/
};


//使用原型定义全局参数.

/*****************************************************************************/
$sy.prototype.isScreenLock = false;						//定义全局变量判断锁屏变量,初始化为false不锁, true为锁屏.
$sy.prototype.odjScreenLock = null;						//定义锁屏对象,共享变量.锁屏时保存锁屏对象.锁屏时,就会进行相对应的赋值操作.
$sy.prototype.lockzIndex = 99;							//初始化锁屏对象的z-index的值,默认是99.
$sy.prototype.screenLableCenterZindex = 100000;			//设置屏幕居中的z-index参数,默认100000
$sy.prototype.init = false;								//设置屏幕居中的z-index参数,默认100000
$sy.prototype.eventsData = [];							//定义全局事件对象,用于记录全局标签和事件的.
$sy.prototype.browserSys = {};
/*****************************************************************************/




/*=============================================================================================*/






function showEventsIndex () {
	var eventsIndex = $sy.prototype.eventsIndex;
	for (var pro in eventsIndex) {
		alert(eventsIndex[pro]);
	}
	alert(eventsIndex);
}


/******************************************************//******************************************************/
//--------------------------------------全局工具函数-----------------------------------------------------------//

/*******************************************************************
	全局函数都用$sy开头,防止其他函数重名冲突,尽量保证保证安全性.
*******************************************************************/

//弹出预警函数
function warnAlt() {
	;
}


/******************************************************
//$syaddLoadEvent函数是解决window.onload覆盖事件的.
		所有的addEvent函数,全都是追加方法,
意思是,函数执行顺序按照绑定顺序执行.
******************************************************/
function $syaddLoadEvent(func) {
	if (!isFunctions(func)) {
		alert(func + 'is not a function, do\'t attach with $syaddLoadEvent');
		return ;
	}

	var oldonload = window.onload;				//得到上一个onload事件的函数

	if (typeof window.onload != 'function') {	//判断类型是否为'function',注意typeof返回的是字符串
		window.onload = func;
	} 
	else 
	{  
		window.onload = function() {
			oldonload();	//原有的onload的函数
			func();			//追加事件函数
		}
	}
}

/******************************************************
//addEvent函数是解决window.onload覆盖事件的.
		所有的addEvent函数,全都是追加方法,
意思是,函数执行顺序按照绑定顺序执行.
******************************************************/
function $syaddResizeEvent (func) {
	if (!isFunctions(func)) {
		alert(func + 'is not a function, do\'t attach with $syaddLoadEvent');
		return ;
	}

	var oldonresize = window.onresize;				//得到上一个onload事件的函数
	if (typeof window.onresize != 'function') {	//判断类型是否为'function',注意typeof返回的是字符串
		window.onresize = func;
	} 
	else 
	{  
		window.onresize = function() {
			oldonresize();	//原有的onresize的函数
			func();			//调用当前事件函数
		}
	}
}


/******************************************************
//判断是否是数字,可以传入多个参数,同时判断,如果有一个不是数字就返回错误
//用arguments获取函数传入的参数.
******************************************************/
function isNumbers(number) {
	if (arguments.length == 0) {
		alert('function isNumbers is wrong, because of arguments is 0!');
		return false;
	}
	var length = arguments.length;

	for (var i = 0; i < length; i++)
	{
		if (typeof arguments[i] != 'number') { 	//如果参数有不是数字的,就返回false
			console.log(arguments[i] + " is not a number!");
			return false;
		}

	}
		return true;

}

/******************************************************
//判断是否是函数,允许传入多个自变量判断是否是函数
******************************************************/
function isFunctions(fun) {

	if (arguments.length == 0) {
		alert('function isFunctions is wrong, because of arguments is 0!');
		return false;
	}

	for (var i = 0; i < arguments.length; i++)
	{
		if (typeof arguments[i] != 'function') {	//若不是函数就返回.
			console.log(arguments[i] + " is not a function!");
			return false;
		}
	}

		return true;
}


/******************************************************
//判断是否是一个字符串,允许传入多个参数,判断是否是字符串
******************************************************/
function isString (str) {

	if (arguments.length == 0) {
		alert('function isString is wrong, because of arguments is 0!');
		return false;
	}

	for (var i = 0; i != arguments.length; i++)
	{
		//string 有2中构造方式,一种:str = 'string';另一种是:str = new String();
		if (typeof arguments[i] != 'string' && arguments[i].constructor != String) {
			console.log(" arguments " + i + "  " +  arguments[i] + " is not a string!");
			return false;
		}
	}

	return true;
	
}



/******************************************************
//判断是否是一个对象,允许传入多个参数,判断是否是对象
******************************************************/
function isObject (obj) {

	if (arguments.length == 0) {
		alert('function isObject is wrong, because of arguments is 0!');
		return false;
	}

	for (var i = 0; i != arguments.length; i++)
	{
		if (typeof arguments[i] != 'object') {
			console.log(" arguments " + i + "  " +  arguments[i] + " is not a object!");
			return false;
		}
	}

	return true;
}


/******************************************************
//判断是否是一个字符串,允许传入多个参数,判断是否是字符串
//判断class是否存在
参数: 1, 节点,
	  2, 类名 

返回值:如果有返回字串,没有返回null
******************************************************/
function hasClass(element, className) {
	// alert(typeof element);
	return element.className.match(new RegExp('(\\s|^)' +className +'(\\s|$)'));
}






/*****************************************************************************************************/

/******************************************************
//获取浏览器屏幕在桌面上所显示的高度和宽度.
但是必须注意下:要在xhtml格式下才可以.一般我们都将其设置为xhtml
	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml">

//返回值:是osyePoint的对象osyePoint.xLeft是水平宽度,osyePoint.yRight是垂直高度.相对于屏幕左上角。
******************************************************/
function $sygetBrowserShowSize() {
	var screenShowWidth = 0;
	var screenShowHeight = 0;

	if (window.innerWidth)
		screenShowWidth = window.innerWidth;
	else if ((document.body) && (document.body.clientWidth))
		screenShowWidth = document.body.clientWidth;
	//获取窗口高度
	if (window.innerHeight)
		screenShowHeight = window.innerHeight;
	else if ((document.body) && (document.body.clientHeight))
		screenShowHeight = document.body.clientHeight;

	//通过深入Document内部对body进行检测，获取窗口大小
	if (document.documentElement  && document.documentElement.clientHeight && document.documentElement.clientWidth)
	{
		screenShowHeight = document.documentElement.clientHeight;
		screenShowWidth = document.documentElement.clientWidth;
	}

	var syPointScreenSize =  new $syPoint(screenShowWidth, screenShowHeight);	//赋值对象
	// alert(syPointScreenSize.xLeft + " " + syPointScreenSize.yRight);	

	return syPointScreenSize;	// 返回一个点坐标的对象
}


/******************************************************
 * 取窗口滚动条高度和宽度,  
 返回值:是osyePoint的对象
 osyePoint.xLeft是水平宽度,osyePoint.yRight是垂直高度.相对于屏幕左上角
******************************************************/ 
function $sygetBrowserScrollSize() {
	var scrollTop = 0;		//滚动周的垂直距离
    var scrollLeft = 0;		//滚动轴的水平距离

    if(document.documentElement && document.documentElement.scrollTop)
    {
        scrollTop = document.documentElement.scrollTop;
    }
    else if(document.body)
    {
        scrollTop = document.body.scrollTop;
    }
    if(document.documentElement && document.documentElement.scrollLeft )
    {
        scrollLeft = document.documentElement.scrollLeft ;
    }
    else if(document.body)
    {
        scrollLeft = document.body.scrollLeft ;
    }

	var syPointScrollSize =  new $syPoint(scrollLeft, scrollTop);	//赋值对象
	return syPointScrollSize;	// 返回一个点坐标的对象
}


/*****************************
首先只兼容DTD格式的w3c标准

	获取浏览器页面的真实宽度和高度
***********************************/
function $sygetBrowserPageSize () {
	var width = 0;
	var height = 0;
	if (typeof window.innerWidth != 'undefined') {	//FF	解决兼容性问题/
		height = window.innerHeight;
		if (document.body.scrollWidth > window.innerWidth ) {
			width = document.body.scrollWidth;
		}
		else {
			width = window.innerWidth;
		}
	} 
	else {
		height = document.documentElement.scrollHeight;
		if (document.body.scrollWidth > document.documentElement.clientWidth ) {
			width = document.body.scrollWidth;
		}
		else {
			width = document.documentElement.clientWidth;
		}
	}

	var syPointPageSize =  new $syPoint(width, height);	//赋值对象
	return syPointPageSize;	// 返回一个点坐标的对象
}


/*****************************
	函数:用于删除字符串左右两侧空格.
***********************************/
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/mg, '');		//使用正则删除字符串, 前面和后面空格
}


/******************************************************************************
	解决跨浏览器获取css的函数
	http://www.cnblogs.com/flyjs/archive/2012/02/20/2360502.html(感谢作者).

参数1: 元素
参数2: 属性
// return this.elements[i].style[attr];	
// 这里因为有link引入的css外部文件,就必须计算式样式来获取。
************************************************************************/
function gStyle (elem, attr) {

	if (typeof window.getComputedStyle != 'undefined') {	//W3C
		return window.getComputedStyle(elem, null)[attr];	//getComputedStyle只读,不可写
	} 
	else if (typeof elem.currentStyle != 'undefined') {		//IE
		return elem.currentStyle[attr];						//currentStyle返回当前元素的最终属性
	}
}


/****************************************************************************
	取消默认行为,
	参数是: 事件对象.
****************************************************************************/
function stopDefaultBeavior(evt) {

	if (!isObject (evt)) {
		alert('function stopDefaultBeavior is not wrong, because of arguments is not object');
		return false;
	}
	var ev = evt || window.event;
	if ( ev && ev.preventDefault ) 			//如果提供了事件对象，则这是一个非IE浏览器 
	{
		ev.preventDefault(); 				//阻止默认浏览器动作(W3C) 
	}
	else
	{	
		window.event.returnValue = false; 	//IE中阻止函数器默认动作的方式 
		return false;
	}

}



/******************************************************//******************************************************/
//------------------------------工具对象 $sy开头的对象-----------------------------------------//

/*******************************************************
定义一个二维点的坐标对象,相对于屏幕左上角的远点的距离
	参数.x水平向右为正, y数值竖直向下为正.	
	参数可以选择0个,初始化都为0的点.  1个, 初始化为x=y=argument; 
	2个,x= argument[0], y=argument[1]. 判断传入参数,是否是数字. 
*******************************************************/
var $syPoint = function osyePoint(x, y) {

	this.xLeft = 0;		//水平方向距离
	this.yRight = 0;		//竖直方向方向

	if (arguments.length >= 3) {
		alert('arguments.length is wrong, because of arguments.length must <= 2. arguments.length = ' + arguments.length);
		return null;
	}
	if (arguments.length == 0) {		//没有参数.
		alert('arguments.length = ' + arguments.length);	
		this.xLeft = 0;
		this.yRight = 0;
		return this;
	}

	if (arguments.length == 1) {		//一个参数.
		if (!isNumbers(arguments[0])) {
			alert(arguments[0] + ' is not a number!');
		}
		this.xLeft = arguments[0];
		this.yRight = arguments[0];
		return this;
	}

	if (arguments.length == 2) {		//一个参数.
		if (!isNumbers(arguments[0], arguments[1])) {
			alert(arguments[0] + " or " + arguments[1] + ' is not a number!');
		}

		this.xLeft = arguments[0];
		this.yRight = arguments[1];
		return this;
	}
}

/*******************************************************
定义一个全局锁屏对象.
	使用单例模式,保证全局的唯一性.
	选择使用闭包的形式来创建这个对象
参数: 参数为0,
	
	Osye.prototype.lockzIndex 这个属性是设置锁屏对象的z-index属性,如需更改
使用Osye.prototype.lockzIndex = value.原型更改.

创建了一个p,用于锁屏,默认的z-index的为99.关闭锁屏是必须调用内置的destory函数.
*******************************************************/
var $sysingleLocker = function(){

    //锁屏对象
    function LockerConstruct() {
		var label = document.createElement("p");			//创建div标签
		label.setAttribute("id","osyeUniqueLocker");		//设置name属性
		document.getElementsByTagName('body')[0].appendChild(label);
		var pageSize = $sygetBrowserPageSize();					//获取浏览器的长宽
		var labeldom = document.getElementById('osyeUniqueLocker');
		labeldom.style.width = pageSize.xLeft+ "px";			//设置屏幕的水平显示长度
		labeldom.style.height = pageSize.yRight + "px";		//设置屏幕的竖直显示长度
		labeldom.style.background ="#369";					//设置屏幕的背景颜色
		labeldom.style.position = 'absolute';				//设置为绝对定位.
		labeldom.style.left = '0px';						//在浏览器的原点 
		labeldom.style.top = '0px';
		labeldom.style.filter = 'alpha(opacity=30)';		//设置透明度
		labeldom.style.opacity = 0.3;						//设置透明度
		labeldom.style.zIndex = $sy.prototype.lockzIndex;	//默认设置为99.

		if (document.getElementsByTagName('body').length == 1) {
			document.getElementsByTagName('body')[0].appendChild(label);
		}
		else if (document.getElementsByTagName('body').length > 1)		//body超过了1个
		{
			alert('$sysingleLocker Object : the body must only one, but now the body having ocument.getElementsByTagName("body").length = ' + document.getElementsByTagName('body').length);
		}

//对象内的要及时释放,如果是普通函数内,就不用管理了.
		pageSize = null;
		label = null;
		labeldom = null;



    }
    //定义了一个原型函数,用来销毁锁屏标签
	LockerConstruct.prototype.destroy = function () {
		var labeldom = document.getElementById('osyeUniqueLocker');
		labeldom.parentNode.removeChild(labeldom);
		labeldom = null;
	}

    uniqueLocker = new LockerConstruct();		//定义锁屏对象
    
    //添加锁屏时,窗口改变事件的处理函数
    $syaddResizeEvent(function () {
	    //先判断是否锁屏,如果锁屏就返回当前的浏览器大小,锁屏意味着,不能改变浏览器大小,并拒绝页面操作
		if ($sy.prototype.isScreenLock == true) {	//当屏幕锁定
			var pageSize = $sygetBrowserPageSize()
			var bodyDom = document.getElementById('osyeUniqueLocker');
			if (bodyDom == null) {
				alert('body is not exit!');
			}
			// console.log(browser.xLeft + srcoll.xLeft +"  " + browser.yRight);
			bodyDom.style.width = pageSize.xLeft  + "px";			//设置屏幕的水平显示长度
			bodyDom.style.height = pageSize.yRight + "px";			//设置屏幕的竖直显示长度
		}
    });

    return uniqueLocker;		//返回锁屏对象
};







//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//选择器.类似jQuery的Sizzle.为了纪念JQ的划时代的意义,这里就也用Sizzle命名了
//有时间要看一下Sizzle的源码,这里我就凭感觉的写一些常用选择的的实现思路,
// 找个时间,在未来一定要看看Sizzle.会是一个很酷的经历.
//
//			这里先挑选一些我自己平时用过的标签.
//			随心写,随意添加,这里用console来提示,不用alert的强制提示了.
//
//这里我就写成独立的模块算了,jQuery的也是可以拆分出来的.我也想尝试一下.
//看着功能,不看源码,实现源码的功能,想办法去创造一个合理的世界.
/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
//函数作用 : 通过选择器去选择符合规则的标签.
//
//参数1个:字符串.
//
//				这里仿效jQ的原则: #-->id, . --> class, 没有标识的,就是标签.
//
//		支持连续选择, 用空格隔开, 从左到右进行筛选.
//				比如:#id .class lable这种.
//	
//		附加标签:  用 冒号隔开   ":".
//						:first 返回查找到的第一个.
//						:last  返回查找到的最后一个.  
//						这两个可以用在$sy中的eq()来解决,不过,这里也实现下,毕竟要把sizzle完全的剥离出来.
//
//	返回值:一个数组.包含筛选的元素的数组.
/////////////////////////////////////////////////////////////////////////////

function Sizzle () {

	if (arguments.length != 1) {	//参数不是1,证明有问题.最一个字符串.
		alert('Sizzle function is wrong, because of arguments.length != 1 !');
		return null;
	}

	if (typeof arguments[0] != 'string') {
		alert('Sizzle function is wrong, because of arguments type is not string !');
		return null;
	}

//////////////////////////////////////////////////////////////////////////////////////////////////
							//Sizzle工具函数.
//////////////////////////////////////////////////////////////////////////////////////////////////

	/*****************************
		函数:用于删除字符串左右两侧空格.
	***********************************/
	function sizzleTrim(str) {
		return str.replace(/(^\s*)|(\s*$)/mg, '');		//使用正则删除字符串, 前面和后面空格
	}

	/*****************************
		函数:用于删除字符串中间多余的空格.将2个或多个空格,合并为1个.
	***********************************/
	function sizzleMiddleTrim(str) {
		return str.replace(/(\s+)/img, ' ');		//使用正则删除字符串, 前面和后面空格
	}

	/*****************************
		函数:用于调整字符串中有特殊字符的情况,在特殊字符前加1个空格. 
	如果过特殊字符后面没有连接数据, OK,那把后面的空格删掉,与后面的选择器连接,比如
	p: first-->转换为->>> p :first
	p :  first div ->>> p :first div

		这里的特殊字符有 : 冒号, > 大于号, + 加号, ~这个波浪号.

		
		好久不用这个正则分类了,确实好用啊,在正则中被括号(),包含的元素,
		是顺序排序列的,用 "$0",  "$1",可在面使用. 这样就将,特殊选择符和常规选择器分开了.

	后续如果有新的字符应用,就可以添加到这里,进行筛选.
	***********************************/
	function sizzleSeletorFormat(str) {
		return str.replace(/(\s*)([:>~+])(\s*)/img, ' ' + "$2");		//使用正则将 &nbsp&nbsp:, 调整为1个.&nbsp:
	}



	/*****************************
		函数:ID选择器.
		返回值:存在,返回包含元素的数组,没有就是null
	***********************************/
	function gidReturnArray(id) {
		var node = document.getElementById(id);		//获取id的标签.
		var rtnNode = [];							//返回选择节点数据

		if (node != null) {			//判断是否有选择元素
			rtnNode.push(node);		//如果有,就压入数组, id!,就一个.
		}
		else 						// node为null,没有选到.
		{
			rtnNode = null;		
		}

		return rtnNode;
	}

	/*****************************
		函数: class选择器.
		参数: 1:元素筛选的类名, 2:父节点的名称.如果没有设置,就是document
		返回值:存在,返回包含元素的数组,没有就是null
	***********************************/
	function gclassReturnArray(className) {
		var tags = null;

		if (arguments.length == 1) {
			tags = document.getElementsByTagName('*');		//获取id的标签.
		}
		else if (arguments.length == 2)
		{
			tags = arguments[1].getElementsByTagName('*');		//获取id的标签.
		}

		if (tags == null) {
			return null;
		}

		var rtnNode = [];									//返回选择节点数据

		for (var i = 0; i != tags.length; i++) {
			if (tags[i].className == className) {
				rtnNode.push(tags[i]);
			}
		}

		if (rtnNode.length != 0) {
			// alert(rtnNode.length);
			return rtnNode;
		}
		else {
			return null;
		}

	}

	/*****************************
		函数:标签选择器.
		返回值:存在,返回包含元素的数组,没有就是null
	***********************************/
	function gtagReturnArray(tag) {
		var node = '';
		var tags = null;
		//这里不需要转换大小写,测试之后,浏览器应该自动转换,DIV dIV,div都是一个意思.

		if (arguments.length == 1) {
			tags = document.getElementsByTagName(tag);		//获取id的标签.
			// alert('tagName   ');
		}
		else if (arguments.length == 2){
			tags = arguments[1].getElementsByTagName(tag);		//获取id的标签.
			// alert('gtagReturnArray   ' + arguments[1].innerHTML);
		}
		
		if (tags == null) {
			return null
		}
		// alert(tags.length);
		return tags;									//返回选择节点数据

	}


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//				选择器中特殊选择器的筛选
	//	参数: (1) 节点数组.经过筛选的节点元素.
	//		  (2) 选择器的标识,比如first,last,等..,类型是字符串.
	//
	//	返回值: 数组,或者空对象.
	//
	//	http://www.cnblogs.com/onlys/articles/jQuery.html(这里分享了一些常用的jquery的操作,感谢作者)
	//
	//	特殊字符:
	//		(1)  冒号 : 进行部分筛选.
	//			冒号中的元素有, first --- 筛选元素的第一个
	//							last  --- 筛选元素中的最后一个
	//							even  --- 偶数的筛选,从0开始
	//							odd   --- 奇数的筛选.从1开始
	//		(2)这里就不加入eq, > +这种了,主要为自己不太常用,
	//
	//			
	//				但是在$sy的库里面,会有,nextNode,childNode,parrentNode,包括子选择eq(num),这种.
	//		这里就不在添加了.如果有需要,后续继续添加.
	//
	//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	function specialSelector(objNodeList, selector) {

		//判断objNodeList是否是一个数组,数组有length,而object没有length的属性,用这个在区分一下.
		if (typeof objNodeList == 'object' && typeof objNodeList.length == 'number') {

			if (objNodeList.length == 0) {
				console.log('specialSelector function : arguments is wrong.');
				return null;
			}

			var reNode = [];
			switch (selector) {
				//first, 返回数组中的第一个元素,但是要
				case 'first' : {
					reNode.push(objNodeList[0]);
					return reNode;
					// break;
				}

				case 'last' : {
					reNode.push(objNodeList[objNodeList.length - 1]);
					return reNode;
					// break;
				}

				case 'even' : {
					var i = 0;
					while (true) 
					{
						//注意,要有等号.因为,等于的时候,已经无法获取了,数组越界,因为从0开始,
						if (i >= objNodeList.length) 	
							break;
						reNode.push(objNodeList[i]);
						i += 2;
					}

					return reNode;
					// break;
				}

				case 'odd' : {
					if (objNodeList.length < 2) {	//选择器内的元素少于2个,数组长度为1个,无法获取第二个.
						return null;	
					}

					var i = 1;		//偶数.从1开始,因为从0开始计数.
					while (true) 
					{
						//注意,要有等号.因为,等于的时候,已经无法获取了,数组越界,因为从0开始,
						if (i >= objNodeList.length) 
							break;
			
						reNode.push(objNodeList[i]);
						i += 2;
					}
					
					return reNode;
					// break;
				}



				default : {
					return null;
					// break;
				}

			}
			
		}

	}


//////////////////////////////////////////////////////////////////////////////////////////////////
								//Sizzle选择器.
//////////////////////////////////////////////////////////////////////////////////////////////////

	var labelStr = sizzleTrim(arguments[0]);			//去除字符串两侧的空格.
	labelStr = sizzleMiddleTrim(labelStr);				//去除中间多余的空格
	labelStr = sizzleSeletorFormat(labelStr);			//对字符串进中选择进行格式化.
	// alert(labelStr);
	var rtnNode = null;									//返回选择节点数据

	//判断是否有 : 作为选择符, 如果有,将冒号的前面加一个空格,如果有多个空格,调整为1个.




	//判断字符串内是否有空格,返回-1,表示没有空格.就认为是一个标识,id,class,或者标签的名.
	if (labelStr.indexOf(' ') == -1) {			
		//labelStr已经解决了空格问题,这里直接判断第一个字符
		var firstChar = labelStr.charAt(0);		//尽量用charAt.
		
		switch (firstChar) {
			case "#": 	//ID
			{
				labelStr = labelStr.substring(1);		//返回,去掉#的字符串.
				rtnNode = gidReturnArray(labelStr);		//查找ID的元素,有就返回,没有为null.

				break;
			}
			case ".": 	//类
			{
				labelStr = labelStr.substring(1);		//返回,去掉#的字符串.
				rtnNode = gclassReturnArray(labelStr);		//查找ID的元素,有就返回,没有为null.
				
				break;
			}
			default : 	//标签
			{
				rtnNode = gtagReturnArray(labelStr);		//查找ID的元素,有就返回,没有为null.

				break;
			}

		}
		
	}
	//如果有空格,就是分段选择. 例如:#id p 在id节点下面的p标签.
	else  		
	{
		var listlable = labelStr.split(' ');	//按照空格分组.返回数组,至少会有2个,因为前面判断了.有空格.
		var listStr = '';						
		
		for (var i = 0; i != listlable.length; i++) 	//循环分析返回的数组,进行分类处理.
		{	
			var firstChar = listlable[i].charAt(0);		//获取第一个字符
			var tempNode = [];					//存放临时节点,

			switch (firstChar) {

				case "#": 	//ID
				{
					// alert('#');
					listStr = listlable[i].substring(1);		//返回,去掉#的字符串.
					rtnNode = gidReturnArray(listStr);			//查找ID的元素,有就返回,没有为null.
					// alert(rtnNode.length);
					break;
				}
				case ".": 	//类
				{
					// alert('.');	
					tempNode = [];
					listStr = listlable[i].substring(1);			//返回,去掉#的字符串.

					if (rtnNode == null) {							// 第一次查找
						tempNode = gclassReturnArray(listStr, document);	//第一次进入.此前没有找到过元素
					}
					else 
					{

						for (var j = 0; j != rtnNode.length; j++) {
							var arrNode = gclassReturnArray(listStr, rtnNode[j]);		//查找ID的元素,有就返回,没有为null.
							if (arrNode != null) 
							{
								for (var m = 0; m != arrNode.length; m++) {
									tempNode.push(arrNode[m]);
								}
							}
						}
					}

					if (tempNode == null) {		//没有找到,就返回.
						console.log('Sizzle function do not choice one elements! ');
						return null;						
					}

					rtnNode = tempNode;
					// alert("class elements length = " + rtnNode.length);
					break;
				}

				case ":": 	//特殊选择符
				{
					tempNode = [];
					listStr = listlable[i].substring(1);		//返回,去掉#的字符串.
					tempNode = specialSelector(rtnNode, listStr);

					if (tempNode == null) {
						console.log('Sizzle function do not choice one elements! ');
						return null;
					}

					rtnNode = tempNode;
					break;
				}


				default : 	//标签
				{
					// alert('tag');
					tempNode = [];
					if (rtnNode == null) {
						tempNode = gtagReturnArray(listlable[i], document);		//第一次进入.此前没有找到过元素
					}
					else 
					{
						for (var k = 0; k != rtnNode.length; k++) {		
							var arrNode = gtagReturnArray(listlable[i], rtnNode[k]);		//查找ID的元素,有就返回,没有为null.
							if (arrNode != null) {
								for (var m = 0; m != arrNode.length; m++) {
									tempNode.push(arrNode[m]);
								}
							}
						}
					}

					if (tempNode == null) {
						console.log('Sizzle function do not choice one elements! ');
						return null;						
					}

					rtnNode = tempNode;	
					break;
				}
			}
		}
	}


	if (rtnNode == null) {
		console.log('Sizzle function do not choice one elements! ');
		return null;
	}

	return rtnNode;			//返回查找到的元素标签.数字的形式.
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




/******************************************************//******************************************************/
//-----------------------------------全局初始化----------------------------//
(function () {


	//浏览器的检测,看了一下JQ,貌似已经把$.browser这货给干掉了.
	//不建议使用,用navigator.userAgent.
	//个人平时也不怎么搞浏览器检测,但是看偶然在网页上看到浏览器检测.就看一下.
	//这段代码是在摘录,修改得到.原文在:http://www.51xuediannao.com/qd63/index.php/page-2-51-1.html,感谢作者.

	// $sy.prototype.browserSys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;
	(s = ua.match(/msie ([\d.]+)/)) ? $sy.prototype.browserSys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? $sy.prototype.browserSys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? $sy.prototype.browserSys.chrome = s[1] :
	(s = ua.match(/opera.*version\/([\d.]+)/)) ? $sy.prototype.browserSys.opera = s[1] :
	(s = ua.match(/version\/([\d.]+).*safari/)) ? $sy.prototype.browserSys.safari = s[1] : 0;
	if (/webkit/.test(ua)) 
		$sy.prototype.browserSys.webkit = ua.match(/webkit\/([\d.]+)/)[1];


	// $ys = $sy.prototype;
})();

