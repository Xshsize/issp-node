var app = angular.module('bidding', [{
    files: ['root/biddingManagement/_res/js/service.js']
}]);
app.controller('biddingCtrl', function ($scope,$state) {
    if ($state.current.url == '/biddingManagement') {//默认加载列表
        $state.go('root.biddingManagement.biddingType');
    }
    $scope.$on('changeId',function(event,msg) {
        $scope.$broadcast('getId', msg)
    });
    //父 Ctrl 监听到事件，向下广播
    $scope.$on('page',function(event,msg){
        $scope.$broadcast('pageId',msg)
    });
}).controller('navCtrl',function($scope,$state,$location,bidSer){
    $scope.navCla='websiteInfo';
    var active = $location.path().split('/')[3];
    $scope.navCla=active?active:'websiteInfo';
    $scope.navClass = function(name){
        $scope.navCla = name;
        $scope.$emit('isId',true);//每次切换页面更新搜索值
    };

    bidSer.navPermission().then(function(response){
        if(response.data.code == 0){
            var data = response.data.data;
            if(data && data.length){
                $scope.isHide = false;
                for(var i =0,len=data.length;i<len;i++){
                    var obj = data[i];
                    $scope[obj.name]=obj.flag;
                }
            }else if(response.data.data.length == 0){
                $scope.isHide = true;
            }
        }else{
            $scope.isHide = false;
        }
    });
    bidSer.setPermission().then(function(response){
        if(response.data.code == 0){
            var data = response.data.data;
            if(data && data.length){
                $scope.isHide = false;
                for(var i =0,len=data.length;i<len;i++){
                    var obj = data[i];
                    $scope[obj.name]=obj.flag;
                }
            }else if(response.data.data.length == 0){
                $scope.isHide = true;
            }
        }else{
            $scope.isHide = false;
        }
    });
    $scope.showsList = [
        {id:"1",item:"招投标管理",menuList:[{name7:'1.招投标类型',msg:'biddingType'},{name1:'2.招投标网站信息',msg:'websiteInfo'},
            {name2:'3.招标信息',msg:'biddingInformation'},{name3:'4.开标信息',msg:'openingInfo'},{name4:'5.投标答疑问题记录',msg:'tenderQuestion'},
            {name5:'6.标书资料',msg:'tenderMaterial'},{name6:'7.招投标信息邮件发送',msg:'email'},{name8:'8.招标问题受理和处理',msg:'biddingaccept'},
            {name9:'9.招投标流程进度管理汇总',msg:'collect'},{name10:'10.图形展示数据',msg:'figure'}],showIs:false},
        {id:"2",item:"设置",menuList:[{name11:'1.设置',msg:'setting'}],showIs:false},
        {id:"3",item:"版本信息",menuList:[{name12:'1.版本信息',msg:'version'},{name13:'2.帮助与解答',msg:'help'}],showIs:false}
    ];
    if(active){
        for(var i=0;i<$scope.showsList.length;i++){
            var n=$scope.showsList[i].menuList;
            for(var j=0;j<n.length;j++){
                var m=n[j].msg;
                if(m==active){
                    $scope.showsList[i].showIs=true;
                    break;
                }
            }
        }
    }
    $scope.showMenu = function(obj,event) {
        if(event){
            if(obj.showIs){
                obj.showIs=!event;
            }else{
                obj.showIs=event;
                /* angular.forEach(function(item){ showSubAble sublist*/
                this.showsList.forEach(function(item){
                    if(item.id!=obj.id){
                        item.showIs=!event;
                    }else{
                        item.showIs=event;
                    }
                });
            }
        }
    };
});

app.directive('mod',function(){
    return{
        restrict:'AE',
        replace:true,
        link:function(scope,elements,attrs){
            elements.hover(function(){
                var textWidth = elements.text().length*12;
                var boxWidth = elements.width();

                if(textWidth>boxWidth){
                    elements.addClass('modac');
                }
            });
            elements.dblclick(function(){
                if(elements.hasClass('modac')){
                    $('.module').show();
                    var Index =  elements.index(),
                        title,
                        tag = this.tagName;
                    if(tag=="P"){
                        title =  $(".list-head span").eq(Index).text();
                    }else if(tag=="SPAN"){
                        title = $(this).parent().siblings('.see-parent').children().eq(Index).text();
                    }
                    var conText = elements.text();
                    $('.see-type').text(title);
                    $('.see-description').text(conText)
                }

            })
        }
    }
}).directive('modclose',function(){
    return{
        restrict:'AE',
        replace:true,
        link:function(scope,elements,attrs){
            elements.on("click",function(){
                $('.module').hide();
            });

        }
    }
});