layui.use(["layer", "laydate", "form", "element"], () => {
    let layer = layui.layer,
        laydate = layui.laydate,
        form = layui.form,
        element = layui.element;

    $("#loginBnt").on("click", function () {
        layer.open({
            type: 1,
            title: "<h3>登录</h3>", //不显示标题栏
            closeBtn: 1,
            area: ["480px", "300px"],
            shade: 0.8,
            id: 'LAY_layuipro', //设定一个id，防止重复弹出
            btn: ['确认', '关闭'],
            btnAlign: 'c',
            moveType: 1, //拖拽模式，0或者1
            content: $("#loginHtml").html(),
            success: function (layero) {
                var btn = layero.find('.layui-layer-btn');
                btn.find('.layui-layer-btn0').attr({
                    href: 'http://www.layui.com/',
                    target: '_blank'
                });
            }
        });
    })

    layer.open({
        type: 1,
        title: "<h3>登录</h3>", //不显示标题栏
        closeBtn: 1,
        area: "320px",
        shade: 0.8,
        id: 'LAY_layuipro', //设定一个id，防止重复弹出
        btn: ['确认', '关闭'],
        btnAlign: 'c',
        moveType: 1, //拖拽模式，0或者1
        content: $("#loginHtml").html(),
        success: function (layero) {
            var btn = layero.find('.layui-layer-btn');
            btn.find('.layui-layer-btn0').attr({
                href: 'http://www.layui.com/',
                target: '_blank'
            });
        }
    });


    //监听登录
    form.on('submit(login)', function (data) {
        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        })
        return false;
    });

    //监听注册
    form.on('submit(register)', function (data) {
        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        })
        return false;
    });

})