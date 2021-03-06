var app = angular.module('problemList', ['ng-pagination','toastr']);
app.controller('problemListCtrl',function($scope,problemSer,toastr,$stateParams,$state,$location){
    $scope.$emit('changeId', null);
    //监听切换搜索是否出现
    $scope.$on('iSsearch',function(event,newIs){
        $scope.isView = newIs;
    });
    //删除
    //获取id
    
    if($stateParams.id){
        switch ($stateParams.name){
            case 'delete':
                $scope.delShow = true;
                break;
        }
    }
    $scope.cancel = function(){//取消删除
        $scope.delShow = false;
        $state.go('' +
            'root.projectProcessed.problemAccepted.list[12]',{id:null,name:null});
    };

    var count=0;
    $scope.delFn = function(){//确认删除

        var data = {
            id:$stateParams.id
        };

        problemSer.deleteProblem(data).then(function(response){
            if(response.data.code==0){
                count++;
                toastr.info( "信息已删除", '温馨提示');
                $scope.$emit('changeId', null);
                $scope.delShow = false;
                if(($scope.custom.itemsCount-count)%10){
                    $state.go('root.projectProcessed.problemAccepted.list[12]',{id:null,name:null});
                }else{
                    $state.go('root.projectProcessed.problemAccepted.list[12]',{id:null,name:null,page:$stateParams.page-1});
                }
            }else{
                toastr.error( response.data.msg, '温馨提示');
            }
        });
    };
    //获取搜索字段
    $scope.internalProjectName = $stateParams.internalProjectName?$stateParams.internalProjectName:'';
    $scope.projectType = $stateParams.projectType?$stateParams.projectType:'';
    if($stateParams.internalProjectName || $stateParams.projectType){
        $scope.$emit('isId', false);
        $scope.isView = false;
    }else{
        $scope.$emit('isId', true);
    }
    //搜索
    $scope.collect = function(){
       
        $state.go('root.projectProcessed.problemAccepted.list[12]',{internalProjectName:$scope.internalProjectName,projectType:$scope.projectType,page:1});
    }
    function activatePage(page) {
        var listData = {
            internalProjectName:$scope.internalProjectName || " ",
            projectType:$scope.projectType || " ",
            page:page || 1
        };
        problemSer.searchList(listData).then(function(response){
            if(response.data.code == 0){
                $scope.acceptedLists = response.data.data;
                if($stateParams.id){
                    angular.forEach($scope.acceptedLists,function(obj){
                        if(obj.id == $stateParams.id){
                            obj._selectList = true;
                        }
                    });
                    //向父Ctrl传递事件
                    $scope.$emit('changeId', $stateParams.id);
                }
            }else{
                toastr.error( response.data.msg, '温馨提示');
            }
        });
        problemSer.countProblem(listData).then(function(response){
            if(response.data.code==0){
                $scope.custom.itemsCount = response.data.data;
                $scope.num = $location.search().page*10>10?($location.search().page-1)*10:null;
            }else {
                toastr.error( response.data.msg, '温馨提示');
            }
        })
        // };
    }
    // 搜索功能字段
    $scope.titles = ['内部项目名称','工程类型'];
    $scope.selectList = function(event){
        angular.forEach($scope.acceptedLists,function(obj){
                obj._selectList = false
        });
        event._selectList = true;
        $scope.idListd = event.id;
        //向父Ctrl传递事件
        $scope.$emit('changeId', $scope.idListd);
        $scope.$emit('page',$location.search().page);
    };
    //点击更多详细
    $scope.moreList = function(event){
        angular.forEach($scope.acceptedLists,function(obj){
            if(event.id!==obj.id){
                obj._moreList = false
            }
        });
        event._moreList = !event._moreList;
    };
    $scope.$on('deletedId',function(event,delid){
        angular.forEach($scope.acceptedLists,function(obj){
            if(obj.id == delid){
                obj._delete = delid
            }
        })
    });

//分页
    $scope.custom = {
        itemsCount: 2, //总条数
        take: 10, //每页显示
        activatePage: activatePage
    };

    

});

