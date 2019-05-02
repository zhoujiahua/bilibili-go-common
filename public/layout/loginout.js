(function () {
    layui.use(["layer"], function () {
        var layer = layui.layer,
            $ = layui.$;

        //注销
        $("#loginOut").on("click", function () {
            var loadTip = layer.load();
            $.getJSON("/api/loginout", {},
                function (res) {
                    if (!res.code) {
                        setTimeout(function () {
                            // $(".login-info").removeClass("layui-show");
                            // $(".login-btn").addClass("layui-show");
                            layer.msg(res.msg);
                            layer.close(loadTip);
                            window.location.reload();
                        }, 600)
                    }
                }
            );

        });
    })

}())