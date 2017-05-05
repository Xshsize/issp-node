/**
 * Created by ike on 2017/4/17.
 */
var app = angular.module('marketserveAdd', ['toastr']);
app.controller('mmuiAddCtrl', function($scope, mmuiSer,$state,toastr){
    //添加
    $scope.companyAddFun = function(){
        $scope.data.profit = Number($scope.num).toFixed(2);//预计费用
        var data = $scope.data;
        mmuiSer.addMarketserveapply(data).then(function(response){
            console.log(response)
            if(response.data.code == 0){
                $state.go('root.projectmeasure.interface.mmui.list');
                toastr.success( "已成功添加", '温馨提示');
            }else if(response.data.code==403){
                toastr.error( "请登录用户", '温馨提示');
            }
        });
    };
    //控制数字不能小于1
    $scope.changeNum =function(){
        if($scope.data.predictAttendNo < 1){
            $scope.data.predictAttendNo = 1;
        }
    }
});



